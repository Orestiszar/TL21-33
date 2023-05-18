let chai = require('chai');
let chaiFiles = require('chai-files');

let server = require('..\\api\\index.js');

const fs = require('fs');
require('mocha-sinon');
let mytemp = require('..\\cli\\JsonOrCsvModule.js');
const ConvertToCSV = mytemp.ConvertToCSV;
const JsonOrCsv = mytemp.JsonOrCsv;
const doRequest = require('..\\cli\\AxiosConnectModule');
const { exit } = require('process');
// let should = chai.should();
const expect = chai.expect;
const myjson = [
    {"col1" : "cell11", "col2" : "cell12", "col3" : "cell13", "col4" : "cell14", "col5" : "cell15"},
    {"col1" : "cell21", "col2" : "cell22", "col3" : "cell23", "col4" : "cell24", "col5" : "cell25"},
    {"col1" : "cell31", "col2" : "cell32", "col3" : "cell33", "col4" : "cell34", "col5" : "cell35"},
    {"col1" : "cell41", "col2" : "cell42", "col3" : "cell43", "col4" : "cell44", "col5" : "cell45"},
    {"col1" : "cell51", "col2" : "cell52", "col3" : "cell53", "col4" : "cell54", "col5" : "cell55"},
];

const correctcsv = "col1,col2,col3,col4,col5\ncell11,cell12,cell13,cell14,cell15\ncell21,cell22,cell23,cell24,cell25\ncell31,cell32,cell33,cell34,cell35\ncell41,cell42,cell43,cell44,cell45\ncell51,cell52,cell53,cell54,cell55";

chai.use(chaiFiles);
var file = chaiFiles.file;

describe('CLI unit testing',function () {
    
    beforeEach(function() {
        this.sinon.stub(console, 'log');
    });

    after(function () {
        exit(0);
    });

    describe('ConvertToCSV testing', () => {
        it('It should convert the .json objects to .csv type strings', (done) => {
            let csv = ConvertToCSV(myjson);
            // console.log(csv);
            expect(csv).to.equal(correctcsv);
            done();
        });
    });

    describe('JsonOrCsv testing', () => {
        it('JsonOrCsv testing:It should create a csv file or log the json output', (done) => {
            JsonOrCsv(myjson, 'json','nothing');
            expect(console.log.calledOnce).to.be.true;
            expect(console.log.calledWith(myjson)).to.be.true;

            JsonOrCsv(myjson, 'csv','tempfile.csv');
            expect(file('tempfile.csv')).to.exist;
            fs.unlinkSync('tempfile.csv');
            done();
        });
    });

    // describe('doRequest testing', () => {
    //     it('It should send a request to the database and print or filesave the reply', (done) => {
            
    //         doRequest('get', "https://localhost:9103/interoperability/api/admin/healthcheck", 'json', 'healthcheck');
    //         expect(console.log.calledOnce).to.be.true;
    //         done();
    //     });
    // });

})

