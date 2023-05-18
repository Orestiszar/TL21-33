const con = require("../config/db.config");
const express = require('express');
const router = express.Router();
var session = require('./session');


function dopassesanalysis(req, res) {

    var temp = session.get_auth(req);
    var auth = temp.auth;
    var op  = temp.op;
    if (auth == false || !( parseInt(auth) == 1 && req.params.op1_ID.substring(0,2) == op) && parseInt(auth) != 2) {
        res.status(401).send("NOT AUTHORIZED").end();
    }
    else {
        var datefrom = req.params.date_from.substring(0, 4) + "-" + req.params.date_from.substring(4, 6) + "-" + req.params.date_from.substring(6, 8);
        var dateto = req.params.date_to.substring(0, 4) + "-" + req.params.date_to.substring(4, 6) + "-" + req.params.date_to.substring(6, 8);

        let json = {
            "op1_ID": req.params.op1_ID,
            "op2_ID": req.params.op2_ID,
            "RequestTimeStamp": new Date().toISOString().slice(0, 19).replace('T', ' '),
            "PeriodFrom": datefrom,
            "PeriodTo": dateto,
            "PassesList": []
        }

        let query = "SELECT epasses_from_toll.tagID as PassID, toll_data.tollID as StationID, epasses_from_toll.time_of_trans as Transaction_Time, epasses_from_toll.vehicleID, toll_data.rate FROM (SELECT ep.tagID, ep.vehicleID, prov.provider_name AS TagProvider, tr.time_of_trans, tr.token FROM provider AS prov, transaction AS tr, e_pass AS ep WHERE tr.e_pass_tagID = ep.tagID AND ep.tagID = tr.e_pass_tagID AND ep.providerID = prov.providerID AND ep.providerID = '" + req.params.op2_ID + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "') as epasses_from_toll JOIN (SELECT tp.tollID, prov.provider_name as StationOperator, prov.providerID as StationID, tr.e_pass_tagID, tr.time_of_trans, tr.rate, tr.token FROM toll_post AS tp, provider AS prov, transaction AS tr WHERE tp.providerID = prov.providerID AND tp.tollID = tr.toll_post_tollID AND tp.providerID = '" + req.params.op1_ID + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "') as toll_data ON toll_data.token = epasses_from_toll.token ORDER BY epasses_from_toll.time_of_trans, toll_data.tollID"

        con.query(query, (err, result) => {
            if (err) {
                res.status(400).send("Error during query");
                return console.error("Error during query");
            }
            json["NumberOfPasses"] = result.length
            let i = 1;
            const today = new Date(Date.now());
            let currentdate = today.toISOString();
            json["PPOList"] = []

            if( Object.keys(result).length === 0){
                res.status(402).send('Empty Responce');
                return console.log('Empty Responce');
            }

            Object.keys(result).forEach((key) => {
                json["PPOList"].push({
                    "PassIndex": i,
                    "PassID": result[key].PassID,
                    "StationID": result[key].StationID,
                    "TimeStamp": result[key].Transaction_Time.toISOString().slice(0, 19).replace('T', ' '),
                    "VehicleID": result[key].vehicleID,
                    "Charge": result[key].rate
                });
                i = i + 1;
            });
            session.json_or_csv_out(req, res, json);
        });
    }
}

router.get('/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to', dopassesanalysis);
module.exports = router;
