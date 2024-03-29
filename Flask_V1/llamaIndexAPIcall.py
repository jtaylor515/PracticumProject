import requests
import json

# Replace these values with your own
API_URL = 'http://127.0.0.1:5000/run_script'
# SCRIPT_TEXT = '''
# Show me the best Mexican restaurants in Atlanta with good burritos and margaritas
# '''
SCRIPT_TEXT = '''
    echo "Executing commands before script..."'
    cd project-main'
    'source project_env/bin/activate'
    'cd code'
    'python3 main.py'
'''

def post_run_script_api(script_text):
    # Prepare the request payload
    payload = {
        'script_text': script_text
    }
    
    # Send the POST request
    response = requests.post(API_URL, json=payload)
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        output = data.get('output')
        print("Output from script execution:")
        print(output)
    else:
        print(f"Error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    post_run_script_api(SCRIPT_TEXT)
