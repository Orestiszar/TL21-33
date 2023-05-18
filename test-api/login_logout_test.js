process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('..\\api\\index.js');
let should = chai.should();
// var expect = chai.expect;
var cookie, token;


chai.use(chaiHttp);

module.exports = function(){
  describe('Login and Logout tests ', () => {

    // after(function () {
    //   process.exit(0);
    // });
    
    describe('valid login', () => {
        it('it should login a user with correct username and password', (done) => {
          const user = {
            username: "admin",
            password: "freepasses4all"
          }
          chai.request(server.app)
              .post('/interoperability/api/login')
              .set('withCredentials', 'true')
              .send(user)
              .end((err, res) => {
                  res.should.have.status(200);
  
                  res.should.have.header('Set-Cookie');
                  cookie = res.headers.Cookie;
  
                  res.body.should.have.property('token');
                  token = res.body.token;
                  
                  done();
              });
        });
    });
  
    describe('valid logout', () => {
      it('it should logout a user and return status code 200', (done) => {
        chai.request(server.app)
            .post('/interoperability/api/logout')
            .set('withCredentials', 'true', 'Cookie', 'SESS=adminfreepasses4all2%3A%3Aadmin')
            .end((err, res) => {
                res.should.have.status(200);
  
                res.body.should.have.property('status');
                
                done();
            });
      });
    });
  
    describe('invalid login', () => {
      it('it shouldnt login a user with incorrect username and password', (done) => {
        const user = {
          username: "invalid",
          password: "invalid"
        }
        chai.request(server.app)
            .post('/interoperability/api/login')
            .set('withCredentials', 'true')
            .send(user)
            .end((err, res) => {
                res.should.have.status(402);
  
                res.should.not.have.header('Set-Cookie');
                cookie = res.headers.Cookie;
  
                res.body.should.have.property('status');
                token = res.body.token;
                
                done();
            });
      });
    });
  
  })
}
