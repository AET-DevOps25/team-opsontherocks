from flask import Flask

app = Flask(__name__)

@app.route('/langchain/hello', methods=['GET'])
def hello_python():
    return "Hello from Python (LangChain Service)", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
