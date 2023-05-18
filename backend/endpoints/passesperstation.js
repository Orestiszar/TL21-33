const con = require("../config/db.config");
const express = require('express');
const router = express.Router();
var session = require('./session');


function help(x) {
    if (x) {
        return "home";
    }
    return "visitor";
}

function dopassesperstation(req, res) {
    var temp = session.get_auth(req);
    var auth = temp.auth;
    var op  = temp.op;
    
    if (auth == false || !( parseInt(auth) == 1 && req.params.stationID.substring(0,2) == op) && parseInt(auth) != 2) {
        res.status(401).send("NOT AUTHORIZED").end();
    }
    else {
        var datefrom = req.params.date_from.substring(0, 4) + "-" + req.params.date_from.substring(4, 6) + "-" + req.params.date_from.substring(6, 8);
        var dateto = req.params.date_to.substring(0, 4) + "-" + req.params.date_to.substring(4, 6) + "-" + req.params.date_to.substring(6, 8);

        let json = {
            "Station": req.params.stationID,
            "StationOperator": req.params.stationID.substring(0, 2),
            "RequestTimeStamp": new Date().toISOString().slice(0, 19).replace('T', ' '),
            "PeriodFrom": datefrom,
            "PeriodTo": dateto
        }


        let query = "SELECT epasses_from_toll.vehicleID, epasses_from_toll.TagProvider, toll_data.tollID, toll_data.StationOperator, toll_data.e_pass_tagID, toll_data.time_of_trans, toll_data.rate FROM ( SELECT ep.vehicleID, prov.provider_name as TagProvider, tr.token FROM toll_post AS tp, provider AS prov, transaction AS tr, e_pass AS ep WHERE tr.e_pass_tagID = ep.tagID AND ep.tagID = tr.e_pass_tagID AND ep.providerID = prov.providerID AND tp.tollID = '" + req.params.stationID + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "' ) as epasses_from_toll JOIN ( SELECT tp.tollID, prov.provider_name as StationOperator, tr.e_pass_tagID, tr.time_of_trans, tr.rate, tr.token FROM toll_post AS tp, provider AS prov, transaction AS tr WHERE tp.providerID = prov.providerID AND tp.tollID = tr.toll_post_tollID AND tp.tollID = '" + req.params.stationID + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "' ) as toll_data ON toll_data.token = epasses_from_toll.token"

        con.query(query, (err, result) => {
            if (err) {
                res.status(400).send("Error during query");
                return console.error("Error during query");

            }

            if (Object.keys(result).length === 0) {
                res.status(402).send(json);
                return console.log("Empty Responce");
            }
            json["NumberOfPasses"] = result.length
            let i = 1;
            json["PPOList"] = []
            Object.keys(result).forEach((key) => {
                json["PPOList"].push({
                    "PassIndex": i,
                    "PassID": result[key].token,
                    "PassTimeStamp": result[key].time_of_trans,
                    "VehicleID": result[key].vehicleID,
                    "TagProvider": result[key].TagProvider,
                    "PassType": help(result[key].TagProvider === result[key].StationOperator),
                    "PassCharge": result[key].rate
                })
                i += 1;
            })
            session.json_or_csv_out(req, res, json);
        });

    }
}

router.get('/passesperstation/:stationID/:date_from/:date_to', dopassesperstation);
module.exports = router;

