import esbuild from "esbuild";
import parser from "yargs-parser";

function isBooleanAndTrue(value) {
  return (typeof value === "boolean") && Boolean(value);
}

const localeTimeStringOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

function getNowAsString() {
  return (new Date()).toLocaleTimeString([], localeTimeStringOptions);
}

const argv = parser(process.argv.slice(2));
const shouldWatch = isBooleanAndTrue(argv.w) || isBooleanAndTrue(argv.watch);

esbuild.build({
  entryPoints: ["src/modal-portal.ts", "src/modal-controller.ts", "src/portal.ts"],
  outdir: "dist",
  format: "esm",
  watch: shouldWatch ? {
    onRebuild(error, result) {
      const timeString = getNowAsString();
      if (error) console.log(`${timeString}: watch build failed`);
      else console.log(`${timeString}: watch build succeeded`);
    }
  } : false,
}).then(result => {
  if (shouldWatch) console.log("watching...");
});
