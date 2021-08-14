const chokidar = require('chokidar');

exports.createFileWatcher = function(notify) {
    const fileWatcher = chokidar.watch(process.cwd(), {
        ignored: [/node_modules/]
    });

    fileWatcher.on('change', (file) => {
        console.log('[DEBUG] filepath changed', file);
        notify({
            type: 'full-reload'
        });
    })
}