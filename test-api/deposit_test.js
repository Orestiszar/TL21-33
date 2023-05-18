process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let fs = require('fs');
let CsvToJson = require('./functions/CsvToJson.js');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../api/index.js');
const { expect } = require('chai');
let should = chai.should();

chai.use(chaiHttp);

module.exports = function(){
    describe('Deposit POST request test', () => {

        var csv = fs.readFileSync('./testcases/deposit_test.csv');
        csv = CsvToJson(csv);
        // console.log(csv);
        for(var test = 0; test < 10; test++) {  
            let url = '/interoperability/api/Deposit/'+csv[test].op1+'/'+csv[test].op2+'/'+csv[test].amount+'/'+csv[test].payment_validation;
            // console.log(url);
            describe('Passes analysis test: ' + (test+1).toString(), () => {
                let myans = csv[test].ans;
                it('it should return status 200 and correct NumberOfPasses', (done) => {
                    chai.request(server.app)
                    .post(url)
                    .set('Cookie', 'SESS=EGegnantia1%3A%3AEG')
                    .end((err, res) => {
                        // console.log(res.body);
                        expect(res.body.PaymentStatus).to.equal(myans);
                        done();
                    });
                });
            });
        }
    });
}
