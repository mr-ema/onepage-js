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


/**
 * @param property {string}
 * @returns {string}
 */
export function toKebabCase(property) {
    return property
        .replace(/_/g, "-") // Replace underscores with hyphens
        .replace(/([a-z])([A-Z])/g, "$1-$2") // Convert camelCase to kebab-case
        .toLowerCase();
}

/**
 * @param elem {Element}
 * @param name {string}
 * @returns {void}
 */
export function addClassName(elem, name) {
    elem.classList.add(name);
}

/**
 * @param elem {Element}
 * @param name {string}
 * @returns {void}
 */
export function removeClassName(elem, name) {
    elem.classList.remove(name);
}

/**
 * @param element {Element}
 * @param depth {number|-1} [depth=0] - If `depth` is -1, the function will traverse the DOM tree indefinitely until it finds a scrollable parent or reaches the top of the DOM tree.
 * @returns {boolean}
 */
export function isParentElementScrollable(element, depth) {
    let parent = element.parentElement;

    for (let level = depth; level <= depth;) {
        if (parent == null) break;

        const hasVerticalScroll = parent.scrollHeight > parent.clientHeight;
        const hasHorizontalScroll = parent.scrollWidth > parent.clientWidth;
        if (hasVerticalScroll || hasHorizontalScroll) {
            return true;
        }

        parent = parent?.parentElement;

        // Keep Iterating Until There Is No More Parents Elements
        if (depth !== -1) {
            level += 1;
        }
    }

    return false;
}

/**
 * @param element {Element}
 * @returns {boolean}
 */
export function isElementScrollable(element) {
    const hasVerticalScroll = element.scrollHeight > element.clientHeight;
    const hasHorizontalScroll = element.scrollWidth > element.clientWidth;

    if (hasVerticalScroll || hasHorizontalScroll) {
        return true;
    }

    return false;
}


/**
 * @param element {Element}
 * @param depth {number|-1} [depth=0] - If `depth` is -1, the function will traverse the DOM tree indefinitely until it finds a scrollable parent or reaches the top of the DOM tree.
 * @returns {Element|null}
 */
export function tryToGetScrollableParentElement(element, depth = 0) {
    let parent = element.parentElement;

    for (let level = depth; level <= depth;) {
        if (parent == null) break;

        const hasVerticalScroll = parent.scrollHeight > parent.clientHeight;
        const hasHorizontalScroll = parent.scrollWidth > parent.clientWidth;
        if (hasVerticalScroll || hasHorizontalScroll) {
            return parent;
        }

        parent = parent?.parentElement;

        // Keep Iterating Until There Is No More Parents Elements
        if (depth !== -1) {
            level += 1;
        }
    }

    return null;
}

/**
 * @param slide {Element}
 * @param depth {number|-1} [depth=0] - If `depth` is -1, the function will traverse the DOM tree indefinitely until it finds a parent or reaches the top of the DOM tree.
 * @returns {Element|null}
 */
export function slideParentCtnOrNull(slide, depth = 0) {
    let parent = slide.parentElement;

    for (let level = depth; level <= depth;) {
        if (parent == null) break;

        if (parent.classList.contains(constants.SLIDER_WRAPPER_CLASS_NAME)) {
            return parent;
        }

        parent = parent?.parentElement;

        // Keep Iterating Until There Is No More Parents Elements
        if (depth !== -1) {
            level += 1;
        }
    }

    return null;
}

/**
 * @param element {Element}
 * @param depth {number|-1} [depth=0] - If `depth` is -1, the function will traverse the DOM tree indefinitely until it finds a parent or reaches the top of the DOM tree.
 * @returns {Element|null}
 */
export function sectionParentOrNull(element, depth = 0) {
    let parent = element.parentElement;

    for (let level = depth; level <= depth;) {
        if (parent == null) break;

        if (parent.classList.contains(constants.SECTION_CLASS_NAME)) {
            return parent;
        }

        parent = parent?.parentElement;

        // Keep Iterating Until There Is No More Parents Elements
        if (depth !== -1) {
            level += 1;
        }

    }

    return null;
}

