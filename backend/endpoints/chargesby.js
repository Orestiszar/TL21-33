const con = require("../config/db.config");
const express = require('express');
const router = express.Router();
var session = require('./session');
// var path = require('path');


function dochargesby(req, res) {

    var temp = session.get_auth(req);
    var auth = temp.auth;
    var op  = temp.op;
    if (auth == false || !( parseInt(auth) == 1 && req.params.op_ID.substring(0,2) == op) && parseInt(auth) != 2) {
        res.status(401).send("NOT AUTHORIZED").end();
    }
    else {
        var datefrom = req.params.date_from.substring(0, 4) + "-" + req.params.date_from.substring(4, 6) + "-" + req.params.date_from.substring(6, 8);
        var dateto = req.params.date_to.substring(0, 4) + "-" + req.params.date_to.substring(4, 6) + "-" + req.params.date_to.substring(6, 8);

        let json = {
            "op_ID": req.params.op_ID,
            "RequestTimeStamp": new Date().toISOString().slice(0, 19).replace('T', ' '),
            "PeriodFrom": datefrom,
            "PeriodTo": dateto
        }

        let op = req.params.op_ID;
        let query = "SELECT opID_of_epass.VisitorOperator, COUNT(*) as NumberOfPasses, SUM(opID_of_station.rate) as PassesCost FROM ( SELECT tp.tollID, prov.provider_name as StationOperator, prov.providerID as StationID, tr.rate, tr.token FROM transaction AS tr, provider AS prov, toll_post as tp WHERE tr.toll_post_tollID = tp.tollID AND tp.providerID = prov.providerID AND prov.providerID = '" + op + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "' ) as opID_of_station JOIN ( SELECT prov.provider_name AS VisitorOperator, ep.providerID AS ePassProvider, tr.token FROM transaction AS tr, e_pass AS ep, provider AS prov WHERE tr.e_pass_tagID = ep.tagID AND ep.providerID = prov.providerID AND prov.providerID <> '" + op + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "' ) AS opID_of_epass ON opID_of_epass.token = opID_of_station.token GROUP BY (opID_of_epass.ePassProvider)";

        con.query(query, (err, result) => {
            if (err) {
                res.status(400).send("Error during query");
                return console.error("Error during query");
            }
            json["PPOList"] = [];
            if( Object.keys(result).length === 0){
                res.status(402).send('Empty Responce');
                return console.log('Empty Responce');
            }
            Object.keys(result).forEach((key) => {
                json["PPOList"].push({
                    "VisitingOperator": result[key].VisitorOperator,
                    "NumberOfPasses": result[key].NumberOfPasses,
                    "PassesCost": result[key].PassesCost.toFixed(2)

                })
            });
            session.json_or_csv_out(req, res, json);
        });
    }
}


router.get('/ChargesBy/:op_ID/:date_from/:date_to', dochargesby);
module.exports = router;
