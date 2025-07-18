from __future__ import annotations

import os
from typing import Any, Dict, List

from openai import AuthenticationError, OpenAI
from services.db import fetch_latest_report, prepare_tool_input

_MODEL_CHAT = "gpt-3.5-turbo"
_MODEL_FEEDBACK = "gpt-4"

# Singleton OpenAI client
def _create_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not set")
    return OpenAI(api_key=api_key)

_client = _create_client()  


def _safe_completion(*, model: str, messages: List[Dict[str, str]]) -> str:
    """Wrapper around OpenAI chat call that handles exceptions."""
    try:
        resp = _client.chat.completions.create(model=model, messages=messages)
        return resp.choices[0].message.content
    except AuthenticationError as e:
        raise RuntimeError("OpenAI authentication failed") from e
    except Exception as e:
        raise RuntimeError(f"OpenAI call failed: {e}") from e



def generate_feedback_from_db(user_email: str) -> str:
    """Fetch report from DB and generate AI feedback."""
    report = fetch_latest_report(user_email)
    if not report:
        return "No report found for this user."

    tool_input = prepare_tool_input(report)
    prompt = (
        "Based on the following weekly report data, provide helpful and "
        "constructive short feedback:\n"
        f"Notes: {tool_input['notes']}\n"
        f"Scores: {tool_input['scores']}\n"
        f"Chat: {tool_input['chat']}"
    )
    return _safe_completion(model=_MODEL_FEEDBACK, messages=[{"role": "user", "content": prompt}])


def generate_feedback(notes: str, scores: Dict[str, Any], chat: List[str]) -> str:
    prompt = (
        f"User notes: {notes}\nScores: {scores}\nChat history: {chat}\n\n"
        "Give helpful, encouraging weekly feedback."
    )
    return _safe_completion(model=_MODEL_FEEDBACK, messages=[{"role": "user", "content": prompt}])


def chat_response(user_input: str) -> str:
    return _safe_completion(
        model=_MODEL_CHAT,
        messages=[
            {"role": "system", "content": "You're a helpful assistant."},
            {"role": "user", "content": user_input},
        ],
    )


# ─── Optional startup smoke test ───────────────────────────────────────────────

if __name__ == "__main__":
    print("Running quick connectivity check …")
    try:
        out = chat_response("Write a confirmation that the AI is connected.")
        print("✅  OpenAI responded:", out)
    except RuntimeError as err:
        print("❌  OpenAI call failed:", err)
