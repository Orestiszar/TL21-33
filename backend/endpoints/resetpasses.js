const con = require("../config/db.config");
const express = require('express');
const router = express.Router();
var session = require('./session');


function doresetpasses(req, res) {
    var temp = session.get_auth(req);
    var auth = temp.auth;
    if (auth == false || parseInt(auth) < 2) {
        res.status(401).send("NOT AUTHORIZED").end();
    }
    else {
        let myquery = "DELETE FROM transaction";
        let admintruncquery = "TRUNCATE TABLE admin";
        let init_admin_query = "INSERT INTO admin(username, password, email, authority_level, state) VALUES ('admin', 'freepasses4all', 'admin@gmail.com', 2, 0)";
        con.query(myquery, function (err, result, fields) {
            if (err) {
                res.status(400).send({ "Status": "Failed" });
                return console.error("Failed to execute sql request");
            }
            console.log("Truncated table transaction");
            con.query(admintruncquery, function (err, result, fields) {
                if (err) {
                    res.status(400).send({ "Status": "Failed" });
                    return console.error("Failed to execute sql request");
                }
                console.log("Truncated Admin");
                con.query(init_admin_query, function (err, result, fields) {
                    if (err) {
                        res.status(400).send({ "Status": "Failed" });
                        return console.error("Failed to execute sql request");
                    }
                    console.log("Added Admin");
                    res.status(200).send({ "status": "OK" });
                });
            });
        });
        
    }
}

router.post('/admin/resetpasses', doresetpasses);
module.exports = router;
