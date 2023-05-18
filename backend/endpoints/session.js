exports.setsession = function(username,password,auth){
    return {
        token: username + password + auth,
        user:username
    };
}

exports.clearsession = function (res) {
    res.clearCookie('SESS');
    return
}

exports.get_auth = function(req){
    let cookie = req.headers.cookie;
    if(cookie == undefined) return false;
    else cookie = cookie.split('; ');
    for(i=0; i<cookie.length; i++){
        var temp = cookie[i].split('=');
        if (temp[0] == "SESS") {
            var tok = temp[1].split('%3A%3A')[0];
            var usr = temp[1].split('%3A%3A')[1];
            //console.log(tok,usr);
            return {
                auth:tok.charAt(tok.length - 1),
                op: usr
            }
        }
    }

    return false;
}

ConvertToCSV = function (objArray) {
    var data = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    
    var csv = data.map(row => Object.values(row));
    csv.unshift(Object.keys(data[0]));
    csv = csv.join('\n');
    return csv.replaceAll(',', ';');
    
}

isArray = function(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

exports.json_or_csv_out = function (req, res, obj) {
    if (req.query.format === "json" || req.query.format == null)
        res.set("Access-Control-Allow-Origin","https://localhost:3000").status(200).send(obj);
    else if (req.query.format === "csv") {
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
        
        let csv = ConvertToCSV(jsonObject);
        
        res.setHeader('Content-disposition', 'attachment; filename=data.csv');
        res.set('Content-Type', 'text/csv');
        res.set("Access-Control-Allow-Origin","https://localhost:3000")
        
        res.status(200).send(csv);
    } 
    else
        res.set("Access-Control-Allow-Origin","https://localhost:3000").status(405).send("Wrong type of format");
}