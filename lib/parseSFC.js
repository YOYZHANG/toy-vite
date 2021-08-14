const fs = require('fs');
const {parse} = require('@vue/comiler-sfc');

const cache = new Map();
exports.parseSFC = (filename, saveCache = false) => {
    const content = fs.readFileSync(filename, 'utf8');
    const {descriptor, errors} = parse(content, {filename});

    const prev = cache.get(filename);

    if (saveCache) {
        cache.set(filename, descriptor);
    }

    return [descriptor, prev];
}