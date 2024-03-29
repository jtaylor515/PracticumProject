import subprocess

def run_commands():
    print("Executing commands before script...")
    
    # Change directory to project-main
    subprocess.run(["cd", "project-main"], shell=True)
    
    # Activate virtual environment
    subprocess.run(["source", "project_env/bin/activate"], shell=True)
    
    # Change directory to code
    subprocess.run(["cd", "code"], shell=True)
    
    # Run main.py and interact with it
    process = subprocess.Popen(["python3", "main.py"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    # Send input to the process
    input_text = "Show me the best Mexican restaurants in Atlanta with good burritos and margaritas\n"
    process.stdin.write(input_text)
    process.stdin.flush()
    
    # Read output from the process
    output = process.stdout.readline()
    print("Output from main.py:", output)
    
    # Close the process
    process.stdin.close()
    process.stdout.close()
    process.stderr.close()
    process.wait()

if __name__ == "__main__":
    run_commands()
