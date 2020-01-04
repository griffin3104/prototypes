"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var Analyzer = /** @class */ (function () {
    function Analyzer(path) {
        this.orgData = null;
        var dataStr = fs_extra_1.default.readFileSync(path);
        this.orgData = JSON.parse(dataStr.toString());
    }
    Analyzer.prototype.analyze = function () {
        var result = [];
        for (var _i = 0, _a = this.orgData.log.entries; _i < _a.length; _i++) {
            var entry = _a[_i];
            var param = "";
            if (entry.request.postData) {
                param = entry.request.postData.text;
            }
            var age = "";
            if (entry.response.headers) {
                for (var _b = 0, _c = entry.response.headers; _b < _c.length; _b++) {
                    var head = _c[_b];
                    if (head.name == "Cache-Control") {
                        age = head.value;
                    }
                }
            }
            var rec = {
                url: entry.request.url,
                method: entry.request.method,
                time: entry.time,
                post_param: param,
                max_age: age
            };
            result.push(rec);
        }
        return result;
    };
    return Analyzer;
}());
exports.default = Analyzer;
