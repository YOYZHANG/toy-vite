"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.vueMiddleware = void 0;
var url_1 = require("url");
var path_1 = require("path");
var parseSFC_1 = require("./parseSFC");
var compiler_sfc_1 = require("@vue/compiler-sfc");
var utils_1 = require("./utils");
var moduleRewriter_1 = require("./moduleRewriter");
function vueMiddleware(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, query, filename, descriptor, code, _a, code, errors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    parsed = url_1["default"].parse(req.url, true);
                    query = parsed.query;
                    filename = path_1["default"].join(process.cwd(), parsed.pathname.slice(1));
                    return [4 /*yield*/, parseSFC_1.parseSFC(filename, true /* save last accessed descriptor on the client */)];
                case 1:
                    descriptor = (_b.sent())[0];
                    if (!query.type) {
                        code = "import \"/__hmrClient\"\n";
                        if (descriptor.script) {
                            code += moduleRewriter_1.rewrite(descriptor.script.content, true /* rewrite default export to `script` */);
                        }
                        else {
                            code += "const __script = {}; export default __script";
                        }
                        if (descriptor.template) {
                            code += "\nimport { render as __render } from " + JSON.stringify(parsed.pathname + ("?type=template" + (query.t ? "&t=" + query.t : "")));
                            code += "\n__script.render = __render";
                        }
                        if (descriptor.style) {
                            // TODO
                        }
                        code += "\n__script.__hmrId = " + JSON.stringify(parsed.pathname);
                        return [2 /*return*/, utils_1.sendJS(res, code)];
                    }
                    if (query.type === 'template') {
                        _a = compiler_sfc_1.compileTemplate({
                            source: descriptor.template.content,
                            filename: filename,
                            compilerOptions: {
                                // TODO infer proper Vue path
                                runtimeModuleName: '/__modules/vue'
                            }
                        }), code = _a.code, errors = _a.errors;
                        if (errors) {
                            // TODO
                        }
                        return [2 /*return*/, utils_1.sendJS(res, code)];
                    }
                    if (query.type === 'style') {
                        // TODO
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.vueMiddleware = vueMiddleware;
