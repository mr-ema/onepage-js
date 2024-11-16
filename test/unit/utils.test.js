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
import { toKebabCase } from "../../src/utils.js";


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
