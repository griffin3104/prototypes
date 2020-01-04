import Analyzer, { ReqRecord } from "./analyzer";
import fs from "fs-extra";

function main(harPathStr: string) {
  let analyzer = new Analyzer(harPathStr);
  let datas: Array<ReqRecord> = analyzer.analyze();

  fs.writeFileSync(
    "./out/output.csv",
    "URL\tmethod\ttime,max-age\tpost-params\n"
  );
  for (let data of datas) {
    let rec = `${data.url}\t${data.method}\t${data.time}\t${data.max_age}\t${data.post_param}\n`;
    fs.appendFileSync("./out/output.csv", rec);
  }
}

main(process.argv[2]);
