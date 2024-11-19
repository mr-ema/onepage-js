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


describe("toKebabCase", () => {
    const { toKebabCase } = require("../../src/utils.js");

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
    const { deepMerge } = require("../../src/utils.js");

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


describe("generateRandomString", () => {
    const { generateRandomString } = require("../../src/utils.js");

    // Test for generateRandomString
    test("generates a random string of default length (16)", () => {
        const randomString = generateRandomString();
        expect(randomString).toHaveLength(16);
        expect(typeof randomString).toBe("string");
    });

    test("generates a random string of specified length", () => {
        const length = 10;
        const randomString = generateRandomString(length);
        expect(randomString).toHaveLength(length);
        expect(typeof randomString).toBe("string");
    });

    test("generates a string with only alphanumeric characters", () => {
        const randomString = generateRandomString();
        const regex = /^[a-zA-Z0-9]+$/;
        expect(randomString).toMatch(regex);
    });
});

describe("removeSpace", () => {
    const { removeSpace } = require("../../src/utils.js");

    test("removes white space and new lines", () => {
        const raw = "Hello   \n   World \t";
        const result = removeSpace(raw);
        expect(result).toBe("HelloWorld");
    });

    test("returns empty string when input is only spaces or new lines", () => {
        const raw = "\n   \t   ";
        const result = removeSpace(raw);
        expect(result).toBe("");
    });

});

describe("extractClassName", () => {
    const { extractClassName } = require("../../src/utils.js");

    test("extracts class names from a CSS-like string", () => {
        const raw = ".class1 { color: red; } .class2 { font-size: 12px; }";
        const classNames = extractClassName(raw);
        expect(classNames).toEqual(["class1"]);
    });

    test("returns an empty array when no class names are found", () => {
        const raw = "body { color: blue; }";
        const classNames = extractClassName(raw);
        expect(classNames).toEqual([]);
    });
});

describe("addPrefixToClassNames", () => {
    const { addPrefixToClassNames } = require("../../src/utils.js");

    test("adds a prefix to class names in a CSS-like string", () => {
        const raw = ".class1 { color: red; } .class2 { font-size: 12px; }";
        const prefix = "prefix";
        const result = addPrefixToClassNames(raw, prefix);
        expect(result).toBe(".prefix-class1 { color: red; } .prefix-class2 { font-size: 12px; }");
    });

    test("returns the same string if no class names are found", () => {
        const raw = "body { color: blue; }";
        const prefix = "prefix";
        const result = addPrefixToClassNames(raw, prefix);
        expect(result).toBe("body { color: blue; }");
    });
});

describe("addClassName", () => {
    const { addClassName } = require("../../src/utils.js");

    test("adds a class to an element", () => {
        const elem = document.createElement("div");
        addClassName(elem, "test-class");

        expect(elem.classList.contains("test-class")).toBe(true);
    });

    test("does not throw if the class already exists", () => {
        const elem = document.createElement("div");
        elem.classList.add("test-class");

        addClassName(elem, "test-class");

        expect(elem.classList.contains("test-class")).toBe(true); // Ensure it still exists
    });
});

describe("removeClassName", () => {
    const { removeClassName } = require("../../src/utils.js");

    test("removes a class from an element", () => {
        const elem = document.createElement("div");
        elem.classList.add("test-class");

        removeClassName(elem, "test-class");

        expect(elem.classList.contains("test-class")).toBe(false);
    });

    test("does not throw if the class does not exist", () => {
        const elem = document.createElement("div");

        removeClassName(elem, "nonexistent-class");

        expect(elem.classList.contains("nonexistent-class")).toBe(false); // Ensure it's still not there
    });
});

describe("isParentElementScrollable", () => {
    const { isParentElementScrollable } = require("../../src/utils.js");

    test("returns true if a parent element is scrollable", () => {
        const container = document.createElement("div");
        const child = document.createElement("div");

        // Simulate scroll
        Object.defineProperty(container, "scrollHeight", { value: 200 });
        Object.defineProperty(container, "clientHeight", { value: 100 });

        container.appendChild(child);
        document.body.appendChild(container);

        expect(isParentElementScrollable(child, 1)).toBe(true);
    });

    test("returns false if no scrollable parent exists", () => {
        const container = document.createElement("div");
        const child = document.createElement("div");

        container.style.width = "100px";
        container.style.height = "100px";
        child.style.width = "50px";
        child.style.height = "50px";

        container.appendChild(child);
        document.body.appendChild(container);

        expect(isParentElementScrollable(child, 1)).toBe(false);
    });

    test("traverses indefinitely if depth is -1", () => {
        const container = document.createElement("div");
        const middle = document.createElement("div");
        const child = document.createElement("div");

        // Simulate scroll
        Object.defineProperty(container, "scrollHeight", { value: 200 });
        Object.defineProperty(container, "clientHeight", { value: 100 });

        container.appendChild(middle);
        middle.appendChild(child);
        document.body.appendChild(container);

        expect(isParentElementScrollable(child, -1)).toBe(true);
    });
});

describe("isElementScrollable", () => {
    const { isElementScrollable } = require("../../src/utils.js");

    test("returns true if the element itself is scrollable", () => {
        const element = document.createElement("div");

        // Simulate scroll
        Object.defineProperty(element, "scrollHeight", { value: 200 });
        Object.defineProperty(element, "clientHeight", { value: 100 });

        expect(isElementScrollable(element)).toBe(true);
    });

    test("returns false if the element itself is not scrollable", () => {
        const element = document.createElement("div");
        element.style.width = "100px";
        element.style.height = "100px";

        const child = document.createElement("div");
        child.style.width = "50px";
        child.style.height = "50px";
        element.appendChild(child);

        expect(isElementScrollable(element)).toBe(false);
    });
});

describe("tryToGetScrollableParentElement", () => {
    const { tryToGetScrollableParentElement } = require("../../src/utils.js");

    test("returns the first scrollable parent element", () => {
        const container = document.createElement("div");
        const child = document.createElement("div");

        // Simulate scroll
        Object.defineProperty(container, "scrollHeight", { value: 200 });
        Object.defineProperty(container, "clientHeight", { value: 100 });

        container.appendChild(child);
        document.body.appendChild(container);

        expect(tryToGetScrollableParentElement(child, 1)).toBe(container);
    });

    test("returns null if no scrollable parent exists", () => {
        const container = document.createElement("div");
        const child = document.createElement("div");

        container.style.width = "100px";
        container.style.height = "100px";
        child.style.width = "50px";
        child.style.height = "50px";

        container.appendChild(child);
        document.body.appendChild(container);

        expect(tryToGetScrollableParentElement(child, 1)).toBeNull();
    });

    test("traverses indefinitely if depth is -1", () => {
        const container = document.createElement("div");
        const middle = document.createElement("div");
        const child = document.createElement("div");

        // Simulate scroll
        Object.defineProperty(container, "scrollHeight", { value: 200 });
        Object.defineProperty(container, "clientHeight", { value: 100 });

        expect(container.scrollHeight).toBeGreaterThan(0);
        expect(container.clientHeight).toBeGreaterThan(0);

        container.appendChild(middle);
        middle.appendChild(child);
        document.body.appendChild(container);

        expect(tryToGetScrollableParentElement(child, -1)).toBe(container);
    });
});

describe("slideParentCtnOrNull", () => {
    const constants = require("../../src/constans.js").default;
    const { slideParentCtnOrNull } = require("../../src/utils.js");

    test("returns parent with SLIDER_WRAPPER_CLASS_NAME when found", () => {
        const slide = document.createElement("div");
        const parent = document.createElement("div");
        parent.classList.add(constants.SLIDER_WRAPPER_CLASS_NAME);
        parent.appendChild(slide);
        document.body.appendChild(parent);

        const result = slideParentCtnOrNull(slide);
        expect(result).toBe(parent);
    });

    test("returns null when no parent with SLIDER_WRAPPER_CLASS_NAME is found", () => {
        const slide = document.createElement("div");
        const parent = document.createElement("div");
        parent.appendChild(slide);
        document.body.appendChild(parent);

        const result = slideParentCtnOrNull(slide);
        expect(result).toBeNull();
    });

    test("returns null when no parent element exists", () => {
        const slide = document.createElement("div");
        document.body.appendChild(slide);

        const result = slideParentCtnOrNull(slide);
        expect(result).toBeNull();
    });

    test("supports depth argument", () => {
        const slide = document.createElement("div");
        const parent1 = document.createElement("div");
        const parent2 = document.createElement("div");
        parent2.classList.add(constants.SLIDER_WRAPPER_CLASS_NAME);
        parent1.appendChild(parent2);
        parent2.appendChild(slide);
        document.body.appendChild(parent1);

        const result = slideParentCtnOrNull(slide, 1); // Depth = 1
        expect(result).toBe(parent2);
    });

    test("handles infinite depth (depth = -1)", () => {
        const slide = document.createElement("div");
        const parent1 = document.createElement("div");
        const parent2 = document.createElement("div");
        parent2.classList.add(constants.SLIDER_WRAPPER_CLASS_NAME);
        parent1.appendChild(parent2);
        parent2.appendChild(slide);
        document.body.appendChild(parent1);

        const result = slideParentCtnOrNull(slide, -1); // Infinite depth
        expect(result).toBe(parent2);
    });
});

describe("sectionParentOrNull", () => {
    const constants = require("../../src/constans.js").default;
    const { sectionParentOrNull } = require("../../src/utils.js");

    test("returns parent with SECTION_CLASS_NAME when found", () => {
        const element = document.createElement("div");
        const parent = document.createElement("div");
        parent.classList.add(constants.SECTION_CLASS_NAME);
        parent.appendChild(element);
        document.body.appendChild(parent);

        const result = sectionParentOrNull(element);
        expect(result).toBe(parent);
    });

    test("returns null when no parent with SECTION_CLASS_NAME is found", () => {
        const element = document.createElement("div");
        const parent = document.createElement("div");
        parent.appendChild(element);
        document.body.appendChild(parent);

        const result = sectionParentOrNull(element);
        expect(result).toBeNull();
    });

    test("returns null when no parent element exists", () => {
        const element = document.createElement("div");
        document.body.appendChild(element);

        const result = sectionParentOrNull(element);
        expect(result).toBeNull();
    });

    test("supports depth argument", () => {
        const element = document.createElement("div");
        const parent1 = document.createElement("div");
        const parent2 = document.createElement("div");
        parent2.classList.add(constants.SECTION_CLASS_NAME);
        parent1.appendChild(parent2);
        parent2.appendChild(element);
        document.body.appendChild(parent1);

        const result = sectionParentOrNull(element, 1); // Depth = 1
        expect(result).toBe(parent2);
    });

    test("handles infinite depth (depth = -1)", () => {
        const element = document.createElement("div");
        const parent1 = document.createElement("div");
        const parent2 = document.createElement("div");
        parent2.classList.add(constants.SECTION_CLASS_NAME);
        parent1.appendChild(parent2);
        parent2.appendChild(element);
        document.body.appendChild(parent1);

        const result = sectionParentOrNull(element, -1); // Infinite depth
        expect(result).toBe(parent2);
    });
});

describe("hasReachedEndOfScroll", () => {
    const { hasReachedEndOfScroll } = require("../../src/utils.js");

    test("returns true when at the end of vertical scroll", () => {
        const element = document.createElement("div");
        Object.defineProperty(element, "scrollTop", { value: 100 });
        Object.defineProperty(element, "clientHeight", { value: 50 });
        Object.defineProperty(element, "scrollHeight", { value: 150 });

        expect(hasReachedEndOfScroll(element, "vertical")).toBe(true);
    });

    test("returns false when not at the end of vertical scroll", () => {
        const element = document.createElement("div");
        Object.defineProperty(element, "scrollTop", { value: 50 });
        Object.defineProperty(element, "clientHeight", { value: 50 });
        Object.defineProperty(element, "scrollHeight", { value: 150 });

        expect(hasReachedEndOfScroll(element, "vertical")).toBe(false);
    });

    test("returns true when at the end of horizontal scroll", () => {
        const element = document.createElement("div");
        Object.defineProperty(element, "scrollLeft", { value: 100 });
        Object.defineProperty(element, "clientWidth", { value: 50 });
        Object.defineProperty(element, "scrollWidth", { value: 150 });

        expect(hasReachedEndOfScroll(element, "horizontal")).toBe(true);
    });

    test("returns false when not at the end of horizontal scroll", () => {
        const element = document.createElement("div");
        Object.defineProperty(element, "scrollLeft", { value: 50 });
        Object.defineProperty(element, "clientWidth", { value: 50 });
        Object.defineProperty(element, "scrollWidth", { value: 150 });

        expect(hasReachedEndOfScroll(element, "horizontal")).toBe(false);
    });
});

describe("hasReachedStartOfScroll", () => {
    const { hasReachedStartOfScroll } = require("../../src/utils.js");

    test("returns true when at the start of vertical scroll", () => {
        const element = document.createElement("div");
        Object.defineProperty(element, "scrollTop", { value: 0 });
        Object.defineProperty(element, "clientHeight", { value: 50 });
        Object.defineProperty(element, "scrollHeight", { value: 150 });

        expect(hasReachedStartOfScroll(element, "vertical")).toBe(true);
    });

    test("returns false when not at the start of vertical scroll", () => {
        const element = document.createElement("div");
        Object.defineProperty(element, "scrollTop", { value: 50 });
        Object.defineProperty(element, "clientHeight", { value: 50 });
        Object.defineProperty(element, "scrollHeight", { value: 150 });

        expect(hasReachedStartOfScroll(element, "vertical")).toBe(false);
    });

    test("returns true when at the start of horizontal scroll", () => {
        const element = document.createElement("div");
        Object.defineProperty(element, "scrollLeft", { value: 0 });
        Object.defineProperty(element, "clientWidth", { value: 50 });
        Object.defineProperty(element, "scrollWidth", { value: 150 });

        expect(hasReachedStartOfScroll(element, "horizontal")).toBe(true);
    });

    test("returns false when not at the start of horizontal scroll", () => {
        const element = document.createElement("div");
        Object.defineProperty(element, "scrollLeft", { value: 50 });
        Object.defineProperty(element, "clientWidth", { value: 50 });
        Object.defineProperty(element, "scrollWidth", { value: 150 });

        expect(hasReachedStartOfScroll(element, "horizontal")).toBe(false);
    });
});
