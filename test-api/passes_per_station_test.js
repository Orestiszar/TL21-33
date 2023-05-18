process.env.NODE_ENV = 'test';

let fs = require('fs');
let CsvToJson = require('./functions/CsvToJson.js');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('..\\api\\index.js');
let should = chai.should();

chai.use(chaiHttp);


module.exports = function() {
    describe('Passes per station GET request test', () => {
        // after(function () {
        //     process.exit(0);
        // });
        var csv = fs.readFileSync('./testcases/passes_per_station_test.csv');
        csv = CsvToJson(csv);
    
        for(var test = 0; test < 10; ++test) {
            let temp = parseInt(csv[test].numberofpasses);
            
            let url = '/interoperability/api/passesperstation/'+csv[test].stationID+'/'+csv[test].datefrom+'/'+csv[test].dateto;
            describe('Passes per station test: ' + (test+1).toString(), () => {
                it('it should return status 200 and correct NumberOfPasses', (done) => {
                chai.request(server.app)
                    .get(url)
                    .set('Cookie', 'SESS=adminfreepasses4all2%3A%3Aadmin')
                    .end((err, res) => {
                        res.should.have.status(200);
                        
                        res.body.should.have.property('NumberOfPasses', temp);
                        done();
                    });
                });
            });
        }
    })
}