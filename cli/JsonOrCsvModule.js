const { writeFile } = require('fs').promises;

isArray = function(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

ConvertToCSV = function (obj) {

    if(obj.PPOList != undefined)
            obj = obj.PPOList;
    let jsonObject;

    //whack code that does the job
    if(!isArray(obj)) {
        let temp = {
            "" : null
        };
        temp["x"] = [];
        temp["x"].push(obj);
        jsonObject = JSON.stringify(temp["x"]);
    }
    else
        jsonObject = JSON.stringify(obj);
    
    var data = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
    
    var csv = data.map(row => Object.values(row));
    csv.unshift(Object.keys(data[0]));
    return csv.join('\n');
}

JsonOrCsv = function(json, flag, filename) {
    if(flag === 'json') {
        console.log(json);
    }
    else if(flag === 'csv') {
        let csv = ConvertToCSV(json);
        try {
            writeFile(filename, csv, 'utf8'); 
        } 
        catch (err) {
            console.log(err);
            process.exit(1);
        }
        console.log('Succesful query: CSV created in this diretory');
    }
    else {
        console.log("Wrong type of format");
        process.exit(1);
    }
}

module.exports.ConvertToCSV = ConvertToCSV;
module.exports.JsonOrCsv = JsonOrCsv;