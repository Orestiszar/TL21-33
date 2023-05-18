import subprocess

print("Initialize Scripts")
process = subprocess.run('npm install', shell=True)
print("Install MySQL Connector")
process = subprocess.run('pip install mysql-connector-python', shell=True)
print("Install pandas")
process = subprocess.run('pip install pandas', shell=True)
print("Install Pytest")
process = subprocess.run('pip install pytest', shell=True)
print("Install mocha")
process = subprocess.run('npm install mocha -g', shell=True)
print("")
process = subprocess.run('npm install ./cli/ -g', shell=True)

print("Installation done")
