#!/usr/bin/env node

/**
 * TL21-33
 * Command line interface for TL21-33 project
 *
 * @author TL21-33-Team <localhost:9103>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const doRequest = require('./AxiosConnectModule');
const mysql = require('mysql');
const { strictEqual } = require('assert');
const { Console } = require('console');
const { dirname } = require('path');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

const baseUrl = 'https://localhost:9103/interoperability/api';

const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'tl21'
});

(async () => {
	input.includes(`help`) && cli.showHelp(0);

	const myhttpsAgent = new https.Agent({ rejectUnauthorized: false, }); // (NOTE: this will disable client verification)


	if (input[1] != null) {
		console.log('Too many arguments');
		return;
	}

	if (input[0] == 'login') {
		if (fs.existsSync(__dirname + '/cookie')) console.log('Already logged in');
		else {
			try {
				const res = await axios({
					method: 'post',
					withCredentials: true,
					url: baseUrl + '/login',
					headers: {},
					data: {
						username: flags.username, // This is the body part
						password: flags.passw
					},
					httpsAgent: myhttpsAgent
				});

				let cookie = res.headers['set-cookie'][0];
				let temp = cookie.split(';');
				cookie = temp[0];
				fs.writeFileSync(__dirname + '/cookie', cookie, 'utf8');

				con.connect(function (err) {
					if (err) throw err;
					login_query =
						`UPDATE admin
					SET admin.state = 1
					WHERE admin.username = '` +
						flags.username +
						"';";

					con.query(login_query, function (err, result, fields) {
						if (err) throw err;
						else process.exit();
					});
				});
				console.log('Login Successful');
			} catch (error) {
				console.log(error.response.data);
			}
			//get cookie
		}
	} else if (input[0] == 'logout') {
		if (!fs.existsSync(__dirname + '/cookie'))
			console.log('Cant log out if not logged in');
		//just delete the cookie
		else {
			const fs = require('fs');
			var usr_name = fs.readFileSync(__dirname + '/cookie').toString().split('%3A')[2];

			fs.unlink(__dirname + '/cookie', function () {
				con.connect(function (err) {
					if (err) throw err;
					login_query =
						`UPDATE admin
					SET admin.state = 0
					WHERE admin.username = '` +
						usr_name +
						"';";

					con.query(login_query, function (err, result, fields) {
						if (err) throw err;
						else process.exit();
					});
				});

				console.log('Successful logout');
			});
		}
	} else if (input[0] == 'healthcheck') {
		let url = baseUrl + '/admin/healthcheck';
		doRequest('get', url, 'json', 'healthcheck');
	} else if (input[0] == 'resetpasses') {
		let url = baseUrl + '/admin/resetpasses';
		doRequest('post', url, 'json', 'resetpasses');
	} else if (input[0] == 'resetstations') {
		let url = baseUrl + '/admin/resetstations';
		doRequest('post', url, 'json', 'resetstations');
	} else if (input[0] == 'resetvehicles') {
		let url = baseUrl + '/admin/resetvehicles';
		doRequest('post', url, 'json', 'resetvehicles');
	} else if (input[0] == 'passesperstation') {
		console.log("here");
		let url =
			baseUrl +
			'/passesperstation/' +
			flags.station +
			'/' +
			flags.datefrom +
			'/' +
			flags.dateto;
		doRequest('get', url, flags.format, 'passesperstation');
	} else if (input[0] == 'chargesby') {
		let url =
			baseUrl +
			'/ChargesBy/' +
			flags.op1 +
			'/' +
			flags.datefrom +
			'/' +
			flags.dateto;
		doRequest('get', url, flags.format, 'chargesby');
	} else if (input[0] == 'passesanalysis') {
		let url =
			baseUrl +
			'/PassesAnalysis/' +
			flags.op1 +
			'/' +
			flags.op2 +
			'/' +
			flags.datefrom +
			'/' +
			flags.dateto;
		doRequest('get', url, flags.format, 'passesanalysis');
	} else if (input[0] == 'passescost') {
		let url =
			baseUrl +
			'/PassesCost/' +
			flags.op1 +
			'/' +
			flags.op2 +
			'/' +
			flags.datefrom +
			'/' +
			flags.dateto;
		doRequest('get', url, flags.format, 'passescost');
	} else if (input[0] == 'admin') {
		if (!fs.existsSync(__dirname + '/cookie')) {
			console.log('Action not allowed');
			return;
		}
		let credential = fs.readFileSync(__dirname + '/cookie') + '';
		let temp = credential.split('%');
		if (temp[0].charAt(temp[0].length - 1) != '2') {
			console.log(
				'User [' +
				temp[2].substring(2, temp[2].length) +
				'] does not have administrator privilages'
			);
			return;
		}
		if (flags.usermod != null) {
			if (
				flags.username == null ||
				flags.passw == null ||
				flags.username == '' ||
				flags.passw == ''
			) {
				console.log('Invalid username and/or password');
				return;
			}
			// create here mysql connection
			const con = mysql.createConnection({
				host: 'localhost',
				user: 'root',
				password: '',
				database: 'tl21'
			});
			con.connect(function (error) {
				if (error) console.log('database failed to connect');
				// else console.log('Database Connected Successfully');
			});

			var GetUser = function (Callback) {
				con.query(
					"SELECT * FROM admin WHERE username = '" +
					flags.username +
					"'",
					function (err, result) {
						if (err) {
							console.log('Request Error: ' + err);
							return;
						}
						Callback(result); //Call a callback function which is passed as a parameter
					}
				);
			};

			GetUser(function (result) {
				if (Object.keys(result).length === 0) {
					console.log('no user');
					let nextquery =
						"INSERT INTO admin (username,password,authority_level) VALUES ('" +
						flags.username +
						"','" +
						flags.passw +
						"',0)";
					con.query(nextquery, (err, result) => {
						if (err) {
							return console.error('Error during query');
						}
						console.log(
							'Created new user [' + flags.username + ']'
						);
						con.end();
					});
				} else {
					console.log('found user');
					let nextquery =
						"UPDATE admin SET password = '" +
						flags.passw +
						"' WHERE username = '" +
						flags.username +
						"'";
					con.query(nextquery, (err, result) => {
						if (err) {
							return console.error('Error during query');
						}
						console.log(
							'Changed password for user [' + flags.username + ']'
						);
						con.end();
					});
				}
			});
		} else if (flags.users != null) {
			if (flags.users == '') {
				console.log('invalid username');
				return;
			}
			// create here mysql connection
			const con = mysql.createConnection({
				host: 'localhost',
				user: 'root',
				password: '',
				database: 'tl21'
			});

			con.connect(function (error) {
				if (error) console.log('database failed to connect');
				// else console.log('Database Connected Successfully');
			});

			let query =
				"SELECT state FROM admin WHERE username = '" +
				flags.users +
				"'";
			con.query(query, (err, result) => {
				if (err) {
					return console.error('Error during query');
				}

				if (Object.keys(result).length === 0) {
					console.log('no such user');
					con.end();
					return;
				}
				Object.keys(result).forEach(key => {
					if (result[key].state == 0) {
						console.log('User [' + flags.users + '] not connected');
					} else {
						console.log('User [' + flags.users + '] connected');
					}
					con.end();
				});
			});
		} else if (flags.passesupd != null) {
			if (flags.source == null || flags.source == '') {
				console.log('Invalid file name');
				return;
			}
			//run python script here with argv[1] == flags.source
			const spawn = require('child_process').spawn;
			var proc = spawn('python', [__dirname + "\\..\\backend\\reset_scripts\\add_passes.py", process.cwd()+ "\\"+flags.source]);
			proc.stderr.on('data', data =>{console.log(data.toString())});
			proc.stdout.on('data', data => {
				// console.log("after");
				let temp = data.toString();
				temp = temp.substring(0, 9);
				if (temp.toString() != 'Commit OK') {
					return console.error('Initialization failed');
				}
				console.log('Passes added');
			});
		} else console.log('Invalid operation');
	}
	else {
		console.log('Invalid command [' + input[0] + ']');
	}
})();
