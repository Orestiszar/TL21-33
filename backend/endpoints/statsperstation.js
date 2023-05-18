const con = require("../config/db.config")
const express = require('express');
const router = express.Router();
var session = require('./session');

function dostatsperstation(req, res) {
    var temp = session.get_auth(req);
    var auth = temp.auth;
    var op  = temp.op;
    if (auth == false || !( parseInt(auth) == 1 && req.params.stationID.substring(0,2) == op) && parseInt(auth) != 3) {
        res.set("Access-Control-Allow-Origin","https://localhost:3000").status(401).send("NOT AUTHORIZED").end();
        return console.log("NOT AUTHORIZED");
    }
    else {

        let TotalCost = 0.0;
        let NumberOfPasses = 0;

        var datefrom = req.params.date_from.substring(0, 4) + "-" + req.params.date_from.substring(4, 6) + "-" + req.params.date_from.substring(6, 8);
        var dateto = req.params.date_to.substring(0, 4) + "-" + req.params.date_to.substring(4, 6) + "-" + req.params.date_to.substring(6, 8);

        var json = {
            "Station": req.params.stationID,
            "StationOperator": req.params.stationID.substring(0, 2),
            "RequestTimeStamp": new Date().toISOString().slice(0, 19).replace('T', ' '),
            "PeriodFrom": datefrom,
            "PeriodTo": dateto,
            "TotalCost": TotalCost,
            "NumberOfPasses": NumberOfPasses
        }



        let query = "SELECT X.provider_name as TagProvider, COUNT(*) as ProviderPasses, SUM(X.rate) as ProviderDebt FROM (SELECT tr.rate, pr.provider_name FROM transaction as tr, e_pass as ep, provider as pr WHERE tr.toll_post_tollID = '" + req.params.stationID + "' AND tr.e_pass_tagID = ep.tagID AND ep.providerID = pr.providerID AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "') as X GROUP BY (X.provider_name) ORDER BY (X.provider_name)"

        con.query(query, (err, result) => {

            if (err) {
                res.set("Access-Control-Allow-Origin","https://localhost:3000").status(400).send("Error during query");
                return console.error("Error during query");
            }
            
            if( Object.keys(result).length === 0){
                res.status(402).send(json);
                return console.log("Empty Responce");
            }
            json["PPOList"] = []
            Object.keys(result).forEach((key) => {
                json["PPOList"].push({
                    "TagProvider": result[key].TagProvider,
                    "ProviderDebt": result[key].ProviderDebt.toFixed(2),
                    "ProviderPasses": result[key].ProviderPasses
                })
                TotalCost = TotalCost + parseFloat(result[key].ProviderDebt);
                NumberOfPasses = NumberOfPasses + parseInt(result[key].ProviderPasses)
            })
            json["NumberOfPasses"] = NumberOfPasses;
            json["TotalCost"] = TotalCost.toFixed(2);

            session.json_or_csv_out(req, res, json);
        });
    }
}

router.get('/statsperstation/:stationID/:date_from/:date_to', dostatsperstation);
module.exports = router;
