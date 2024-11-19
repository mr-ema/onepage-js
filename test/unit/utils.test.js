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


import { expect, test, describe } from "bun:test";
import { toKebabCase, deepMerge } from "../../src/utils.js";


describe("toKebabCase", () => {
    test("converts camelCase to kebab-case", () => {
        expect(toKebabCase("camelCase")).toBe("camel-case");
    });

    test("converts underscores to hyphens", () => {
        expect(toKebabCase("some_property")).toBe("some-property");
    });

    test("converts camelCase with underscores to kebab-case with hyphens", () => {
        expect(toKebabCase("someProperty_testCase")).toBe("some-property-test-case");
    });

    test("handles all lowercase strings", () => {
        expect(toKebabCase("lowercase")).toBe("lowercase");
    });

    test("handles all uppercase strings", () => {
        expect(toKebabCase("UPPERCASE")).toBe("uppercase");
    });

    test("handles single character", () => {
        expect(toKebabCase("A")).toBe("a");
    });

    test("returns empty string if input is empty", () => {
        expect(toKebabCase("")).toBe("");
    });

    test("handles strings with no transformation needed", () => {
        expect(toKebabCase("already-kebab-case")).toBe("already-kebab-case");
    });
});

describe("deepMerge", () => {
    test("merges flat objects", () => {
        const target = { a: 1, b: 2 };
        const source = { b: 3, c: 4 };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    test("merges nested objects", () => {
        const target = { a: 1, b: { x: 10, y: 20 } };
        const source = { b: { y: 30, z: 40 }, c: 4 };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1, b: { x: 10, y: 30, z: 40 }, c: 4 });
    });

    test("merges when target has missing keys", () => {
        const target = {};
        const source = { a: 1, b: 2 };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1, b: 2 });
    });

    test("merges when source has missing keys", () => {
        const target = { a: 1, b: 2 };
        const source = {};
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1, b: 2 });
    });

    test("handles deeply nested structures", () => {
        const target = { a: { b: { c: 1 } } };
        const source = { a: { b: { d: 2 } } };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: { b: { c: 1, d: 2 } } });
    });

    test("overwrites non-object properties", () => {
        const target = { a: { b: 1 } };
        const source = { a: 2 };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 2 });
    });

    test("handles empty target and source", () => {
        const target = {};
        const source = {};
        const result = deepMerge(target, source);

        expect(result).toEqual({});
    });

    test("handles arrays gracefully (does not merge)", () => {
        const target = { a: [1, 2, 3] };
        const source = { a: [4, 5, 6] };
        const result = deepMerge(target, source);

        expect(result).toEqual({ a: [4, 5, 6] });
    });

    test("preserves references for identical keys", () => {
        const sharedObject = { shared: true };
        const target = { a: sharedObject };
        const source = { a: sharedObject };

        /** @type {*} */
        const result = deepMerge(target, source);
        expect(result.a).toBe(sharedObject);
    });
});
