from flask import Flask, request, jsonify
import paramiko
import boto3

from flask import Flask, request, jsonify
import boto3

app = Flask(__name__)

# Replace these values with your own
INSTANCE_ID = 'i-06b62ff909db701df'
REGION = 'us-east-1'

ec2 = boto3.resource('ec2', region_name=REGION)

# Define the commands to execute before the script
PRE_SCRIPT_COMMANDS = [
    'echo "Executing commands before script..."',
    'cd project-main',  # Example: enter into folder
    'source project_env/bin/activate', # activate virtual environment
    'cd code',
    'python3 main.py',  # Example: run llamaindex
]

def run_script_on_ec2(script_text):
    instance = ec2.Instance(INSTANCE_ID)

    # Connect to the instance using SSH and execute the commands
    command = '\n'.join(PRE_SCRIPT_COMMANDS + [script_text])
    response = instance.send_command(
        DocumentName="AWS-RunShellScript",
        Parameters={'commands': [command]}
    )

    # Get the output of the script execution
    output = response['Command']['PluginOutput']

    return output

@app.route('/run_script', methods=['POST'])
def run_script():
    data = request.get_json()
    script_text = data.get('script_text')

    if script_text is None:
        return jsonify({'error': 'Missing script_text parameter'}), 400

    output = run_script_on_ec2(script_text)

    return jsonify({'output': output})

if __name__ == '__main__':
    app.run(debug=True)
