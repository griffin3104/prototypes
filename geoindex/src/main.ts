import Parser from "./parser";

function main(indir, outdir) {
  console.log("indir:", indir);
  console.log("outdir:", outdir);
  const parser = new Parser();
  const files = parser.parse(indir);
  console.log("files:", files);
  if (files.length > 0) {
    parser.makeIndex(outdir, files);
  }
}

main(process.argv[2], process.argv[3]);
