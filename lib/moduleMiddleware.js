const fs = require('fs');
const path = require('path');
const {sendJS} = require('util');
exports.moduleMiddleware = (id, res) => {
    let modulePath

    try {
        modulePath = require.resolve(id);
    }
    catch(e) {
        // res.setStatus(404);
        res.end();
    }

    if (id === 'vue') {
        // modulePath = path.resolve(__dirname, 'vue.js');
    }

    console.log(modulePath, 'modulePath');

    sendJS(modulePath, fs.readFileSync(modulePath, 'utf8'));
 }