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


import constants from "./constans.js";
import { never } from "./assert.js";
import { deepMerge } from "./utils.js";


/** Global settings */
const settings = {
    constants: constants,

    logger: {
        enabled: false,
        levels: /** @type {Array<LogLevel>} */ (["ALL"]),
    },

    observer: {
        enabled: true,
    },

    scroll: {
        unlockTimeout: 300,     // Time in ms to wait before allow to scroll again
        keyboardScroll: true,   // Enable scroll with keyboard
        swipeScroll: false,     // Enable scroll with mouse draggin (click + direction)
        overflowScroll: false,  // Enable normal scroll when elements have overflow
        speed: 256,             // Scroll 'n' pixels when there is overflow scroll

        direction: /** @type {Direction}     */ ("vertical"),
        behavior: /** @type {ScrollBehavior} */ ("smooth"),
    },

    section: {
        //  pagination: true,
    },

    slider: {
        //   pagination: true,
    },

    keybindings: {
        up: ["ArrowUp", "k", "PageUp"],
        down: ["ArrowDown", "j", "PageDown"],
        left: ["ArrowLeft", "h"],
        right: ["ArrowRight", "l"],
    },
};

/**
 * Helper function to validate settings based on expected types
 *
 * @param key {string}
 * @param value {*}
 */
function _validateSettings(key, value) {
    /** @type {{ [key: string]: string}} */
    const validationRules = {
        "constants.CLASS_NAME_PREFIX": "string",
        "constants.SECTION_CLASS_NAME": "string",
        "constants.ROOT_ID_NAME": "string",
        "constants.SLIDER_WRAPPER_CLASS_NAME": "string",
        "constants.SINGLE_SLIDE_CLASS_NAME": "string",
        "constants.TOUCH_THRESHOLD": "number",
        "constants.MOUSE_SWIPE_DISCARDED_BUTTONS": "array",

        "logger.enabled": "boolean",
        "logger.levels": "array",

        "observer.enabled": "boolean",

        "scroll.unlockTimeout": "number",
        "scroll.keyboardScroll": "boolean",
        "scroll.swipeScroll": "boolean",
        "scroll.overflowScroll": "boolean",
        "scroll.speed": "number",
        "scroll.direction": "string",
        "scroll.behavior": "string",

        "keybindings.up": "array",
        "keybindings.down": "array",
        "keybindings.left": "array",
        "keybindings.right": "array",
    };

    if (!validationRules.hasOwnProperty(key)) {
        never("[settings] Invalid Key");
    }

    const expectedType = validationRules[key];
    if (expectedType) {
        if (expectedType === "array" && !Array.isArray(value)) {
            never(`[settings] Invalid type for ${key}. Expected an array.`);
        } else if (typeof value !== expectedType && expectedType !== "array") {
            never(`[settings] Invalid type for ${key}. Expected ${expectedType}.`);
        }
    }
}

/**
 * Sets or updates options in the settings object.
 *
 * @param newOptions {Object} - Partial settings to update in the main settings object.
 * @throws {Error} If any new option fails validation.
 */
export function setOptions(newOptions) {
    /**
     * Recursively validates and merges new options into existing settings.
     *
     * @param current {Object.<any, any>}
     * @param updates {Object.<any, any>}
     * @param path {string} [path=""] - The current path in dot notation for validation.
     */
    function _validateAndMerge(current, updates, path = "") {
        for (const key in updates) {
            const newKeyPath = path ? `${path}.${key}` : key;
            const newValue = /** @type {Object.<string, string>} */ (updates)[key];

            // If it's an object, recurse to validate nested keys
            if (typeof newValue === "object" && newValue !== null && !Array.isArray(newValue)) {
                if (!current[key]) current[key] = {};
                _validateAndMerge(current[key], newValue, newKeyPath);
            } else {
                _validateSettings(newKeyPath, newValue);
                current[key] = newValue;
            }
        }
    }

    _validateAndMerge(settings, newOptions);
    deepMerge(settings, newOptions);
}

export default settings;
