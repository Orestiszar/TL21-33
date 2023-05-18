const con = require("../config/db.config");
const express = require('express');
const router = express.Router();
var session = require('./session');


function dodeposit(req, res) {

    var temp = session.get_auth(req);
    var auth = temp.auth;
    var op = temp.op;
    if (auth == false || !(parseInt(auth) == 1 && req.params.op1_ID.substring(0, 2) == op)) {
        res.status(401).send({PaymentStatus:"NOT_AUTHORIZED"}).end();
    }
    else {
        let cur_amount;
        let valid = req.params.payment_validation

        let json = {
            "Payer": req.params.op1_ID,
            "Receiver": req.params.op2_ID,
            "Amount": 0,
            "DateOfPayment": new Date().toISOString().slice(0, 19).replace('T', ' '),
            "PaymentStatus": "Invalid payment credentials"
        };

        if (valid.length < 6) {
            let query = "SELECT IFNULL(amount, 0) as amount FROM debts WHERE debts.indebted = '" + req.params.op1_ID + "' AND debts.benefiter = '" + req.params.op2_ID + "'";
            con.query(query, (err, result) => {
                if (err) {
                    res.set("Access-Control-Allow-Origin","https://localhost:3000").status(400).send("Error during query");
                    return console.error("Error during query");
                }

                if (Object.keys(result).length == 0) {
                    cur_amount = 0
                }
                else {
                    cur_amount = parseFloat(result[0].amount);
                }

                if (cur_amount >= parseInt(req.params.amount, 10)) {
                    let new_amount = cur_amount - parseFloat(req.params.amount);

                    let query = "UPDATE debts SET amount = '" + new_amount.toString() + "' WHERE debts.indebted = '" + req.params.op1_ID + "' AND debts.benefiter = '" + req.params.op2_ID + "'";
                    con.query(query, (err) => {
                        if (err) {
                            res.set("Access-Control-Allow-Origin","https://localhost:3000").status(405).send("Error during updating table");
                            return console.error("Error during updating table");
                        }
                        json["Amount"] = new_amount;
                        json["PaymentStatus"] = "Successful";
                        session.json_or_csv_out(req, res, json);
                    });
                }
                else {
                    json["Amount"] = 0;
                    json["PaymentStatus"] = "Failed";
                    session.json_or_csv_out(req, res, json);
                }

            });
        }
        else {
            session.json_or_csv_out(req, res, json);
        }
    }

}
router.post('/Deposit/:op1_ID/:op2_ID/:amount/:payment_validation', dodeposit);
module.exports = router;
