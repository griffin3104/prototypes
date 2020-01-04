"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xlsx_populate_wrapper_1 = __importDefault(require("xlsx-populate-wrapper"));
var path_1 = __importDefault(require("path"));
var analyzer_1 = __importDefault(require("./analyzer"));
function main(harPathStr) {
    var analyzer = new analyzer_1.default(harPathStr);
    var datas = analyzer.analyze();
    //console.log(datas)
    var harPath = path_1.default.resolve(harPathStr);
    var workbook = new xlsx_populate_wrapper_1.default(harPath);
    workbook
        .init()
        .then(function (wb) {
        var jsonDatas = wb.getData("list");
        console.log(jsonDatas);
    })
        .catch(function (err) {
        console.log(err);
    });
}
main(process.argv[2]);
