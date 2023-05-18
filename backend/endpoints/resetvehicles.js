const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const spawn = require('child_process').spawn;
var session = require('./session');

const sql_params = {
    host: "localhost",
    user: "root",
    password: "",
    database: "tl21"
}

function doresetvehicles(req, res) {
    var temp = session.get_auth(req);
    var auth = temp.auth;
    if (auth == false || parseInt(auth) < 2) {
        res.status(401).send("NOT AUTHORIZED").end();
    }
    else {
        var con = mysql.createConnection(sql_params);

        con.connect(function (err) {
            if (err) {
                res.status(500).send("Couldn't connect to the DataBase")
                return console.error('error: ' + err.message);
            }
            let myquery = "DELETE FROM e_pass"
            con.query(myquery, function (err, result, fields) {
                if (err) {
                    res.status(400).send("Request Failed")
                    return console.error("Failed to execute sql request")
                }
                console.log("Truncated table e_pass")
                con.end();
                console.log("Starting the initialization...");
                var proc = spawn('python', ['../backend/reset_scripts/insert_vehicles.py']);
                proc.stderr.on('data', (data) => console.log(data.toString()));
                proc.stdout.on('data', (data) => {
                    let temp = data.toString();
                    temp = temp.substring(0, 9);
                    if (temp != "Commit OK") {
                        res.status(400).send({ 'status': "Failed" });
                        return console.error("Initialization failed");
                    }
                    res.status(200).send({ 'status': "Re-initialization complete" });
                    console.log("e_pass table initialized");
                })
            });

        });
    }
}

router.post('/admin/resetvehicles', doresetvehicles);
module.exports = router;
