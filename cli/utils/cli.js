const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	format: {
		type: 'string',
		default: 'json',
		desc: 'Choose desired format of output [json|csv]'
	},
	passw:{
		type: 'string',
		desc: 'password for the given user'
	},
	username: {
		type: 'string',
		desc: 'username of the given user'
	},
	station: {
		type: 'string'
	},
	datefrom: {
		type: 'string'
	},
	dateto: {
		type: 'string'
	},
	op1: {
		type: 'string'
	},
	op2: {
		type: 'string'
	},
	source: {
		type: 'string'
	},
	usermod: {
		type: 'string'
	},
	users: {
		type: 'string'
	},
	passesupd: {
		type: 'string'
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `se2133`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
