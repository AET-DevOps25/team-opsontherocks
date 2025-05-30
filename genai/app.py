import functools
import jwt
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv('CLIENT_ORIGIN', 'http://localhost:5173')}}, supports_credentials=True)

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALG = "HS512" # Same as Spring

def requires_auth(fn):
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
    return f"Hello {request.user_email}! (from GenAI service)", 200

if __name__ == "__main__":
    if JWT_SECRET is None or len(JWT_SECRET) < 64:
        raise RuntimeError("JWT_SECRET env var missing or too short (≥ 64 chars needed)")
    app.run(host="0.0.0.0", port=5001)
