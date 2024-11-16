// Preserved for potential future use if Bun's build capabilities
// reach parity with Rollup.


await Bun.build({
    entrypoints: ["./src/onepage.js"],
    outdir: "./dist",
    minify: false,
    naming: { entry: "onepage.js" },

    target: "browser",
    format: "iife",
    splitting: false,
});

await Bun.build({
    entrypoints: ["./src/onepage.js"],
    outdir: "./dist",
    minify: true,
    naming: { entry: "onepage.min.js" },

    target: "browser",
    format: "iife",
    splitting: false,
});
