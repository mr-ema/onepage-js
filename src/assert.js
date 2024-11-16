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


/**
 * Custom error type for assertions.
 */
class AssertionError extends Error {
    /** @param message {string} */
    constructor(message) {
        super(message);
        this.name = 'AssertionError';
    }
}

/**
 * Custom error type for never errors (indicating unreachable or "impossible" code).
 */
class NeverError extends Error {
    /** @param message {string} */
    constructor(message) {
        super(message);
        this.name = 'NeverError';
    }
}

/**
 * @param msg {string}
 * @param data {any[]}
 *
 * @throws {AssertionError} Throws an error with a custom message.
 * @returns {never}
 */
function makeAssertion(msg, data) {
    console.error("%c[ASSERTION ERROR]", "color: red;", msg, ...data);
    throw new AssertionError(msg);
}

/**
 * @param msg {string}
 * @param data {any[]}
 *
 * @throws {NeverError} Throws an error with a custom message.
 * @returns {never}
 */
export function never(msg, ...data) {
    console.error("%c[FATAL ERROR]", "color: red;", msg, ...data);
    throw new NeverError(msg);
}

/**
 * @param condition {boolean}
 * @param msg {string}
 * @param data {any[]}
 */
export function assert(condition, msg, ...data) {
    if (!condition) {
        makeAssertion(msg, data);
    }
}
