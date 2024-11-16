// Zero-Clause BSD
//
// Permission to use, copy, modify, and/or distribute this software for
// any purpose with or without fee is hereby granted.
//
// THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL
// WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES
// OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
// FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
// DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN
// AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT
// OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


import { spawn } from "bun";
import { watch } from "fs";
import { join, extname, normalize } from "path";


const allowedDirs = ["examples", "dist"];
const server = Bun.serve({
    port: 8000,

    async fetch(req) {
        const url = new URL(req.url);
        const normalizedPath = normalize(url.pathname);
        if (normalizedPath === "/") {
            return Response.redirect("/examples", 301);
        }

        const isAllowed = allowedDirs.some(dir => normalizedPath.startsWith("/" + dir));
        if (!isAllowed) {
            return new Response("403 Forbidden", { status: 403 });
        }

        const path = join(import.meta.dir, normalizedPath);
        const file = Bun.file(path);
        if (await file.exists()) {
            return new Response(file);
        }

        // Try to serve html files
        const htmlFile = await htmlFileOrNull(path);
        if (htmlFile !== null) {
            return new Response(htmlFile);
        }

        return new Response("404 Not Found", { status: 404 });
    },
});

/**
 * Attempts to serve an HTML file from a directory or file path.
 * If "index.html" is found in a directory, it serves that file.
 * Otherwise, it tries to serve the requested path with a ".html" extension.
 *
 * @param path {string}
 * @returns {Promise<import("bun").BunFile|null>}
 */
async function htmlFileOrNull(path) {
    const indexFile = Bun.file(join(path, "index.html"));
    if (await indexFile.exists()) {
        return indexFile;
    }

    const htmlPath = extname(path) === "" ? `${path}.html` : path;
    const htmlFile = Bun.file(htmlPath)
    if (await htmlFile.exists()) {
        return htmlFile;
    }

    return null;
}

/*****************
 * File Watcher  *
 *****************/
const watchedDir = join(import.meta.dir, "src");

/** @type {Timer} */
let debounceTimeout;
const debounceTime = 500;

let childProcessActive = false;
const buildWatcher = watch(
    watchedDir,
    { recursive: true, persistent: true },

    (_event, _filename) => {
        // Clear previous timeout if the event fires again before the debounce delay
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        debounceTimeout = setTimeout(() => {
            // Handle the case where the file system triggers multiple events for a single file change.
            // This can happen due to file saving behaviors in editors, tools that create backup or temporary files,
            // or multiple system-level events being fired for a single change. While the watcher can still trigger
            // multiple times in such cases, we ensure that only one build process is spawned at a time.
            // This prevents unnecessary child processes from being started for the same file change.
            if (!childProcessActive) {
                childProcessActive = true;

                const process = spawn(["bun", "run", "build"], {
                    stdout: "inherit",
                    stderr: "inherit",

                    onExit(_process, exitcode, _signalCode, error) {
                        childProcessActive = false;

                        if (error) {
                            console.error(`Build process error: ${error}`);
                        } else if (exitcode !== null && exitcode === 0) {
                            console.info("[INFO] onepage has been rebuild");
                        }
                    }
                });
            }
        }, debounceTime);
    }
);

console.info(`Listening on ${server.url}`);
console.info(`Watching for changes on ${watchedDir}`);

process.on("SIGINT", () => {
    // close watcher when Ctrl-C is pressed
    console.info("\nStopping Server...");
    console.info("Closing watcher [*]");
    buildWatcher.close();

    console.info("Closing watcher [done]");
    console.info("Server has been stopped");
    process.exit(0);
});
