process.env.NODE_ENV = 'test';

let fs = require('fs');
let CsvToJson = require('./functions/CsvToJson.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('..\\api\\index.js');
var expect = chai.expect;
let should = chai.should();

chai.use(chaiHttp);
module.exports = function(){
    describe('Charges By GET request test', () => {

        var csv = fs.readFileSync('./testcases/chargesby_test.csv');
        csv = CsvToJson(csv);
    
        for(let i=0;i<5;i++){
            let url = '/interoperability/api/ChargesBy/'+csv[i].operator+'/'+csv[i].datefrom+'/'+csv[i].dateto;
            it(csv[i].operator+'/'+csv[i].datefrom+'/'+csv[i].dateto, (done) => {
                chai.request(server.app)
                    .get(url)
                    .set('Cookie', 'SESS=adminfreepasses4all2%3A%3Aadmin')
                    .end((err, res) => {
                        res.should.have.status(200);
                        // console.log(res.body.PPOList[0].PassesCost);
                        for(let j=0;j<6;j++){
                            try{
                                if(res.body.PPOList[j].VisitingOperator == 'aodos'){
                                    expect(res.body.PPOList[j].PassesCost).to.equal(csv[i].aodos);
                                }
                                else if(res.body.PPOList[j].VisitingOperator == 'egnantia'){
                                    expect(res.body.PPOList[j].PassesCost).to.equal(csv[i].egnantia);
                                }
                                else if(res.body.PPOList[j].VisitingOperator == 'gefyra'){
                                    expect(res.body.PPOList[j].PassesCost).to.equal(csv[i].gefyra);
                                }
                                else if(res.body.PPOList[j].VisitingOperator == 'kentriki_odos'){
                                    expect(res.body.PPOList[j].PassesCost).to.equal(csv[i].kentriki_odos);
                                }
                                else if(res.body.PPOList[j].VisitingOperator == 'moreas'){
                                    expect(res.body.PPOList[j].PassesCost).to.equal(csv[i].moreas);
                                }
                                else if(res.body.PPOList[j].VisitingOperator == 'nea_odos'){
                                    expect(res.body.PPOList[j].PassesCost).to.equal(csv[i].nea_odos);
                                }
                                else if(res.body.PPOList[j].VisitingOperator == 'olympia_odos'){
                                    expect(res.body.PPOList[j].PassesCost).to.equal(csv[i].olympia_odos);
                                }
                            }
                            catch(e){
                                break;
                            }
                        }
                        done();
                    });
                });
        }
    })
}