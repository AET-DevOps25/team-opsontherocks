"""
GenAI Service

This module includes the core Flask application, OpenAI integration logic, database access utilities, and ORM models
for a microservice that delivers AI-generated feedback based on user reflections. The service uses OpenAI's chat
models to analyze historical reports and provide coaching-like responses.

Main components:
- app.py: REST API entry points and authentication
- llm.py: OpenAI interaction helpers
- services/: DB access and ORM models
"""

import functools
import jwt
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger

#from example import generate_feedback_from_db, chat_response
from llm import generate_feedback_from_db, chat_response
app = Flask(__name__)
Swagger(app)
CORS(app, resources={r"/*": {"origins": [
    "https://opsontherocks.student.k8s.aet.cit.tum.de",
    "https://client.54.166.45.176.nip.io",
    "http://localhost:5173"
]}}, supports_credentials=True)

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALG = "HS512"  # Same as Spring

def requires_auth(fn):
    """Decorator for protecting routes using JWT authentication."""
    @functools.wraps(fn)
    def wrapper(*args, **kw):
        token = None
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
        if token is None and "JWT_TOKEN" in request.cookies:
            token = request.cookies["JWT_TOKEN"]
        if token is None:
            return jsonify(error="Missing JWT"), 401
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
            request.user_email = payload["sub"]
        except jwt.ExpiredSignatureError:
            return jsonify(error="Token expired"), 401
        except jwt.InvalidTokenError as e:
            return jsonify(error=f"Invalid token: {e}"), 401
        return fn(*args, **kw)
    return wrapper

@app.route("/hello", methods=["GET"])
@requires_auth
def hello_python():
    """
    A hello endpoint for the GenAI service.
    ---
    tags:
      - GenAI
    responses:
      200:
        description: Returns a hello message with the user's email
    """
    return f"Hello {request.user_email}! (from GenAI service)", 200

@app.route("/generate-feedback", methods=["GET"])
@requires_auth
def feedback_route():
    """
    Generate feedback for the current user from the latest report.
    ---
    tags:
      - GenAI
    responses:
      200:
        description: Returns generated feedback
      500:
        description: Error occurred
    """
    try:
        user_email = request.user_email
        feedback = generate_feedback_from_db(user_email)
        return jsonify({"feedback": feedback})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/chat", methods=["POST", "GET"])
@requires_auth
def chat_route():
    """
    Chat endpoint for GenAI service.
    ---
    tags:
      - GenAI
    parameters:
      - name: message
        in: query
        type: string
        required: false
        description: Message to send to the AI (GET)
      - name: message
        in: body
        schema:
          type: object
          properties:
            message:
              type: string
        required: false
        description: Message to send to the AI (POST)
    responses:
      200:
        description: Returns AI reply
    """
    if request.method == "POST":
        body = request.get_json()
        user_input = body.get("message", "")
    else:
        user_input = request.args.get("message", "")

    return jsonify({"reply": chat_response(user_input)})

@app.route("/health", methods=["GET"])
def health():
    """
    Health check endpoint for GenAI service.
    ---
    tags:
      - GenAI
    responses:
      200:
        description: Service is healthy
    """
    return jsonify({"status": "ok"}), 200

@app.route("/test", methods=["GET"])
def test_connection():
    return {"status": "ok", "message": "GenAI service is running!"}, 200


def create_test_app():
    app = Flask(__name__)

@app.route("/test")
def test_endpoint():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    if JWT_SECRET is None or len(JWT_SECRET) < 64:
        raise RuntimeError("JWT_SECRET env var missing or too short (≥ 64 chars needed)")
    app.run(host="0.0.0.0", port=5001)