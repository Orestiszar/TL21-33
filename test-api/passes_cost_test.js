process.env.NODE_ENV = 'test';
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let fs = require('fs');
let CsvToJson = require('./functions/CsvToJson.js');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('..\\api\\index.js');
let should = chai.should();
// var expect = chai.expect;


chai.use(chaiHttp);

module.exports = function(){
    describe('passes cost GET request test', () => {
        // after(function () {
        //     process.exit(0);
        // });
        var csv = fs.readFileSync('./testcases/passescost_test.csv');
        csv = CsvToJson(csv);
    
        for(var test = 0; test < 10; ++test) {
            let temp = csv[test].ans;
            
            let url = '/interoperability/api/PassesCost/'+csv[test].op1+'/'+csv[test].op2+'/'+csv[test].datefrom+'/'+csv[test].dateto;
            describe('Passes Cost test: ' + (test+1).toString(), () => {
                it('it should return status 200 and correct passescost', (done) => {
                chai.request(server.app)
                    .get(url)
                    .set('Cookie', 'SESS=adminfreepasses4all2%3A%3Aadmin')
                    .end((err, res) => {
                        res.should.have.status(200);
                        
                        res.body.should.have.property('PassesCost', temp);
                        done();
                    });
                });
            });
        }
    })
}