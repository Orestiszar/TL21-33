const mysql = require('mysql');
let dbConn = null; 
let connectFreq = 10000; // When database is disconnected, how often to attempt reconnect (10s)
let testFreq = 30000;    // After database is connected, how often to test connection is still good (30s)

function tryConnection(callback) {
    //console.log('tryConnection')
    
    dbConn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tl21'
    });

    testConnection((result) => {
      callback(result)
    })
}

function testConnection(cb) {
  //console.log('testing Connection')
  dbConn.query('SELECT 1 AS testing', (error, results) => {
    try {
      if (error) {
        throw new Error('No DB Connection');
      } 
      else {
        if (results[0].testing) {
          cb(true)
        } else {
          cb(false)
        }
      }
    } catch (e) {
      // console.error(e.name + ': ' + e.message);
      cb(false)
    }
  });
}

function checkingDbStatus(res) { // function to handle status of Database through functions 
  if (res) {
    // console.log('Database is running smoothly ( ͡° ͜ʖ ͡°). Next validation in', testFreq, 'ms')
    setTimeout(testConnectionCB, testFreq); // if db is up just check everything is OK
  } else {
    console.log('Database failed to connect (~_~). Next attempt in', connectFreq, 'ms')
    setTimeout(beginConnection, connectFreq); // if db is shit restard initial function
  }
}

function testConnectionCB() { // function for validating health of Database
  testConnection((result) => {
    checkingDbStatus(result);
  })
}

function beginConnection() { //initiall function to start
  tryConnection(result => {
    checkingDbStatus(result);
  });
}

beginConnection(); // Start the process by calling this once

module.exports = dbConn;