# test-cli

Tests the CLI commands using python and unit testing each function

## Requirements
Uses the pytest library for python for functional testing.

For unit and functional testing, Node.js and MySQL are required

## Python Libraries
Python uses these libraries for testing:
- **Mysql connector python**, for connecting into our database
- **Pandas**, for reading CSV files
- **subproccess**, for creating sub proccesses to run the test
- **os**, for pathing and controling the console results

## NPM Dependencies
- **mocha-sinon**, for running the CLI functional testing 
- **fs**, for reading files and writing to them
- **chai and chai-files**, for creating the test parameters
- **process**, for using the **exit()** method and quitting testing


## Installation

Database and API installations are required, which are explained in their corresponding readme

Pytest can be installed usind the command:

> pip install -U pytest

Also, to run mocha (_like the API testing_), the user must run the command:

>npm install mocha -g
