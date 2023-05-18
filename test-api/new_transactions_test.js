process.env.NODE_ENV = 'test';

let fs = require('fs');
let CsvToJson = require('./functions/CsvToJson.js');
const con = require("../backend/config/db.config");
const mysql = require("mysql");

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../api/index.js');
let should = chai.should();

chai.use(chaiHttp);
module.exports = function(){
    let start = new Date().toISOString().slice(0, 19).replace('T', ' ');
    describe('New Transaction POST request test', function () {
        // after(function () {
        //     process.exit(0);
        // });
    
        this.timeout(30 * 1000);
        console.log(start);
    
        for(var test = 0; test < 10; ++test) {
            
            let url = '/interoperability/api/NewTransaction';
            describe('New Transaction test: ' + (test+1).toString(), () => {
                it('it should return status 200 and if the transaction was succesfull', (done) => {
                chai.request(server.app)
                    .post(url)
                    .set('Cookie', 'SESS=adminfreepasses4all2%3A%3Aadmin')
                    .end((err, res) => {
                        res.should.have.status(200);
                        
                        res.body.should.have.property('New Transaction Status', 'Successful');
    
                        var con = mysql.createConnection({
                            host: "localhost",
                            user: "root",
                            password: "",
                            database: "tl21"
                        });
                        con.connect(function(err) {
                            let query = "DELETE FROM transaction WHERE time_of_trans > '" + String(start) +"'";
                            con.query(query ,() => {con.end();});
                        });
                        done();
                    });
                });
            });
        }
    })
}
