import os
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

client_origin = os.getenv('CLIENT_ORIGIN', 'http://localhost:5173')
CORS(app, resources={r"/*": {"origins": client_origin}})

@app.route('/hello', methods=['GET'])
def hello_python():
    return "Hello from Python (LangChain Service)", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
