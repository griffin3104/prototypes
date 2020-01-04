import fs from "fs-extra";

export interface ReqRecord {
  url: string;
  method: string;
  time: number;
  post_param: string;
  max_age: string;
}

export default class Analyzer {
  orgData: any | null = null;

  constructor(path: string) {
    let dataStr = fs.readFileSync(path);
    this.orgData = JSON.parse(dataStr.toString());
  }

  analyze(): Array<ReqRecord> {
    let result: Array<ReqRecord> = [];

    for (let entry of this.orgData.log.entries) {
      let param = "";
      if (entry.request.postData) {
        param = entry.request.postData.text;
      }
      let age = "";
      if (entry.response.headers) {
        for (let head of entry.response.headers) {
          if (head.name == "Cache-Control") {
            age = head.value;
          }
        }
      }
      let rec: ReqRecord = {
        url: entry.request.url,
        method: entry.request.method,
        time: entry.time,
        post_param: param,
        max_age: age
      };
      result.push(rec);
    }
    return result;
  }
}
