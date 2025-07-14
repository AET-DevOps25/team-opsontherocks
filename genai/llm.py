from openai import OpenAI
import os, json
from services.db import fetch_latest_report, prepare_tool_input

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# Test if AI is connected
response = client.chat.completions.create(
    model="gpt-3.5-turbo",  # or "gpt-3.5-turbo", etc.
    messages=[
        {"role": "user", "content": "Write a confirmation that ai is connected."}
    ]
)
print(response.choices[0].message.content)

# Tool schema
"""
tools = [{
    "type": "function",
    "name": "generate_feedback",
    "description": "Generate short helpful, constructive weekly feedback based on the user's self-reflection.",
    "parameters": {
        "type": "object",
        "properties": {
            "notes": {"type": "string", "description": "User-written notes about their week."},
            "scores": {"type": "object", "description": "Category-based numerical scores from 1-10."},
            "chat": {"type": "array", "items": {"type": "string"}, "description": "Conversation between the user and AI over the week."}
        },
        "required": ["notes", "scores", "chat"],
        "additionalProperties": False
    }
}]"""

# Main function that prepares data and gets AI feedback
def generate_feedback_from_db(user_email: str) -> str:
    report = fetch_latest_report(user_email)

    if not report:
        return "No report found for this user."

    tool_input = prepare_tool_input(report)

    response = client.chat.completions.create(
        model="gpt-4",  # Use gpt-4 or gpt-3.5-turbo
        messages=[
            {
                "role": "user",
                "content": (
                    "Based on the following weekly report data, provide helpful and constructive short feedback:\n"
                    f"Notes: {tool_input['notes']}\n"
                    f"Scores: {tool_input['scores']}\n"
                    f"Chat: {tool_input['chat']}"
                )
            }
        ]
    )

    return response.choices[0].message.content


# Optional helper
def generate_feedback(notes: str, scores: dict, chat: list[str]) -> str:
    # This function can just wrap the logic or re-call OpenAI if needed
    prompt = f"User notes: {notes}\nScores: {scores}\nChat history: {chat}\n\nGive helpful, encouraging weekly feedback."
    followup = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return followup.choices[0].message.content


# Previously attempted tool calling logic (left for reference)
# response = client.responses.create(
#     model="gpt-3.5-turbo",
#     input=[{"role": "user", "content": "evaluate the provided report or say im working"}],
#     tools=tools
# )
# print(response.output)
# print(response.model_dump_json(indent=2))

# Confirm connection again (optional)
print(response.choices[0].message.content)




def chat_response(user_input: str) -> str:
    # Simple back-and-forth with the assistant
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # or "gpt-4"
        messages=[
            {"role": "system", "content": "You're a helpful assistant."},
            {"role": "user", "content": user_input}
        ]
    )
    return response.choices[0].message.content