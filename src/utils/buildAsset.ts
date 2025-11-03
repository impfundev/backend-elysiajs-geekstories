export function buildAsset() {
  Bun.build({
    entrypoints: ["./assets/main.ts"],
    outdir: "./public",
    minify: true,
    splitting: true,
  })
    .then((res) => console.log("Asset Initialized"))
    .catch((error) => console.error(`Asset failed to initialized ${error}`));

  Bun.build({
    entrypoints: ["./assets/highlighter.ts"],
    outdir: "./public",
    minify: true,
    splitting: true,
  })
    .then((res) => console.log("Asset Initialized"))
    .catch((error) => console.error(`Asset failed to initialized ${error}`));
}
