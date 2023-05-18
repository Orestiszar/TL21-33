// const JsonOrCsv = require('./JsonOrCsvModule');
let mytemp = require('./JsonOrCsvModule');
const JsonOrCsv = mytemp.JsonOrCsv;
const axios = require('axios');
const https = require('https');
const fs = require('fs');

const myhttpsAgent = new https.Agent({ rejectUnauthorized: false}); // (NOTE: this will disable client verification)

module.exports = async function (httpsmethod, methodURL, format, filename) {
    var credential;
    if (filename == 'healthcheck' || filename == 'resetpasses' || filename == 'resetstations' || filename == 'resetvehicles')
        credential = 'SESS=adminfreepasses4all2%3A%3Aadmin'; //hardcoded
    else if (!fs.existsSync(__dirname +'\\cookie')) {
        console.log('Action not allowed');
        return;
    } else {
        credential = fs.readFileSync(__dirname+'\\cookie');
    }
    try {
        const res = await axios({
            method: httpsmethod,
            url: methodURL,
            headers: {
                Cookie: credential
            },
            data: {},
            httpsAgent: myhttpsAgent
        });
        JsonOrCsv(res.data, format, filename + ".csv");
    } catch (error) {
        console.log(error.response.data);
    }
}