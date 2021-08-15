"use strict";
exports.__esModule = true;
exports.rewrite = void 0;
var parser_1 = require("@babel/parser");
var magic_string_1 = require("magic-string");
function rewrite(source, asSFCScript) {
    if (asSFCScript === void 0) { asSFCScript = false; }
    var ast = parser_1.parse(source, {
        sourceType: 'module',
        plugins: [
            // by default we enable proposals slated for ES2020.
            // full list at https://babeljs.io/docs/en/next/babel-parser#plugins
            // this will need to be updated as the spec moves forward.
            'bigInt',
            'optionalChaining',
            'nullishCoalescingOperator'
        ]
    }).program.body;
    var s = new magic_string_1["default"](source);
    ast.forEach(function (node) {
        if (node.type === 'ImportDeclaration') {
            if (/^[^\.\/]/.test(node.source.value)) {
                // module import
                // import { foo } from 'vue' --> import { foo } from '/__modules/vue'
                s.overwrite(node.source.start, node.source.end, "\"/__modules/" + node.source.value + "\"");
            }
        }
        else if (asSFCScript && node.type === 'ExportDefaultDeclaration') {
            s.overwrite(node.start, node.declaration.start, "let __script; export default (__script = ");
            s.appendRight(node.end, ")");
        }
    });
    return s.toString();
}
exports.rewrite = rewrite;
