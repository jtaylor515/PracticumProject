from flask import Flask, jsonify, request
import subprocess

app = Flask(__name__)

@app.route('/date', methods=['GET'])
def get_date():
    result = subprocess.check_output(['date']).decode('utf-8')
    return jsonify({'date': result.strip()})

@app.route('/llm', methods=['GET','POST'])
def  get_llm():
    if request.method == 'GET':
        return jsonify({'greet': 'good job'})
    elif request.method == 'POST':
        request_data = request.get_json()
        data = request_data['input']
        # Open subprocess to interact with interact.py
        process = subprocess.Popen(['python3', 'main.py'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        # Communicate with subprocess, sending input_text
        stdout, stderr = process.communicate(input=data)
        return jsonify({'output': stdout.strip()}), 200

@app.route('/greet', methods=['GET', 'POST'])
def get_greet():
    if request.method == 'GET':
        return jsonify({'greet': 'Hello World!'})
    elif request.method == 'POST':
        request_data = request.get_json()
        data = request_data['name']
        result = subprocess.check_output(['python3', 'helloworld.py']).decode('utf-8')
        return jsonify({'output': result.strip(), 'input': data.strip()}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0')
