const express = require('express');
const app = express();

const https = require('https');
const fs = require('fs');

const cors = require('cors');

const port = 9103;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var path = require('path');

const baseUrl = '/interoperability/api/';

app.get(baseUrl, (req, res) => {
    res.status(200).send('Test just worked!! ');
});
app.use(express.static(path.join(__dirname, '.')));

function doexit() {
    exit(0);
}

var options = {
    key: fs.readFileSync(path.join(__dirname, '\\Certificate\\CA\\localhost\\localhost.decrypted.key')),
    cert: fs.readFileSync(path.join(__dirname, '.\\Certificate\\CA\\localhost\\localhost.crt'))
}

const endpoint_path = "../backend/endpoints/";

const healthcheck = require(endpoint_path + "healthcheck.js");
const resetpasses = require(endpoint_path + "resetpasses.js");
const resetvehicles = require(endpoint_path + "resetvehicles.js");
const passesperstation = require(endpoint_path + "passesperstation.js");
const resetstations = require(endpoint_path + "resetstations.js");
const passesanalysis = require(endpoint_path + "passesanalysis.js");
const passescost = require(endpoint_path + "passescost.js");


const statsperstation = require(endpoint_path + "statsperstation.js");
const settlementcalcs = require(endpoint_path + "settlementcalcs.js");
const deposit = require(endpoint_path + "deposit.js");
const newtransaction = require(endpoint_path + "newtransaction.js");
const chargesby = require(endpoint_path + "chargesby");

const login = require("../backend/credentials/login.js");
const logout = require("../backend/credentials/logout.js");
const { exit } = require('process');
const { application } = require('express');

app.use(cors({credentials: true}));

app.use(baseUrl, healthcheck);
app.use(baseUrl, passesperstation);
app.use(baseUrl, resetpasses);
app.use(baseUrl, resetstations);
app.use(baseUrl, resetvehicles);
app.use(baseUrl, passescost);

app.use(baseUrl, passesanalysis);

app.use(baseUrl, statsperstation);
app.use(baseUrl, settlementcalcs);
app.use(baseUrl, deposit);
app.use(baseUrl, newtransaction);
app.use(baseUrl, chargesby);

app.use(baseUrl, login);
app.use(baseUrl, logout);


https.createServer(options, app).listen(port);

module.exports.app = app;
module.exports.doexit = doexit;