import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "dist",
  external: ["node_modules/*"],
  format: "esm",
});
