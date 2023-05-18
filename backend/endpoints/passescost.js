const con = require("../config/db.config");
const express = require('express');
const router = express.Router();
var session = require('./session');

function dopassescost(req, res) {
    var temp = session.get_auth(req);
    var auth = temp.auth;
    var op  = temp.op;
    if (auth == false || !( parseInt(auth) == 1 && req.params.op1_ID.substring(0,2) == op ) && parseInt(auth) != 2) {
        res.status(401).send("NOT AUTHORIZED").end();
    } else {
        var datefrom = req.params.date_from.substring(0, 4) + "-" + req.params.date_from.substring(4, 6) + "-" + req.params.date_from.substring(6, 8);
        var dateto = req.params.date_to.substring(0, 4) + "-" + req.params.date_to.substring(4, 6) + "-" + req.params.date_to.substring(6, 8);

        let query = "SELECT COUNT(*) as NumberOfPasses, SUM(toll_data.rate) as PassesCost FROM ( SELECT ep.vehicleID, prov.provider_name AS TagProvider, tr.time_of_trans, tr.token FROM provider AS prov, transaction AS tr, e_pass AS ep WHERE tr.e_pass_tagID = ep.tagID AND ep.tagID = tr.e_pass_tagID AND ep.providerID = prov.providerID AND ep.providerID = '" + req.params.op2_ID + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "' ) as epasses_from_toll JOIN ( SELECT tp.tollID, prov.provider_name as StationOperator, prov.providerID as StationID, tr.e_pass_tagID, tr.time_of_trans, tr.rate, tr.token FROM toll_post AS tp, provider AS prov, transaction AS tr WHERE tp.providerID = prov.providerID AND tp.tollID = tr.toll_post_tollID AND tp.providerID = '" + req.params.op1_ID + "' AND tr.time_of_trans BETWEEN '" + datefrom + "' AND '" + dateto + "') as toll_data ON toll_data.token = epasses_from_toll.token ORDER BY  toll_data.tollID";
        con.query(query, (err, result) => {
            if (err) {
                res.status(400).send("Error during query");
                return console.error("Error during query");
            }
            if (Object.keys(result).length === 0) {
                res.status(402).send(json);
                return console.log("Empty Responce");
            }

            let json = {
                "op1_ID": req.params.op1_ID,
                "op2_ID": req.params.op2_ID,
                "RequestTimeStamp": new Date().toISOString().slice(0, 19).replace('T', ' '),
                "PeriodFrom": datefrom,
                "PeriodTo": dateto,
                "NumberOfPasses": result[0].NumberOfPasses,
                "PassesCost": result[0].PassesCost != null ? (result[0].PassesCost).toFixed(2) : '0.00'
            }

            session.json_or_csv_out(req, res, json);

        });
    }
}

router.get('/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to', dopassescost);
module.exports = router;