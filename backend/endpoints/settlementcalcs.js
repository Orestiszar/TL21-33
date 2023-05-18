const con = require("../config/db.config");
const express = require('express');
const router = express.Router();
var session = require('./session');


function dosettlementcalcs(req, res) {
    var temp = session.get_auth(req);
    var auth = temp.auth;
    var op  = temp.op;
    if (auth == false || !( parseInt(auth) == 1 &&  req.params.op2_ID.substring(0,2) == op) && parseInt(auth) != 2) {
        res.status(401).send("NOT AUTHORIZED").end();
    }
    else {

        var datefrom = req.params.date_from.substring(0, 4) + "-" + req.params.date_from.substring(4, 6) + "-" + req.params.date_from.substring(6, 8);
        var dateto = req.params.date_to.substring(0, 4) + "-" + req.params.date_to.substring(4, 6) + "-" + req.params.date_to.substring(6, 8);

        let op_in_debt = req.params.op2_ID;
        let op_in_benefit = req.params.op1_ID;
        let amount = 0;

        let query = "SELECT (op2_owes_op1.PassesCost - op1_owes_op2.PassesCost) + (op1_payed_op2.op1_to_op2_payments - op2_payed_op1.op2_to_op1_payments) as op2_owes_to_op1 FROM  ( SELECT IFNULL(SUM(opID_of_station.rate), 0) as PassesCost FROM ( SELECT tp.tollID, prov.provider_name as StationOperator, prov.providerID as StationID, tr.rate, tr.token FROM transaction AS tr, provider AS prov, toll_post as tp WHERE tr.toll_post_tollID = tp.tollID AND tp.providerID = prov.providerID AND prov.providerID = '" + req.params.op1_ID + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "' ) as opID_of_station JOIN ( SELECT prov.provider_name AS VisitorOperator, ep.providerID AS ePassProvider, tr.token FROM transaction AS tr, e_pass AS ep, provider AS prov WHERE tr.e_pass_tagID = ep.tagID AND ep.providerID = prov.providerID AND prov.providerID = '" + req.params.op2_ID + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "' ) AS opID_of_epass ON opID_of_epass.token = opID_of_station.token ) AS op2_owes_op1,  ( SELECT IFNULL(SUM(opID_of_station.rate), 0) as PassesCost FROM ( SELECT tp.tollID, prov.provider_name as StationOperator, prov.providerID as StationID, tr.rate, tr.token FROM transaction AS tr, provider AS prov, toll_post as tp WHERE tr.toll_post_tollID = tp.tollID AND tp.providerID = prov.providerID AND prov.providerID = '" + req.params.op2_ID + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "' ) as opID_of_station JOIN ( SELECT prov.provider_name AS VisitorOperator, ep.providerID AS ePassProvider, tr.token FROM transaction AS tr, e_pass AS ep, provider AS prov WHERE tr.e_pass_tagID = ep.tagID AND ep.providerID = prov.providerID AND prov.providerID = '" + req.params.op1_ID + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "' ) AS opID_of_epass ON opID_of_epass.token = opID_of_station.token ) AS op1_owes_op2, ( SELECT IFNULL(SUM(de.amount), 0) AS op1_to_op2_payments FROM debts AS de WHERE de.indebted = '" + req.params.op1_ID + "' AND de.benefiter = '" + req.params.op2_ID + "' AND de.date BETWEEN '" + datefrom + "' AND '" + dateto + "' ) AS op1_payed_op2,  ( SELECT IFNULL(SUM(de.amount), 0) AS op2_to_op1_payments FROM debts AS de WHERE de.indebted = '" + req.params.op2_ID + "' AND de.benefiter = '" + req.params.op1_ID + "' AND de.date BETWEEN '" + datefrom + "' AND '" + dateto + "' ) AS op2_payed_op1";
        con.query(query, (err, result) => {

            if(err){
                res.status(400).send("Error during query");
                return console.error("Error during query");
            }
            if( Object.keys(result).length === 0){
                res.status(402).send(json);
                return console.log("Empty Responce");
            }
            amount = parseFloat(result[0].op2_owes_to_op1.toFixed(2));
            

            if (result[0].op2_owes_to_op1 < 0){
                amount = -1*amount
                op_in_debt = req.params.op1_ID
                op_in_benefit = req.params.op2_ID
            }
            let json = {
                "OperatorInDebt": op_in_debt,
                "OperatorInBenefit": op_in_benefit,
                "PeriodFrom": datefrom,
                "PeriodTo": dateto,
                "Amount": amount
            }

            session.json_or_csv_out(req, res, json);
        });
    }
}

router.get('/settlementcalcs/:op1_ID/:op2_ID/:date_from/:date_to', dosettlementcalcs);
module.exports = router;
