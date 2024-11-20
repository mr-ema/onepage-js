import terser from "@rollup/plugin-terser";

const build = {
    input: "./src/onepage.js",
    output: [
        {
            file: "./dist/onepage.js",
            format: "iife",
            name: "Onepage",
            sourcemap: false,
        },
        {
            file: "./dist/onepage.esm.js",
            format: "esm",
            sourcemap: false,
        },
    ],
}

const minifiedBuild = {
    input: "./src/onepage.js",
    output: [
        {
            file: "./dist/onepage.min.js",
            format: "iife",
            name: "Onepage",
            compact: true,
            sourcemap: false,
        },
        {
            file: "./dist/onepage.esm.min.js",
            format: "esm", // Minified ES module version
            compact: true,
            sourcemap: false,
        },
    ],

    plugins: [terser()],
};

export default [build, minifiedBuild];
