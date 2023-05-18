const con = require("../config/db.config");
var session = require('../endpoints/session');
const express = require('express');
const router = express.Router();


function getLoginCredentials(req,res){
    var UserCredentials = {
        name : req.body.username,
        password : req.body.password
    }

    
    let query = "SELECT username,password,authority_level FROM admin WHERE username = '" + UserCredentials.name + "' AND password = '" + UserCredentials.password+"'";
    let ans = con.query(query,(err,result,fields)=>{
        if(err){
            res.status(400).set("Access-Control-Allow-Origin","https://localhost:3000").send("Error during query");
            return console.error("Error during query");
        }
        if(Object.keys(result).length === 0){
            res.status(402).set("Access-Control-Allow-Origin","https://localhost:3000").send({"status" : "Username or Password Incorrect"});
        }
        else if(Object.keys(result).length > 1){
            console.log("Internal Server Error during login.")
            res.status(500).set("Access-Control-Allow-Origin","https://localhost:3000").send("Internal Server Error");
        }
        else{
            let auth = result[Object.keys(result)[0]].authority_level;
            let token = session.setsession(UserCredentials.name, UserCredentials.password, auth);
            console.log(JSON.stringify(token));
            res.cookie('SESS',token.token+"::"+token.user, { maxAge: 4320000, httpOnly: true });
            
            let json = {
                'token' : token.token
            };
            res.status(200).set("Access-Control-Allow-Origin","https://localhost:3000").send(json);
            delete token;
            }
      });
}

router.post('/login', getLoginCredentials);
module.exports = router;