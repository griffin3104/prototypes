import fs from "fs-extra";
import path from "path";

export interface GeoInfo {
  path: string;
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
  state: boolean;
  geoType: string;
}

export default class Parser {
  parse(p: string): Array<GeoInfo> {
    console.log("parse dir:", p);
    const result: Array<GeoInfo> = [];

    if (!fs.existsSync(p)) {
      throw "指定されたディレクトリは存在しません。";
    }

    const list = fs.readdirSync(p);
    list.forEach(f => {
      const full = path.join(p, f);
      if (fs.statSync(full).isDirectory()) {
        const childs = this.parse(full);
        Array.prototype.push.apply(result, childs);
      } else {
        const type = full.split(".");
        if (type[type.length - 1].toLowerCase() == "json") {
          const item: GeoInfo = {
            path: full,
            minLat: 90,
            minLng: 180,
            maxLat: 0,
            maxLng: 0,
            state: false,
            geoType: ""
          };
          const str = fs.readFileSync(full, "utf-8");
          try {
            const json = JSON.parse(str);
            for (let feature of json.features) {
              item.geoType = feature.geometry.type;
              if (feature.geometry.type == "LineString") {
                for (let cordinate of feature.geometry.coordinates) {
                  if (cordinate[0] < item.minLng) {
                    item.minLng = cordinate[0];
                    item.state = true;
                  }
                  if (cordinate[1] < item.minLat) {
                    item.minLat = cordinate[1];
                    item.state = true;
                  }
                  if (cordinate[0] > item.maxLng) {
                    item.maxLng = cordinate[0];
                    item.state = true;
                  }
                  if (cordinate[1] > item.maxLat) {
                    item.maxLat = cordinate[1];
                    item.state = true;
                  }
                }
              } else if (feature.geometry.type == "MultiLineString") {
                for (let multiLine of feature.geometry.coordinates) {
                  for (let cordinate of multiLine) {
                    if (cordinate[0] < item.minLng) {
                      item.minLng = cordinate[0];
                      item.state = true;
                    }
                    if (cordinate[1] < item.minLat) {
                      item.minLat = cordinate[1];
                      item.state = true;
                    }
                    if (cordinate[0] > item.maxLng) {
                      item.maxLng = cordinate[0];
                      item.state = true;
                    }
                    if (cordinate[1] > item.maxLat) {
                      item.maxLat = cordinate[1];
                      item.state = true;
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.log(`[ERROR]<${full}>`, e);
          } finally {
            result.push(item);
          }
        }
      }
    });

    return result;
  }

  makeIndex(outdir: string, datas: Array<GeoInfo>): void {
    const indexDatas: Array<string>[] = [];

    for (const data of datas) {
      const idStr = data.path.split("/");
      const idDat = idStr[idStr.length - 1].split("_");
      const id = idDat[0];

      const minLat = Math.floor(data.minLat);
      const minLng = Math.floor(data.minLng);
      const maxLat = Math.ceil(data.maxLat);
      const maxLng = Math.ceil(data.maxLng);
      for (let ix = minLat; ix < maxLat; ix++) {
        for (let iy = minLng; iy < maxLng; iy++) {
          //console.log(id);
          const idx = ix + "_" + iy;
          if (!indexDatas[idx]) {
            indexDatas[idx] = [];
          }
          indexDatas[idx].push(id);
        }
      }
    }

    console.log("write index!");
    for (const idx in indexDatas) {
      //console.log(idx);
      let listData = {
        index: indexDatas[idx]
      };
      let listStr = JSON.stringify(listData);
      fs.writeFileSync(outdir + "/" + idx + ".json", listStr);
    }
  }
}
