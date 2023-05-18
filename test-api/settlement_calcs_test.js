process.env.NODE_ENV = 'test';

let fs = require('fs');
let CsvToJson = require('./functions/CsvToJson.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../api/index.js');
let should = chai.should();

chai.use(chaiHttp);

module.exports = function (){
    describe('Settlement Calculations GET request test', () => {
        // after(function () {
        //     process.exit(0);
        // });
        var csv = fs.readFileSync('./testcases/settlement_calcs_test.csv');
        csv = CsvToJson(csv);
    
        for(var test = 0; test < 10; ++test) {
            let temp = parseFloat((parseFloat(csv[test].amount)).toFixed(2));
            
            let url = '/interoperability/api/settlementcalcs/'+csv[test].op1+'/'+csv[test].op2+'/'+csv[test].datefrom+'/'+csv[test].dateto;
            describe('Settlement Calcs test: ' + (test+1).toString(), () => {
                it('it should return status 200 and correct Amount', (done) => {
                chai.request(server.app)
                    .get(url)
                    .set('Cookie', 'SESS=adminfreepasses4all2%3A%3Aadmin')
                    .end((err, res) => {
                        res.should.have.status(200);
                        
                        res.body.should.have.property('Amount', temp);
                        done();
                    });
                });
            });
        }
    })
}
