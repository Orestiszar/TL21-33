let chargesby = require('./charges_by_test');
let deposit = require('./deposit_test');
let loginlogout = require('./login_logout_test');
let newtransaction = require('./new_transactions_test');
let passesanalysis = require('./passes_analysis_test')
let passescost = require('./passes_cost_test')
let passesperstation = require('./passes_per_station_test')
let settlement_calcs = require('./settlement_calcs_test');

describe('Initiating tests', function() {
    this.timeout(300 * 1000);
    it("Testing chargesby", (done) => {
        chargesby();
        done();
    });

    it('Testing newtransaction', (done) => {
        newtransaction();
        done();
    });
    
    it('Testing passesanalysis', (done) => {
        passesanalysis();
        done();
    });
    
    it('Testing passescost', (done) => {
        passescost();
        done();
    });
    
    it('Testing passesperstation', (done) => {
        passesperstation();
        done();
    });
    
    it('Testing settlementcalcs', (done) => {
        settlement_calcs();
        done();
    });
    
    it('Testing deposit', (done) => {
        deposit();
        done();
    });

    it('Testing login, logout and reset', (done) => {
        loginlogout();
        done();
    });
});
