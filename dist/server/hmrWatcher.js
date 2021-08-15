"use strict";
exports.__esModule = true;
exports.createFileWatcher = void 0;
var chokidar_1 = require("chokidar");
function createFileWatcher(notify) {
    var fileWatcher = chokidar_1["default"].watch(process.cwd(), {
        ignored: [/node_modules/]
    });
    fileWatcher.on('change', function (file) {
        console.log('[DEBUG] filepath changed', file);
        notify({
            type: 'full-reload'
        });
    });
}
exports.createFileWatcher = createFileWatcher;
