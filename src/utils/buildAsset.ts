export function buildAsset() {
  Bun.build({
    entrypoints: ["./src/assets/main.ts"],
    outdir: "./public",
    minify: true,
    splitting: true,
  })
    .then((res) => console.log("Asset Initialized"))
    .catch((error) => console.error(`Asset failed to initialized ${error}`));

  Bun.build({
    entrypoints: ["./src/assets/highlighter.ts"],
    outdir: "./public",
    minify: true,
    splitting: true,
  })
    .then((res) => console.log("Asset Highlighter Initialized"))
    .catch((error) =>
      console.error(`Asset Highlighter failed to initialized ${error}`)
    );

  Bun.build({
    entrypoints: ["./src/assets/client/frontend.tsx"],
    outdir: "./public/client",
    minify: true,
    splitting: true,
  })
    .then((res) => console.log("Asset Client Initialized"))
    .catch((error) =>
      console.error(`Asset Client failed to initialized ${error}`)
    );
}