/**
 * @param element {Element}
 * @param direction {"vertical"|"horizontal"} [direction="vertical"]
 * @returns {boolean}
 */
export function hasReachedEndOfScroll(element, direction = "vertical") {
    switch (direction.toLowerCase()) {
        case "vertical":
            return ((element.scrollTop + element.clientHeight) >= element.scrollHeight);
        case "horizontal":
            return ((element.scrollLeft + element.clientWidth) >= element.scrollWidth);
    }

    return false;
}

/**
 * @param element {Element}
 * @param direction {"vertical"|"horizontal"} [direction="vertical"]
 * @returns {boolean}
 */
export function hasReachedStartOfScroll(element, direction = "vertical") {
    switch (direction.toLowerCase()) {
        case "vertical":
            return (element.scrollTop === 0);
        case "horizontal":
            return (element.scrollLeft === 0);
    }

    return false;
}

/**
 * Wraps all child nodes of the specified element in a new wrapper element.
 *
 * @param parentElement {Element} - The parent element whose child nodes will be wrapped.
 * @param wrapperTag {string} [wrapperTag="div"] - The tag name of the wrapper element to create.
 *
 * @returns {Element} - The newly created wrapper element containing all original child nodes.
 *
 * @note This function assumes any string as a valid tag name, allowing support
 * for custom web components. However, it does not validate the tag name before use.
 */
export function wrapAllChildrenOf(parentElement, wrapperTag = "div") {
    const wrapper = document.createElement(wrapperTag);
    while (parentElement.firstChild) {
        wrapper.appendChild(parentElement.firstChild);
    }

    parentElement.appendChild(wrapper);

    return wrapper;
}

/**
 * Wraps the provided child elements inside a new wrapper element with the specified tag name.
 *
 * @param children {Array<Element>|NodeListOf<Element>} - The child elements to be wrapped.
 * @param wrapperTag {string} [wrapperTag="div"] - The tag name of the wrapper element to create.
 *
 * @returns {Element} - The newly created wrapper element containing all the provided child elements.
 *
 * @note This function assumes any string as a valid tag name, allowing support
 * for custom web components. It does not validate the tag name before use.
 */
export function wrapChildrenInTag(children, wrapperTag = "div") {
    const wrapper = document.createElement(wrapperTag);

    children.forEach(child => {
        wrapper.appendChild(child);
    });

    return wrapper;
}

/**
 * @param element {Element}
 * @returns {NodeListOf<Element>}
 */
export function getSliderListInElement(element) {
    const slider = element.querySelectorAll("." + constants.SLIDER_WRAPPER_CLASS_NAME);

    return slider;
}

/**
 * @param element {Element}
 * @returns {NodeListOf<Element>|null}
 */
export function getSingleSlidesInElementOrNull(element) {
    const slides = element.querySelectorAll("." + constants.SINGLE_SLIDE_CLASS_NAME);
    if (slides.length >= 1) return slides;

    return null;
}

/**
 *  Retrieves the root element by its ID or throws an error if it doesn't exist.
 *
 * @throws {NeverError}
 * @returns {Element}
 */
export function getRootNodeOrThrow() {
    const root = document.getElementById("#" + constants.ROOT_ID_NAME);
    if (root == null) {
        never(`${constants.ROOT_ID_NAME} element not founded in DOOM`);
    }

    return root;
}

/**
 * Merges the source object into the target object recursively.
 *
 * @param target {Object.<any, any>}
 * @param source {Object.<any, any>}
 *
 * @returns {Object} The merged target object.
 */
export function deepMerge(target, source) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (source[key] instanceof Object && target[key] instanceof Object) {
                target[key] = deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }

    return target;
}

/**
 * Generates a random string by combining letters and numbers.
 *
 * @param length {number} [length=16] - specified how long should the generated string be
 * @returns {string} A randomly generated string
 */
