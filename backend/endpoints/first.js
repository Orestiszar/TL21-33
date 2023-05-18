const express = require('express');
const router = express.Router();
var mysql = require('mysql');


function first(req,res){
    var myquery = "SELECT * FROM `client_mail`";
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hotel"
    });

    con.connect(function(err){
        if (err) {
            res.send("can't connect to DB")
            return console.error('error: ' + err.message);
        }
        console.log("First");
        con.query(myquery, function (err, result, fields){
            if(err){
                return console.error("Error")
            }
            res.send(result);        
        });
        con.end();
    });
}

router.get('/data', first);
module.exports = router;