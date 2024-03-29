#!/usr/bin/env node
 //  enable runtime transpilation to use ES6/7 in node
var fs = require('fs');
console.log("starting....");
var babelrc = fs.readFileSync('./.babelrc');
var config;

try {
	config = JSON.parse(babelrc);
} catch (err) {
	console.error('==>     ERROR: Error parsing your .babelrc.');
	console.error(err);
}

console.log("initializing babel...");

require('babel-register')(config);

require('../listener/server');
