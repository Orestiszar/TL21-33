process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('..\\api\\index.js');
let should = chai.should();
var expect = chai.expect;
// var expect = chai.expect;

chai.use(chaiHttp);

//Our parent block
module.exports = function(){
    describe('Admin endpoints tests',function () {
        this.timeout(30 * 1000);
    
        describe('valid healthcheck', () => {
            it('it should return status 200 and a json with database info', (done) => {
            chai.request(server.app)
                .get('/interoperability/api/admin/healthcheck')
                .set('Cookie', 'SESS=adminfreepasses4all2%3A%3Aadmin')
                .end((err, res) => {
                    res.should.have.status(200);
    
                    res.body.should.have.property('status', 'OK');
                    res.body.should.have.property('dbconnection', 'localhost');
                    res.body.should.have.property('user','root');
                    res.body.should.have.property('database name','tl21');
                    
                    done();
                });
            });
        });
    
        describe('valid resetpasses', () => {
            it('it should return status 200 and a complete status', (done) => {
            chai.request(server.app)
                .post('/interoperability/api/admin/resetpasses')
                .set('Cookie', 'SESS=adminadmin2%3A%3Aadmin')
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body.status).to.equal('OK');
                    done();
                });
            });
        });
    })    
}