import { expect, test, describe, beforeEach } from "bun:test";
import settings, { setOptions } from "../../src/settings.js";

describe("setOptions", () => {
    const oldSettings = structuredClone(settings);
    beforeEach(() => {
        setOptions(oldSettings);
    });

    test("validates and sets valid options", () => {
        const newOptions = {
            constants: {
                CLASS_NAME_PREFIX: "newPrefix",
                SLIDER_WRAPPER_CLASS_NAME: "newWrapper",
            },
        };

        expect(() => setOptions(newOptions)).not.toThrow();  // Should not throw any errors
    });

    test("throws error on invalid option type", () => {
        const message = "[settings] Invalid type for constants.CLASS_NAME_PREFIX. Expected string.";
        const newOptions = {
            "constants.CLASS_NAME_PREFIX": 123,  // Invalid type (number instead of string)
        };

        expect(() => setOptions(newOptions)).toThrowError(message);
    });

    test("throws error on unknown option key", () => {
        const message = "[settings] Invalid Key";
        const newOptions = {
            "unknown.key": "value",  // Unknown key
        };

        expect(() => setOptions(newOptions)).toThrowError(message);
    });

    test("validates nested options", () => {
        const newOptions = {
            "scroll": {
                "unlockTimeout": 2000,  // Valid nested option
                "keyboardScroll": true,  // Valid nested option
            },
        };

        expect(() => setOptions(newOptions)).not.toThrow();  // Should not throw any errors
    });

    test("throws error on invalid nested option type", () => {
        const message = "[settings] Invalid type for scroll.keyboardScroll. Expected boolean.";
        const newOptions = {
            "scroll": {
                "keyboardScroll": "true",  // Invalid type (string instead of boolean)
            },
        };

        expect(() => setOptions(newOptions)).toThrowError(message);
    });

    test("invalid syntax", () => {
        const newOptions = {
            "constants.CLASS_NAME_PREFIX": "newPrefix",
            "scroll.unlockTimeout": 1000,  // Valid nested option
        };

        setOptions(newOptions);
        expect(settings.scroll.unlockTimeout).not.toBe(1000);
        expect(settings.constants.CLASS_NAME_PREFIX).not.toBe("newPrefix");
    });
});