export function generateRandomString(length = 16) {
    // Character set to be used in the random class name
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let randomString = "";
    for (let i = 0; i < length; i++) {
        // Append a random character from `chars` to `className`
        randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Return the generated class name with a prefix for readability
    return randomString;
}

/**
 * Removes white space and new line
 *
 * @param raw {string}
 * @returns {string}
 */
export function removeSpace(raw) {
    const regex = /\r?\n|\r|\s+/g;

    return raw.replace(regex, "");
}

/**
 * Extracts class names from a CSS-like string.
 * Matches strings that start with a period (.) followed by the class name,
 * and stops at the first whitespace or `{` character.
 *
 * @param raw {string} - The raw CSS string to search for class names.
 * @returns {Array<string>} - An array of matched class names (without the dot).
 */
export function extractClassName(raw) {
    const regex = /^\s*\.([\w-]+)\s*\{/g;

    const matches = raw.match(regex);
    if (matches) {
        // Clean up matches to remove the leading dot and trailing `{`
        return matches.map(match => match.replace(/^\.\s*|\s*{\s*$/g, ""));
    }

    return [];
}

/**
 * Adds a prefix to each CSS class name in a string.
 * Matches patterns that start with a dot (.) followed by the class name.
 *
 * @param raw {string} - The raw CSS string to modify.
 * @param prefix {string} - The prefix to add to each class name.
 * @returns {string} - The modified CSS string with prefixed class names.
 */
export function addPrefixToClassNames(raw, prefix) {
    // Regular expression to match class names, capturing the name part after the dot
    // \.           - Matches a literal dot (.)
    // ([\w-]+)     - Captures one or more word characters or hyphens as the class name
    return raw.replace(/\.(\w[\w-]*)/g, `.${prefix}-$1`);
}

/**
 * @param elem {Element}
 * @returns {boolean}
 */
export function isSection(elem) {
    return elem.classList.contains(constants.SECTION_CLASS_NAME);
}

/**
 * @param elem {Element}
 * @returns {boolean}
 */
export function isSlider(elem) {
    return elem.classList.contains(constants.SLIDER_WRAPPER_CLASS_NAME);
}

/**
 * @param elem {Element}
 * @returns {boolean}
 */
export function isSlide(elem) {
    return elem.classList.contains(constants.SINGLE_SLIDE_CLASS_NAME);
}

/**
 * Determines whether an element comes before or after its sibling using compareDocumentPosition.
 *
 * @param element {Element}
 * @param sibling {Element}
 * @returns {"before"|"same"|"after"|-1} - Returns '-1' if element is not a direct sibling
 */
export function isElementBeforeOrAfter(element, sibling) {
    if (element === sibling) return "same"

    const position = element.compareDocumentPosition(sibling);
    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        return "before";
    } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        return "after";
    }

    return -1;
}

export default {
    toKebabCase: toKebabCase,
    addClassName: addClassName,
    removeClassName: removeClassName,
    isElementScrollable: isElementScrollable,
    isParentElementScrollable: isParentElementScrollable,
    tryToGetScrollableParentElement: tryToGetScrollableParentElement,
    hasReachedEndOfScroll: hasReachedEndOfScroll,
    hasReachedStartOfScroll: hasReachedStartOfScroll,
    wrapAllChildrenOf: wrapAllChildrenOf,
    wrapChildrenInTag: wrapChildrenInTag,
    slideParentCtnOrNull: slideParentCtnOrNull,
    sectionParentOrNull: sectionParentOrNull,
    getSliderListInElement: getSliderListInElement,
    getSingleSlidesInElementOrNull: getSingleSlidesInElementOrNull,
    getRootNodeOrThrow: getRootNodeOrThrow,
    deepMerge: deepMerge,
    generateRandomString: generateRandomString,
    removeSpace: removeSpace,
    extractClassName: extractClassName,
    addPrefixToClassNames: addPrefixToClassNames,
    isSection: isSection,
    isSlide: isSlide,
    isSlider: isSlider,
    isElementBeforeOrAfter: isElementBeforeOrAfter,
}
