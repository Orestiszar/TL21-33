var session = require('../endpoints/session');
const express = require('express');
const router = express.Router();


function logout(req,res){
    session.clearsession(res);
    let json = {
        "status" : "LOGOUT"
    }
    res.set("Access-Control-Allow-Origin","https://localhost:3000").status(200).send(json);
}

router.post('/logout', logout);
module.exports = router;