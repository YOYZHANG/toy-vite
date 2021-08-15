"use strict";
exports.__esModule = true;
exports.moduleMiddleware = void 0;
var resolve_cwd_1 = require("resolve-cwd");
var util_1 = require("./util");
function moduleMiddleware(id, res) {
    var modulePath;
    try {
        modulePath = resolve_cwd_1["default"](id);
        if (id === 'vue') {
            // modulePath = path.resolve(__dirname, 'vue.js');
        }
        util_1.sendJSStream(res, modulePath);
    }
    catch (e) {
        res.statusCode = 404;
        res.end();
    }
}
exports.moduleMiddleware = moduleMiddleware;
