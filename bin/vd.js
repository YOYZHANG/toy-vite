#!/usr/bin/env node
const {createServer} = require('../dist/node');
const argv = require('minimist')(prcess.argv.slice(2));

if (argv._.length) {
    argv.cmd = require('path').resolve(process.cwd(), argv._[0]);
}
createServer(argv);