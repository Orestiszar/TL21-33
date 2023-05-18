# Test-api

#### Files dedicated to test the API endpoints


## Summary
For testing the API, we used **mocha** and **chai** npm modules. By inserting some valid tests through CSV, we test if the API returns the required status code and valid data, by comparing them to the CSV. 

---
## NPM Modules

- **chai and chai-http**, for creating the API test
- **fs**, for reading the test csv's
- **mocha**, for running the test cases
- **mysql**, for not changing the databse after the tests

---
## Requirements
For running the tests, Nodejs is required and the mysql database must be activate
