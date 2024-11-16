import terser from "@rollup/plugin-terser";

const build = {
    input: "./src/onepage.js",
    output: {
        file: "./dist/onepage.js",
        format: "iife",
        name: "Onepage",
        sourcemap: false,
    },
}

const minifiedBuild = {
    input: "./src/onepage.js",
    output: {
        file: "./dist/onepage.min.js",
        format: "iife",
        name: "Onepage",
        compact: true,
        sourcemap: false,
    },

    plugins: [terser()],
};

export default [build, minifiedBuild];
