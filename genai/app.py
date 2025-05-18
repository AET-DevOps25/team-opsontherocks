from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route('/hello', methods=['GET'])
def hello_python():
    return "Hello from Python (LangChain Service)", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
