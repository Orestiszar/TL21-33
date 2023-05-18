const con = require("../config/db.config");
const express = require('express');
const router = express.Router();
var session = require('./session');


function donewtrans(req, res) {

    var temp = session.get_auth(req);
    var auth = temp.auth;
    var op  = temp.op;
    if (auth == false  || parseInt(auth) < 1) {
        res.status(401).send("NOT AUTHORIZED").end();
    }
    else {
        
        let query1 = "SELECT DISTINCT e_pass_tagID as tagID, e_pass_vehicleID as vehicleID, toll_post_tollID as tollID, rate FROM transaction ";
        con.query(query1, (err, result) => {
            if (err) {
                res.status(400).send("Error during query");
                return console.error("Error during query");
            }

            //json["NumberOfTransactions"] = result.length

            let tagIDList = [];
            let vehicleIDList = [];
            let tollIDList = [];
            let rateList = [];
            if( Object.keys(result).length === 0){
                res.status(402).send('Empty Responce');
                return console.log('Empty Responce');
            }
            Object.keys(result).forEach((key) => {
                tagIDList.push(result[key].tagID);
                vehicleIDList.push(result[key].vehicleID);
                tollIDList.push(result[key].tollID);
                rateList.push(result[key].rate);
       
            })
            

            let timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')
            let infos = [] // result for insert query
            // tagID and vehicleID cannot be different
            let number1 = Math.floor(Math.random()*result.length)

            infos.push(timestamp)
            infos.push(rateList[Math.floor(Math.random()*result.length)])
            infos.push(tagIDList[number1])
            infos.push(vehicleIDList[number1])
            infos.push(tollIDList[Math.floor(Math.random()*result.length)])

            
            json = {
                "Timestamp of new Transaction":infos[0],
                "rate":infos[1],
                "tagID": infos[2],
                "vehicleID":infos[3],
                "tollID":infos[4]
            }
            let query2 = "INSERT INTO transaction (time_of_trans, rate, e_pass_tagID, e_pass_vehicleID, toll_post_tollID) VALUES ('" + infos[0] + "','" + infos[1] + "', '" + infos[2] + "', '" + infos[3] + "', '" + infos[4] + "')";
            con.query(query2, (err) => {
                if (err) {
                    res.status(405).send("Error during inserting transaction to table");
                    return console.error("Error during inserting transaction to table");
                }
                json["New Transaction Status"] = "Successful";

                session.json_or_csv_out(req, res, json)
            });

        });
    }
}
router.post('/NewTransaction', donewtrans);
module.exports = router;
