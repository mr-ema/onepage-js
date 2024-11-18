var Onepage = (function () {
        'use strict';

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


        const constants = {
                CLASS_NAME_PREFIX: "op",
                SECTION_CLASS_NAME: "section",
                ROOT_ID_NAME: "onepage",
                SLIDER_WRAPPER_CLASS_NAME: "slider-ctn",
                SINGLE_SLIDE_CLASS_NAME: "slide",
                TOUCH_THRESHOLD: 30, // Minimum distance in pixels to consider it a swipe

                /**
                 * Specifies the mouse buttons to ignore during swipe interactions.
                 * This list is used to discard specific buttons when swiping with a mouse,
                 * allowing the swipe action to proceed only when other buttons are used.
                 *
                 * Possible values for mouse buttons:
                 * 0: Main button pressed, usually the left button or the un-initialized state.
                 * 1: Auxiliary button pressed, usually the wheel button or the middle button (if present).
                 * 2: Secondary button pressed, usually the right button.
                 * 3: Fourth button, typically the Browser Back button.
                 * 4: Fifth button, typically the Browser Forward button.
                 *
                 * @type {Array<MouseButton>}
                 */
                MOUSE_SWIPE_DISCARDED_BUTTONS: [2],
        };

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
         * @throws {NeverError} Throws an error with a custom message.
         * @returns {never}
         */
        function never(msg, ...data) {
            console.error("%c[FATAL ERROR]", "color: red;", msg, ...data);
            throw new NeverError(msg);
        }

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
         * @param property {string}
         * @returns {string}
         */
        function toKebabCase(property) {
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
        function addClassName(elem, name) {
            elem.classList.add(name);
        }

        /**
         * @param elem {Element}
         * @param name {string}
         * @returns {void}
         */
        function removeClassName(elem, name) {
            elem.classList.remove(name);
        }

        /**
         * @param element {Element}
         * @param depth {number|-1} [depth=0] - If `depth` is -1, the function will traverse the DOM tree indefinitely until it finds a scrollable parent or reaches the top of the DOM tree.
         * @returns {boolean}
         */
        function isParentElementScrollable(element, depth) {
            let parent = element.parentElement;

            for (let level = depth; level <= depth; level += 1) {
                if (parent == null) break;

                const hasVerticalScroll = parent.scrollHeight > parent.clientHeight;
                const hasHorizontalScroll = parent.scrollWidth > parent.clientWidth;
                if (hasVerticalScroll || hasHorizontalScroll) {
                    return true;
                }

                parent = parent?.parentElement;

                // Keep Iterating Until There Is No More Parents Elements
                if (depth === -1) level = depth;
            }

            return false;
        }

        /**
         * @param element {Element}
         * @returns {boolean}
         */
        function isElementScrollable(element) {
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
        function tryToGetScrollableParentElement(element, depth = 0) {
            let parent = element.parentElement;

            for (let level = depth; level <= depth; level += 1) {
                if (parent == null) break;

                const hasVerticalScroll = parent.scrollHeight > parent.clientHeight;
                const hasHorizontalScroll = parent.scrollWidth > parent.clientWidth;
                if (hasVerticalScroll || hasHorizontalScroll) {
                    return parent;
                }

                parent = parent?.parentElement;

                // Keep Iterating Until There Is No More Parents Elements
                if (depth === -1) level = depth;
            }

            return null;
        }

        /**
         * @param slide {Element}
         * @param depth {number|-1} [depth=0] - If `depth` is -1, the function will traverse the DOM tree indefinitely until it finds a parent or reaches the top of the DOM tree.
         * @returns {Element|null}
         */
        function slideParentCtnOrNull(slide, depth = 0) {
            let parent = slide.parentElement;

            for (let level = depth; level <= depth; level += 1) {
                if (parent == null) break;

                if (parent.classList.contains(constants.SLIDER_WRAPPER_CLASS_NAME)) {
                    return parent;
                }

                parent = parent?.parentElement;

                // Keep Iterating Until There Is No More Parents Elements
                if (depth === -1) level = depth;
            }

            return null;
        }

        /**
         * @param element {Element}
         * @param depth {number|-1} [depth=0] - If `depth` is -1, the function will traverse the DOM tree indefinitely until it finds a parent or reaches the top of the DOM tree.
         * @returns {Element|null}
         */
        function sectionParentOrNull(element, depth = 0) {
            let parent = element.parentElement;

            for (let level = depth; level <= depth; level += 1) {
                if (parent == null) break;

                if (parent.classList.contains(constants.SECTION_CLASS_NAME)) {
                    return parent;
                }

                parent = parent?.parentElement;

                // Keep Iterating Until There Is No More Parents Elements
                if (depth === -1) level = depth;
            }

            return null;
        }

        /**
         * @param element {Element}
         * @param direction {"vertical"|"horizontal"} [direction="vertical"]
         * @returns {boolean}
         */
        function hasReachedEndOfScroll(element, direction = "vertical") {
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
        function hasReachedStartOfScroll(element, direction = "vertical") {
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
        function wrapAllChildrenOf(parentElement, wrapperTag = "div") {
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
        function wrapChildrenInTag(children, wrapperTag = "div") {
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
        function getSliderListInElement(element) {
            const slider = element.querySelectorAll("." + constants.SLIDER_WRAPPER_CLASS_NAME);

            return slider;
        }

        /**
         * @param element {Element}
         * @returns {NodeListOf<Element>|null}
         */
        function getSingleSlidesInElementOrNull(element) {
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
        function getRootNodeOrThrow() {
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
        function deepMerge(target, source) {
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    if (source[key] instanceof Object && target[key] instanceof Object) {
                        target[key] = deepMerge(target[key], source[key]);
                    }
                } else {
                    target[key] = source[key];
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
        function generateRandomString(length = 16) {
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
        function removeSpace(raw) {
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
        function extractClassName(raw) {
            const regex = /^\s*\.([\w-]+)\s*\{/g;

            const matches = raw.match(regex);
            if (matches) {
                // Clean up matches to remove the leading dot and trailing `{`
                return matches.map(match => match.replace(/^\.\s*|[{]\s*$/g, ''));
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
        function addPrefixToClassNames(raw, prefix) {
            // Regular expression to match class names, capturing the name part after the dot
            // \.           - Matches a literal dot (.)
            // ([\w-]+)     - Captures one or more word characters or hyphens as the class name
            return raw.replace(/\.(\w[\w-]*)/g, `.${prefix}-$1`);
        }

        /**
         * @param elem {Element}
         * @returns {boolean}
         */
        function isSection(elem) {
            return elem.classList.contains(constants.SECTION_CLASS_NAME);
        }

        /**
         * @param elem {Element}
         * @returns {boolean}
         */
        function isSlider(elem) {
            return elem.classList.contains(constants.SLIDER_WRAPPER_CLASS_NAME);
        }

        /**
         * @param elem {Element}
         * @returns {boolean}
         */
        function isSlide(elem) {
            return elem.classList.contains(constants.SINGLE_SLIDE_CLASS_NAME);
        }

        /**
         * Determines whether an element comes before or after its sibling using compareDocumentPosition.
         *
         * @param element {Element}
         * @param sibling {Element}
         * @returns {"before"|"same"|"after"|-1} - Returns '-1' if element is not a direct sibling
         */
        function isElementBeforeOrAfter(element, sibling) {
            if (element === sibling) return "same"

            const position = element.compareDocumentPosition(sibling);
            if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                return "before";
            } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                return "after";
            }

            return -1;
        }

        var utils = {
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
        };

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
        function setOptions(newOptions) {
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



        let _cssAcummulator = "";

        /**
         * The `css` tagged template literal function allows you to define CSS styles dynamically.
         * It processes the template literal, optionally extracts a custom class name if provided,
         * or generates a random class name if no custom class is specified. The resulting styles
         * are then injected into the document with the assigned class name.
         *
         * @usage
         * - **With Custom Class Name:** Define a CSS style with a class name in the template,
         *   and the function will use this class name in the output.
         * - **Without a Class Name:** If no class name is defined in the template, the function
         *   generates a unique class name for the styles.
         *
         * @param strings {TemplateStringsArray} - The static parts of the template literal.
         * @param values {...string} - The dynamic parts of the template literal.
         * @returns {string} - The generated or specified class name applied to the CSS styles.
         *
         * @example
         * // With a custom class name
         * const styles = css`.myCustomClass { color: blue; font-size: 16px; }`;
         * // `styles` will be "prefix-myCustomClass", and the styles will be applied to ".prefix-myCustomClass"
         *
         * @example
         * // Without a custom class name
         * const color = 'red';
         * const styles = css`color: ${color}; font-size: 18px;`;
         * // `styles` will be a randomly generated class name, e.g., "prefix-random123"
         * // The styles will be injected as ".prefix-random123 { color: red; font-size: 18px; }"
         */
        function css(strings, ...values) {
            let result = strings.reduce((accum, str, i) => {
                let value = values[i] ? values[i] : '';
                return accum + str + value;
            }, '');

            // Remove new lines and white space
            let fmtResult = utils.removeSpace(result);

            const match = utils.extractClassName(fmtResult);
            const className = match ? match[0] : utils.generateRandomString();

            if (match) {
                _cssAcummulator += fmtResult;
            } else {
                _cssAcummulator += `.${className} {${fmtResult}}`;
            }

            return className;
        }

        function createHeadStyles() {
            const fmtCss = utils.addPrefixToClassNames(_cssAcummulator, constants.CLASS_NAME_PREFIX);

            const cssTemplate = `<style> ${fmtCss}</style>`;
            document.head.insertAdjacentHTML("beforeend", cssTemplate);
        }

        /**
         * @param sections {SectionList}
         *
         * @throws {NeverError} - Throws an error if root element doesn't exist.
         */
        function injectStylesOrThrow() {
            const root = utils.getRootNodeOrThrow();

            _injectTopLevelClasses(root);
        }

        /** @param root {Element} */
        function _injectTopLevelClasses(root) {
            const html = document.documentElement;
            const body = document.getElementsByTagName("body")[0];

            utils.addClassName(html, classes.html);
            utils.addClassName(body, classes.html);

            if (settings.scroll.direction.toLowerCase() === "horizontal") {
                utils.addClassName(root, classes.horizontal);
            } else {
                utils.addClassName(root, classes.vertical);
            }
        }

        const classes = (() => {
            const _classes = {
                html: css`
        .document {
            overflow: hidden;

            margin: 0;
            padding: 0;
        }
    `,

                vertical: css`
        .vertical {
            display: flex;
            flex-direction: column;
        }
    `,

                horizontal: css`
        .horizontal {
            display: flex;
            flex-direction: row;
        }
    `,

                section: css`
        .section {
            display: flex;
            align-items: center;
            justify-content: center;

            max-height: 100vh;
            min-height: 100vh;

            max-width: 100vw;
            min-width: 100vw;

            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
        }
    `,

                overflow: css`
        .overflow {
            overflow: auto;

            max-height: 100vh;

            /* Hide Scrollbar */
            -ms-overflow-style: none; /* [IE And Edge] */
            scrollbar-width: none; /* [Firefox] */

            /* [Chrome, Safari And Opera] */
            ::-webkit-scrollbar { display: none; }
        }
    `,

                sliderWrapper: css`
        .slider-wrapper {
            z-index: 1;
            overflow: hidden;
            position: relative;
            display: flex;
            flex-direction: row;

            transition: all 0.3s ease-out;
            -webkit-transition: all 0.3s ease-out; /* [Safari <= 6, Android <= 4.3] */

            max-height: 100vh;
            max-width: 100vw;
        }
    `,

                slide: css`
        .slide {
            display: flex;
            justify-content: center;
            align-items: center;

            min-height: 100vh;
            min-width: 100vw;
        }
    `,

                sectionPagination: css`
        .section-pagination {
            position: absolute;
            right: 10px;
            top: 50%;
            z-index: 2;
            list-style: none;

            margin: 0;
            padding: 0;

            li {
                padding: 0;
                text-align: center;
            }

            li a {
                padding: 10px;
                width: 4px;
                height: 4px;
                display: block;
            }

            li a:before {
                content: '';
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(0,0,0,0.85);
                border-radius: 10px;
                -webkit-border-radius: 10px;
                -moz-border-radius: 10px;
            }

            li a.active:before {
                width: 10px;
                height: 10px;
                background: none;
                border: 1px solid black;
                margin-top: -4px;
                left: 8px;
            }
        }
    `,
            };

            /** @type {Proxy<typeof _classes>} */
            return new Proxy(_classes, {
                get(target, prop) {
                    if (prop in target) {
                        const property = target[/** @type {keyof _classes} */(prop)];
                        return `${constants.CLASS_NAME_PREFIX}-${property}`;
                    }
                }
            });
        })();

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
         * Simple console logger singleton
         *
         * @type {Logger}
         */
        const Logger = (() => {
            /** @type {LogLevel} */
            const LogLevel = Object.freeze({
                DEBUG: 1,
                INFO: 2,
                WARN: 4,
                ERROR: 8,

                ALL: (2 ** 4) - 1
            });

            /** @type {number} */
            let _activeLevels = (() => {
                let finalLevel = 0;
                for (const level of settings.logger.levels) {
                    if (Object.hasOwn(LogLevel, level) && finalLevel < LogLevel.ALL) {
                        finalLevel += LogLevel[level];
                    }
                }

                return finalLevel === 0 ? LogLevel.ALL : finalLevel;
            })();

            /**
             * @param level {LogLevel}
             * @returns {boolean}
             */
            function shouldLog(level) {
                return settings.logger.enabled && (_activeLevels & level) !== 0;
            }

            /**
              * @param  message {string}- The message to log.
              * @param  data {...any[]} - Optional additional parameters to log.
              */
            function debug(message, ...data) {
                if (shouldLog(LogLevel.DEBUG)) {
                    console.debug("%c[DEBUG]", "color: gray;", message, ...data);
                }
            }

            /**
              * @param  message {string}- The message to log.
              * @param  data {...any[]} - Optional additional parameters to log.
              */
            function info(message, ...data) {
                if (shouldLog(LogLevel.INFO)) {
                    console.info("%c[INFO]", "color: blue;", message, ...data);
                }
            }

            /**
              * @param  message {string}- The message to log.
              * @param  data {...any[]} - Optional additional parameters to log.
              */
            function warn(message, ...data) {
                if (shouldLog(LogLevel.WARN)) {
                    console.warn("%c[WARN]", "color: orange;", message, ...data);
                }
            }

            /**
              * @param  message {string}- The message to log.
              * @param  data {...any[]} - Optional additional parameters to log.
              */
            function error(message, ...data) {
                if (shouldLog(LogLevel.ERROR)) {
                    console.error("%c[ERROR]", "color: red;", message, ...data);
                }
            }

            /**
             * @param  levels {LogLevel}
             */
            function setLevel(levels) {
                _activeLevels = levels;
            }

            return {
                error,
                warn,
                info,
                debug,
                setLevel
            }
        })();

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
         * Singleton module
         * @type {WheelEventHandler}
         */
        const WheelEventHandler = (() => {
            let _isListen = false;
            let _direction = /** @type {Vector2} */  { x: 0, y: 0 };

            /** @type {{ [key: string]: Array<(event: WheelEvent) => void | Promise<void>>}} */
            const _listeners = {
                "wheel": []
            };

            /**
             * Add a listener for a specific event type
             * @type {typeof WheelEventHandler.on}
             */
            function on(type, callback) {
                if (_listeners[type]) {
                    _listeners[type].push(callback);

                    Logger.debug(`WheelEventHandler: event listener '${type}' [added]`);
                } else {
                    never(`WheelEventHandler: unsupported event type: '${type}' (supported types list [${Object.keys(_listeners).join(', ')}])`);
                }
            }

            /**
             * Remove a listener for a specific event type
             * @type {typeof WheelEventHandler.off}
             */
            function off(type, callback) {
                if (_listeners[type]) {
                    _listeners[type] = _listeners[type].filter(fn => fn !== callback);

                    Logger.debug(`WheelEventHandler: event listener '${type}' [removed]`);
                }
            }

            /** Executes all registered listeners for a specified event type.
             * @param type {WheelEventType}
             * @param event {WheelEvent}
             */
            async function _notifyListeners(type, event) {
                if (_listeners[type]) {
                    for (const listener of _listeners[type]) {
                        await listener(event);
                    }
                }
            }

            /** @param event {WheelEvent} */
            function _handleWheel(event) {
                _direction.y = (event.deltaY > 0) ? 1 : -1;
                _direction.x = (event.deltaX > 0) ? 1 : -1;

                _notifyListeners("wheel", event);
            }

            /* @type {typeof WheelEventHandler.getAxis} */
            function getAxis(direction = "vertical") {
                if (_direction.x === 0 && _direction.y === 0) return 0;

                switch (direction) {
                    case "vertical":
                        return /** @type {Axis} */(_direction.y);
                    case "horizontal":
                        return /** @type {Axis} */(_direction.x);
                }

                return 0;
            }

            /* @type {typeof WheelEventHandler.isEventAvailable} */
            function isEventAvailable() {
                return (typeof window?.WheelEvent) !== "undefined";
            }

            function startListen() {
                if (_isListen) return;

                if (window?.WheelEvent) {
                    document.addEventListener("wheel", _handleWheel, false);
                }

                Logger.debug("WheelEventHandler: wheel event listeners [started]");

                _isListen = true;
            }

            function stopListen() {
                if (!_isListen) return;

                if (window?.WheelEvent) {
                    document.removeEventListener("wheel", _handleWheel, false);
                }

                Logger.debug("WheelEventHandler: wheel event listeners [stoped]");

                _isListen = false;
            }

            return {
                startListen: startListen,
                stopListen: stopListen,
                getAxis: getAxis,
                on: on,
                off: off,
                isEventAvailable: isEventAvailable
            };
        })();

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
         * Singleton module
         * @type {SwipeEventHandler}
         */
        const SwipeEventHandler = (() => {
            const { MOUSE_SWIPE_DISCARDED_BUTTONS } = constants;

            let _isListen = false;
            let _startPos = /** @type {Vector2} */  { x: 0, y: 0 };
            let _currentPos = /** @type {Vector2} */  { x: 0, y: 0 };

            /** @type {{ [key: string]: Array<(event: SwipeEvent) => void | Promise<void>>}} */
            const _listeners = {
                swipeStart: [],
                swipeEnd: []
            };

            /**
             * Add a listener for a specific event type
             * @type {typeof SwipeEventHandler.on}
             */
            function on(type, callback) {
                if (_listeners[type]) {
                    _listeners[type].push(callback);

                    Logger.debug(`SwipeEventHandler: event listener '${type}' [added]`);
                } else {
                    never(`SwipeEventHandler: unsupported event type: '${type}' (supported types list [${Object.keys(_listeners).join(', ')}])`);
                }
            }

            /**
             * Remove a listener for a specific event type
             * @type {typeof SwipeEventHandler.off}
             */
            function off(type, callback) {
                if (_listeners[type]) {
                    _listeners[type] = _listeners[type].filter(fn => fn !== callback);

                    Logger.debug(`SwipeEventHandler: event listener '${type}' [removed]`);
                }
            }

            /** Executes all registered listeners for a specified event type.
             * @param type {SwipeEventType}
             * @param event {SwipeEvent}
             */
            async function _notifyListeners(type, event) {
                if (_listeners[type]) {
                    for (const listener of _listeners[type]) {
                        await listener(event);
                    }
                }
            }

            /**
             * @param event {SwipeEvent}
             * @returns {Promise<void>}
             */
            async function _handleSwipeStart(event) {
                if (window?.TouchEvent && event instanceof TouchEvent) {
                    _startPos.x = event.changedTouches[0].screenX;
                    _startPos.y = event.changedTouches[0].screenY;
                } else if (window?.PointerEvent && event instanceof PointerEvent) {
                    const button = /** @type {MouseButton} */ (event.button);
                    if (!(constants.MOUSE_SWIPE_DISCARDED_BUTTONS.includes(button))) {
                        _startPos.x = event.screenX;
                        _startPos.y = event.screenY;
                    }
                    Logger.debug("SwipeEventHandler: pressed mouse button code on 'swipeStart': ", [button]);
                }

                _notifyListeners("swipeStart", event);
            }

            /**
             * @param event {SwipeEvent}
             * @returns {Promise<void>}
             */
            async function _handleSwipeEnd(event) {
                _currentPos.x = 0;
                _currentPos.y = 0;

                if (window?.TouchEvent && event instanceof TouchEvent) {
                    _currentPos.x = event.changedTouches[0].screenX;
                    _currentPos.y = event.changedTouches[0].screenY;
                } else if (window?.PointerEvent && event instanceof PointerEvent) {
                    const button = /** @type {MouseButton} */ (event.button);
                    if (!(constants.MOUSE_SWIPE_DISCARDED_BUTTONS.includes(button))) {
                        _currentPos.x = event.screenX;
                        _currentPos.y = event.screenY;
                    }

                    Logger.debug("SwipeEventHandler: pressed mouse button code on 'swipeEnd': ", [button]);
                }

                _notifyListeners("swipeEnd", event);
            }

            /** @type {typeof SwipeEventHandler.getAxis} */
            function getAxis(direction = "vertical") {
                if (_currentPos.x === 0 && _currentPos.y === 0) return 0;

                const diffX = _startPos.x - _currentPos.x;
                const diffY = _startPos.y - _currentPos.y;

                if (Math.abs(diffX) > Math.abs(diffY)) {
                    if (Math.abs(diffX) >= constants.TOUCH_THRESHOLD && direction === "horizontal") {
                        return (diffX >= 0 ? 1 : -1);
                    }
                } else {
                    if (Math.abs(diffY) >= constants.TOUCH_THRESHOLD && direction === "vertical") {
                        return (diffY >= 0 ? 1 : -1);
                    }
                }

                return 0;
            }

            /** @type {typeof SwipeEventHandler.isEventAvailable} */
            function isEventAvailable() {
                const has_touch = (typeof window?.TouchEvent) !== "undefined";
                const has_pointer = (typeof window?.PointerEvent) !== "undefined";

                return (has_touch || (has_pointer && settings.scroll.swipeScroll));
            }

            function startListen() {
                if (_isListen) return;

                if ((window?.PointerEvent && settings.scroll.swipeScroll) || window?.TouchEvent) {
                    document.addEventListener("pointerdown", _handleSwipeStart, false);
                    document.addEventListener("pointerup", _handleSwipeEnd, false);
                    document.addEventListener("pointermove", event => event.preventDefault(), false);

                    if (settings.scroll.overflowScroll) {
                        document.addEventListener("pointercancel", _handleSwipeEnd, false);
                    }

                    Logger.debug("SwipeEventHandler: pointer event listeners [started]");
                }

                // Fallback to touch if pointer event is not supported (android/ios)
                if (window?.TouchEvent && (typeof window?.PointerEvent) === "undefined") {
                    document.addEventListener("touchstart", _handleSwipeStart, false);
                    document.addEventListener("touchend", _handleSwipeEnd, false);
                    document.addEventListener("touchmove", event => event.preventDefault(), false);

                    if (settings.scroll.overflowScroll) {
                        document.addEventListener("touchcancel", _handleSwipeEnd, false);
                    }

                    Logger.debug("SwipeEventHandler: touch event listeners [started]");
                }

                _isListen = true;
            }

            function stopListen() {
                if (!_isListen) return;

                if ((window?.PointerEvent && settings.scroll.swipeScroll) || window?.TouchEvent) {
                    document.removeEventListener("pointerdown", _handleSwipeStart, false);
                    document.removeEventListener("pointerup", _handleSwipeEnd, false);
                    document.removeEventListener("pointermove", event => event.preventDefault(), false);

                    Logger.debug("SwipeEventHandler: pointer event listeners [stoped]");
                }

                // Fallback to touch if pointer event is not supported (android/ios)
                if (window?.TouchEvent && (typeof window?.PointerEvent) === "undefined") {
                    document.removeEventListener("touchstart", _handleSwipeStart, false);
                    document.removeEventListener("touchend", _handleSwipeEnd, false);
                    document.removeEventListener("touchmove", event => event.preventDefault(), false);

                    Logger.debug("SwipeEventHandler: touch event listeners [stopped]");
                }

                _isListen = false;
            }

            return {
                startListen: startListen,
                stopListen: stopListen,
                getAxis: getAxis,
                on: on,
                off: off,
                isEventAvailable: isEventAvailable
            };
        })();

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
         * Singleton module
         * @type {KeyEventHandler}
         */
        const KeyEventHandler = (() => {
            let _isListen = false;

            /**
             * @type {{ [key: string]: Array<(event: KeyboardEvent) => void | Promise<void>>}}
             */
            const _listeners = {
                keydown: [],
            };

            let _lastKey = "";

            /**
             * @param element {Element}
             * @param direction {Direction}
             * @returns {void}
             */
            function scrollWithKeys(element, direction = "vertical") {
                if (element.scrollHeight === 0 && element.scrollWidth === 0) return;

                const { speed, behavior } = settings.scroll;

                if (direction === "vertical") {
                    const offsetTop = element.scrollTop;
                    element.scroll({
                        top: (getAxis(direction) * speed) + offsetTop,
                        behavior: behavior
                    });
                } else if (direction === "horizontal") {
                    const offsetLeft = element.scrollLeft;
                    element.scroll({
                        left: (getAxis(direction) * speed) + offsetLeft,
                        behavior: behavior
                    });
                }

                Logger.debug(`KeyEventHandler: scroll with keys called with speed '${speed}' on element`, [element]);
            }

            /**
             * Add a listener for a specific event type
             * @type {typeof KeyEventHandler.on}
             */
            function on(type, callback) {
                if (_listeners[type]) {
                    _listeners[type].push(callback);

                    Logger.debug(`KeyEventHandler: event listener '${type}' [added]`);
                } else {
                    never(`KeyEventHandler: unsupported event type: '${type}' (supported types list [${Object.keys(_listeners).join(', ')}])`);
                }
            }

            /**
             * Remove a listener for a specific event type
             * @type {typeof KeyEventHandler.off}
             */
            function off(type, callback) {
                if (_listeners[type]) {
                    _listeners[type] = _listeners[type].filter(fn => fn !== callback);

                    Logger.debug(`KeyEventHandler: event listener '${type}' [removed]`);
                }
            }

            /** Executes all registered listeners for a specified event type.
             * @param type {KeyEventType}
             * @param event {KeyboardEvent}
             */
            async function _notifyListeners(type, event) {
                if (_listeners[type]) {
                    for (const listener of _listeners[type]) {
                        await listener(event);
                    }
                }
            }

            /**
             * @param event {KeyboardEvent}
             * @returns {Promise<void>}
             */
            async function _keydownEventHandler(event) {
                _lastKey = event.key;
                _notifyListeners("keydown", event);
            }

            /** @type {typeof KeyEventHandler.getAxis } */
            function getAxis(direction = "vertical") {
                if (direction === "vertical") {
                    if (settings.keybindings.up.includes(_lastKey)) return -1;
                    if (settings.keybindings.down.includes(_lastKey)) return 1;
                } else if (direction === "horizontal") {
                    if (settings.keybindings.right.includes(_lastKey)) return 1;
                    if (settings.keybindings.left.includes(_lastKey)) return -1;
                }

                return 0;
            }

            /** @type {typeof KeyEventHandler.isEventAvailable } */
            function isEventAvailable() {
                return ((typeof window?.KeyboardEvent) !== "undefined" && settings.scroll.keyboardScroll);
            }

            function startListen() {
                if (_isListen) return;

                if (window?.KeyboardEvent && settings.scroll.keyboardScroll) {
                    window.addEventListener("keydown", _keydownEventHandler, false);

                    Logger.debug("KeyEventHandler: key event listeners [started]");
                }

                _isListen = true;
            }

            function stopListen() {
                if (!_isListen) return;

                if (window?.KeyboardEvent && settings.scroll.keyboardScroll) {
                    window.removeEventListener("keydown", _keydownEventHandler, false);

                    Logger.debug("KeyEventHandler: key event listeners [stopped]");
                }

                _isListen = false;
            }

            return {
                startListen: startListen,
                stopListen: stopListen,
                getAxis: getAxis,
                on: on,
                off: off,
                scrollWithKeys: scrollWithKeys,
                isEventAvailable: isEventAvailable
            };
        })();

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



        const scroll = (() => {
            let _isScrolling = false;

            /**
             * @param sections {SectionList}
             * @returns {void}
             */
            function init(sections) {

                if (WheelEventHandler.isEventAvailable()) {
                    WheelEventHandler.on("wheel", event => _handleScroll(event, sections));
                    WheelEventHandler.startListen();
                }

                if (KeyEventHandler.isEventAvailable()) {
                    KeyEventHandler.on("keydown", event => {
                        const target = /** @type {Element | null} */ (event.target);
                        if (target?.tagName !== "INPUT" && target?.tagName !== "TEXTAREA") {
                            const section = sections.getCurrentSection();
                            if (_hasOverflowScroll(section, KeyEventHandler.getAxis("vertical"))) {
                                const scrollable = section.elemRef.querySelector("." + classes.overflow);
                                if (scrollable !== null) {
                                    KeyEventHandler.scrollWithKeys(scrollable, "vertical");
                                }
                            } else {
                                _handleScroll(event, sections);
                            }
                        }
                    });

                    KeyEventHandler.startListen();
                }

                if (SwipeEventHandler.isEventAvailable()) {
                    SwipeEventHandler.on("swipeEnd", event => _handleScroll(event, sections));
                    SwipeEventHandler.startListen();
                }
            }

            /**
             * @param section {Section}
             * @param axis {Axis}
             * @returns {boolean} */
            function _hasOverflowScroll(section, axis) {
                const shouldScrollOnOverflow = () => {
                    const scrollable = section.elemRef.querySelector("." + classes.overflow);
                    if (scrollable != null && utils.isElementScrollable(scrollable)) {
                        if (axis === -1) return !(utils.hasReachedStartOfScroll(scrollable));
                        if (axis === 1) return !(utils.hasReachedEndOfScroll(scrollable));
                    }

                    return false;
                };

                if (settings.scroll.overflowScroll) {
                    return shouldScrollOnOverflow();
                }

                return false;
            }

            /**
             * @param event {ScrollEvent}
             * @param direction {Direction}
             * @returns {0|1|-1}
             */
            function _getEventAxis(event, direction) {
                if (window?.PointerEvent && event instanceof PointerEvent) {
                    return SwipeEventHandler.getAxis(direction);
                } else if (window?.TouchEvent && event instanceof TouchEvent) {
                    return SwipeEventHandler.getAxis(direction);
                } else if (window?.WheelEvent && event instanceof WheelEvent) {
                    return WheelEventHandler.getAxis(direction);
                } else if (window?.KeyboardEvent && event instanceof KeyboardEvent) {
                    return KeyEventHandler.getAxis(direction);
                }

                return 0;
            }

            /**
             * @param event {ScrollEvent}
             * @param slider {Slider}
             * @returns {void}
             */
            function _handleSlider(event, slider) {
                if (window?.WheelEvent && event instanceof WheelEvent) return;

                if (_getEventAxis(event, "horizontal") > 0) {
                    slider.next();
                } else if (_getEventAxis(event, "horizontal") < 0) {
                    slider.prev();
                }
            }

            /**
             * @param event {ScrollEvent | SwipeEvent}
             * @param sections {SectionList}
             * @returns {void}
             */
            function _handleScroll(event, sections) {
                const currentSection = sections.getCurrentSection();
                if (currentSection.sliderList.length >= 1) {
                    _handleSlider(event, currentSection.sliderList[0]);
                }

                if (_isScrolling) return;

                _isScrolling = true;
                if (_getEventAxis(event, "vertical") > 0) {
                    if (!_hasOverflowScroll(currentSection, 1)) {
                        sections.scrollNext();
                    }
                } else if (_getEventAxis(event, "vertical") < 0) {
                    if (!_hasOverflowScroll(currentSection, -1)) {
                        sections.scrollPrev();
                    }
                }

                // Unlock scrolling after specified timeout
                setTimeout(() => {
                    _isScrolling = false;
                }, settings.scroll.unlockTimeout);
            }

            return {
                init
            };
        })();

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
         * @param slideList {NodeListOf<Element>}
         * @param {Object} [options]
         * @param {number} [options.initialIndex=0] - The starting index of the slide to display in the list.
         * @returns {Slider}
         */
        function Slider(slideList, options = {}) {
            const elemRef = _getOrCreateElemRef();
            const slides = Array.from(slideList);

            let _currentIndex = options.initialIndex ?? 0;

            function _getOrCreateElemRef() {
                let ctn = slideList.item(0).parentElement;
                if (ctn === null || !utils.isSlider(ctn)) {
                    const ref = utils.wrapChildrenInTag(slideList, "div");
                    ctn?.appendChild(ref);

                    return ref;
                }

                return ctn;
            }

            function _addClasses() {
                utils.addClassName(elemRef, classes.sliderWrapper);

                slides.forEach(slide => {
                    utils.addClassName(slide, classes.slide);
                });
            }

            /**
             * @param elementList {NodeListOf<Element>|Array<Element>}
             * @param index {number}
             * @returns {void}
             */
            function _scrollIntoView(index, elementList) {
                if (index < 0 || index >= elementList.length) return;

                elementList[index].scrollIntoView({
                    behavior: settings.scroll.behavior || "smooth",
                    block: "start",
                });
            }

            /** @param slideElem {Element} */
            function remove(slideElem) {
                if (slides.length <= 0) return;

                const idx = slides.findIndex(slide => slide === slideElem);
                if (idx >= 0) {
                    slides.splice(idx, 1);
                }
            }

            /**
             * @param pos {number}
             * @param slideElem {Element}
             */
            function insert(pos, slideElem) {
                slides.splice(pos, 0, slideElem);
            }

            function next() {
                _currentIndex = (_currentIndex + 1 + slides.length) % slides.length;
                _scrollIntoView(_currentIndex, slides);
            }

            function prev() {
                _currentIndex = (_currentIndex - 1 + slides.length) % slides.length;
                _scrollIntoView(_currentIndex, slides);
            }

            /** @param index {number} */
            function goToSlide(index) {
                if (index < 0 || index >= slides.length) return;

                _scrollIntoView(_currentIndex, slides);
                _currentIndex = index;
            }

            /* -------- Init -------- */
            _addClasses();

            return {
                elemRef: elemRef,
                slideList: slides,

                insert: insert,
                remove: remove,
                prev: prev,
                next: next,
                goToSlide: goToSlide
            };
        }

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
         * @param section {Element}
         * @returns {SliderList}
         */
        function SliderList(section) {
            /** @type {Array<Slider>} */
            const sliderList = new Array();

            (function _init() {
                const sliders = utils.getSliderListInElement(section);
                const aloneSlides = utils.getSingleSlidesInElementOrNull(section);
                if (aloneSlides !== null) {
                    sliderList.push(Slider(aloneSlides));
                }

                sliders.forEach(slider => {
                    const slides = slider.querySelectorAll("." + settings.constants.SINGLE_SLIDE_CLASS_NAME);
                    const sliderRef = Slider(slides);

                    sliderList.push(sliderRef);
                });
            })();

            /** @param sliderElem {Element} */
            function remove(sliderElem) {
                if (sliderList.length <= 0) return;

                const idx = sliderList.findIndex(slider => slider.elemRef === sliderElem);
                if (idx >= 0) {
                    sliderList.splice(idx, 1);
                }
            }

            /**
             * @param pos {number}
             * @param sliderElem {Element}
             */
            function insert(pos, sliderElem) {
                const slides = sliderElem.querySelectorAll("." + settings.constants.SINGLE_SLIDE_CLASS_NAME);
                const sliderRef = Slider(slides);

                sliderList.splice(pos, 0, sliderRef);
            }

            /**
             * @type {ProxyHandler<SliderList>}
             */
            const handler = {
                /**
                 * Intercepts property access on the proxy.
                 *
                 * @param {SliderList} target - The original slider array.
                 * @param {string | symbol} prop - The property being accessed.
                 */
                get(target, prop) {
                    if (prop in target) {
                        return target[/** @type {keyof Array<Slider>}*/(prop)];
                    }

                    switch (prop) {
                        case "insert":
                            return insert;
                        case "remove":
                            return remove;
                        default:
                            return undefined;
                    }
                },
            };

            return new Proxy(/** @type {SliderList} */(sliderList), handler);
        }

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
         * @param section {Element}
         * @returns {Section}
         */
        function Section(section) {
            const elemRef = section;
            const sliderList = SliderList(section);

            (function _addClasses() {
                utils.addClassName(section, classes.section);

                // create a separated function
                if (settings.scroll.overflowScroll) {
                    const wrapper = utils.wrapAllChildrenOf(section);
                    utils.addClassName(wrapper, classes.overflow);
                }
            })();

            return {
                elemRef: elemRef,
                sliderList: sliderList,
            };
        }

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
         * @param sections {NodeListOf<Element>}
         * @returns {SectionList}
         */
        function SectionList(sections) {
            /** @type {Array<Section>} */
            const sectionList = new Array(sections.length);

            let _currentIndex = 0;

            (function _init() {
                sections.forEach((section, idx) => {
                    if (section.classList.contains("active")) {
                        _currentIndex = idx;
                    }

                    const sectionRef = Section(section);

                    sectionList[idx] = sectionRef;
                });

                utils.addClassName(sectionList[_currentIndex].elemRef, "active");
                scrollToSection(_currentIndex);
            })();

            function scrollNext() {
                const nextIdx = (_currentIndex + 1 + sectionList.length) % sectionList.length;
                _scrollIntoView(nextIdx, sectionList);

                _currentIndex = nextIdx;
            }

            function scrollPrev() {
                const prevIdx = (_currentIndex - 1 + sectionList.length) % sectionList.length;
                _scrollIntoView(prevIdx, sectionList);

                _currentIndex = prevIdx;
            }

            /** @param index {number} */
            function scrollToSection(index) {
                if (index < 0 || index >= sectionList.length) return;

                _scrollIntoView(index, sectionList);
                _currentIndex = index;
            }

            /** @param sectionElem {Element} */
            function remove(sectionElem) {
                if (sectionList.length <= 0) return;

                const idx = sectionList.findIndex(section => section.elemRef === sectionElem);
                if (idx >= 0) {
                    sectionList.splice(idx, 1);
                }
            }

            /**
             * @param pos {number}
             * @param sectionElem {Element}
             */
            function insert(pos, sectionElem) {
                const sectionRef = Section(sectionElem);

                sectionList.splice(pos, 0, sectionRef);
            }

            function getCurrentSection() {
                return sectionList[_currentIndex];
            }

            /**
             * @param sectionList {Array<Section>}
             * @param index {number}
             * @returns {void}
             */
            function _scrollIntoView(index, sectionList) {
                if (index < 0 || index >= sectionList.length) return;

                sectionList[index].elemRef.scrollIntoView({
                    behavior: settings.scroll.behavior || "smooth",
                    block: "start",
                });

                utils.removeClassName(sectionList[_currentIndex].elemRef, "active");
                utils.addClassName(sectionList[index].elemRef, "active");
            }

            /**
             * @type {ProxyHandler<SectionList>}
             */
            const handler = {
                /**
                 * Intercepts property access on the proxy.
                 *
                 * @param {SectionList} target - The original slider array.
                 * @param {string | symbol} prop - The property being accessed.
                 */
                get(target, prop) {
                    if (prop in target) {
                        return target[/** @type {keyof Array<Slider>}*/(prop)];
                    }

                    switch (prop) {
                        case "insert":
                            return insert;
                        case "remove":
                            return remove;
                        case "scrollNext":
                            return scrollNext;
                        case "scrollPrev":
                            return scrollPrev;
                        case "scrollToSection":
                            return scrollToSection;
                        case "getCurrentSection":
                            return getCurrentSection;
                        default:
                            return undefined;
                    }
                },
            };

            return new Proxy(/** @type {SectionList} */(sectionList), handler);
        }

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
         * Singleton module
         * @type {DOMLoadEventHandler}
         */
        const DOMLoadEventHandler = (() => {
            let _isListen = false;

            /**
             * @type {{ [key: string]: Array<(event: Event) => void | Promise<void>>}}
             */
            const _listeners = {
                complete: [],
                ready: [],
                beforeExit: [],
                exit: [],
            };

            /** @type {typeof DOMLoadEventHandler.state} */
            let state = "loading";

            /**
             * Add a listener for a specific event type
             * @type {typeof DOMLoadEventHandler.on}
             */
            function on(type, callback) {
                if (_listeners[type]) {
                    _listeners[type].push(callback);

                    Logger.debug(`DOMEventHandler: event listener '${type}' [added]`);
                } else {
                    never(`DOMEventHandler: unsupported event type: '${type}' (supported types list [${Object.keys(_listeners).join(', ')}])`);
                }
            }

            /**
             * Remove a listener for a specific event type
             * @type {typeof DOMLoadEventHandler.off}
             */
            function off(type, callback) {
                if (_listeners[type]) {
                    _listeners[type] = _listeners[type].filter(fn => fn !== callback);

                    Logger.debug(`DOMEventHandler: event listener '${type}' [removed]`);
                }
            }

            /** Executes all registered listeners for a specified event type.
             * @param type {DOMLoadEventType}
             * @param event {Event}
             */
            async function _notifyListeners(type, event) {
                if (_listeners[type]) {
                    for (const listener of _listeners[type]) {
                        await listener(event);
                    }
                }
            }

            /**
             * Handler for the DOMContentLoaded event, triggering "ready" listeners.
             * @param {Event} event - The DOMContentLoaded event object.
            */
            function _DOMContentLoadedEvent(event) {
                state = "interactive";
                _notifyListeners("ready", event);
            }

            /**
             * Handler for the load event, triggering "complete" listeners.
             * @param {Event} event - The load event object.
             */
            function _loadEvent(event) {
                state = "complete";
                _notifyListeners("complete", event);
            }

            /**
             * Handler for the beforeunload event, triggering "beforeExit" listeners.
             * @param {Event} event - The beforeunload event object.
             */
            function _beforeUnloadEvent(event) {
                _notifyListeners("beforeExit", event);
            }

            /**
             * Handler for the unload event, triggering "exit" listeners.
             * @param {Event} event - The unload event object.
             */
            function _unloadEvent(event) {
                _notifyListeners("exit", event);
            }

            function startListen() {
                if (_isListen) return;

                document.addEventListener("DOMContentLoaded", _DOMContentLoadedEvent);
                window.addEventListener("load", _loadEvent);
                window.addEventListener("beforeunload", _beforeUnloadEvent);
                window.addEventListener("unload", _unloadEvent);

                Logger.debug("DOMLoadEventHandler: Listeners [started]");

                _isListen = true;
            }

            function stopListen() {
                if (!_isListen) return;

                document.removeEventListener("DOMContentLoaded", _DOMContentLoadedEvent);
                window.removeEventListener("load", _loadEvent);
                window.removeEventListener("beforeunload", _beforeUnloadEvent);
                window.removeEventListener("unload", _unloadEvent);

                Logger.debug("DOMLoadEventHandler: Listeners [stopped]");

                _isListen = false;
            }

            return {
                startListen,
                stopListen,

                state: state,
                on: on,
                off: off,
            };
        })();

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
         * Singleton module
         * @type {ObserverEventHandler}
         */
        const ObserverEventHandler = (() => {
            const _observableClasses = [
                constants.SECTION_CLASS_NAME,
                constants.SLIDER_WRAPPER_CLASS_NAME,
                constants.SINGLE_SLIDE_CLASS_NAME,
            ];

            /** @type {MutationObserver|null} */
            let _observer = null;

            /** @type {{ [key: string]: Array<(event: ObserverEventObject) => void | Promise<void>>}} */
            const _listeners = {
                added: [],
                removed: [],
                changed: [],
            };

            /**
             * Add a listener for a specific event type
             * @type {typeof ObserverEventHandler.on}
             */
            function on(type, callback) {
                if (_listeners[type]) {
                    _listeners[type].push(callback);

                    Logger.debug(`ObserverEventHandler: event listener "${type}" [added]`, [{ callback: callback, total: _listeners[type].length }]);
                } else {
                    never(`ObserverEventHandler: unsupported event type: "${type}" (supported types list [${Object.keys(_listeners).join(", ")}])`);
                }
            }

            /**
             * Remove a listener for a specific event type
             * @type {typeof ObserverEventHandler.off}
             */
            function off(type, callback) {
                if (_listeners[type]) {
                    _listeners[type] = _listeners[type].filter(fn => fn !== callback);

                    Logger.debug(`ObserverEventHandler: event listener "${type}" [removed]`, [{ callback: callback, total: _listeners[type].length }]);
                }
            }

            /** Executes all registered listeners for a specified event type.
             * @param type {ObserverEventType}
             * @param event {ObserverEventObject}
             */
            async function _notifyListeners(type, event) {
                if (_listeners[type]) {
                    for (const listener of _listeners[type]) {
                        await listener(event);
                    }
                }
            }

            /**
             * @param node {Node}
             * @returns {Element | null}
             */
            function _elementNodeOrNull(node) {
                if (node.nodeType === node.ELEMENT_NODE) {
                    return /** @type {Element} */(node);
                }

                return null;
            }

            /**
             * @param elem {Element}
             * @returns {ObserverEventObject}
             */
            function _genEventObject(elem) {
                if (utils.isSection(elem)) {
                    return { targetType: "section", element: elem };
                } else if (utils.isSlider(elem)) {
                    return { targetType: "slider", element: elem };
                } else if (utils.isSlide(elem)) {
                    return { targetType: "slide", element: elem };
                }

                return { targetType: "other", element: elem };
            }

            /**
             * @param elem {Element}
             * @returns {boolean}
             */
            function _isElementObservable(elem) {
                return _observableClasses.some(className => elem.classList.contains(className));
            }

            /** @param mutation {MutationRecord} */
            function _handleChildListMutation(mutation) {
                mutation.addedNodes.forEach((node) => {
                    const elem = _elementNodeOrNull(node);
                    if (elem !== null && _isElementObservable(elem)) {
                        _notifyListeners("added", _genEventObject(elem));
                    }
                });

                mutation.removedNodes.forEach((node) => {
                    const elem = _elementNodeOrNull(node);
                    if (elem !== null && _isElementObservable(elem)) {
                        _notifyListeners("removed", _genEventObject(elem));
                    }
                });
            }

            /** @param mutation {MutationRecord} */
            function _handleAttributesMutation(mutation) {
                const elem = _elementNodeOrNull(mutation.target);
                if (elem !== null && _isElementObservable(elem)) {
                    if (mutation.attributeName === "class") {
                        _notifyListeners("changed", _genEventObject(elem));
                    }
                }
            }

            /** @throws {NeverError} - If not root element is founded */
            function startListen() {
                if (_observer !== null) return;

                _observer = new MutationObserver((mutationsList) => {
                    mutationsList.forEach(mutation => {
                        if (mutation.type === "childList") {
                            _handleChildListMutation(mutation);
                        } else if (mutation.type === "attributes") {
                            _handleAttributesMutation(mutation);
                        }
                    });
                });

                const root = utils.getRootNodeOrThrow();
                _observer.observe(root, {
                    childList: true,            // Watch for added/removed nodes
                    attributes: true,           // Watch for changes to attributes
                    subtree: true,              // Watch all child nodes
                    attributeFilter: ["class"], // Filter for changes to the "class" attribute
                });

                Logger.debug("ObserverEventHandler: Listeners [started]");
            }

            function stopListen() {
                if (_observer === null) return;

                _observer.disconnect();
                Logger.debug("ObserverEventHandler: Listeners [stopped]");
            }

            return {
                startListen,
                stopListen,

                on: on,
                off: off,
            };
        })();

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
         * Global
         * @type {OnePage}
         */
        const Onepage = (() => {
            /** @type {SectionList}*/
            let sections;

            /** @type {{ [key: string]: Array<() => void | Promise<void>>}} */
            const _listeners = {};

            /**
             * Add a listener for a specific event type
             * @param type {OnePageEventType}
             * @param callback {() => void | Promise<void>}
             */
            function on(type, callback) {
                if (_listeners[type]) {
                    _listeners[type].push(callback);

                    Logger.debug(`OnePageEventHandler: event listener '${type}' [added]`);
                } else {
                    never(`OnePageEventHandler: unsupported event type: '${type}' (supported types list [${Object.keys(_listeners).join(', ')}])`);
                }
            }

            /**
             * Remove a listener for a specific event type
             * @param type {OnePageEventType}
             * @param  callback {() => void | Promise<void>}
             */
            function off(type, callback) {
                if (_listeners[type]) {
                    _listeners[type] = _listeners[type].filter(fn => fn !== callback);

                    Logger.debug(`OnePageEventHandler: event listener '${type}' [removed]`);
                }
            }

            /**
             * @throws {NeverError}
             * @returns {NodeListOf<Element>}
             */
            function _getSectionNodesOrThrow() {
                const root = utils.getRootNodeOrThrow();

                const sections = root.querySelectorAll("." + settings.constants.SECTION_CLASS_NAME);
                return sections;
            }

            // TODO: Improve observable stuff
            function _attachObserver() {
                ObserverEventHandler.on("removed", event => {
                    if (event.targetType !== "slider") return;

                    sections.forEach(section => {
                        const slider = section.sliderList.find(slider => slider.elemRef === event.element);
                        if (slider) {
                            section.sliderList.remove(event.element);
                        }
                    });
                });

                ObserverEventHandler.on("added", event => {
                    if (event.targetType !== "slider") return;

                    const parentSection = utils.sectionParentOrNull(event.element);
                    sections.forEach(section => {
                        if (section.elemRef !== parentSection) return;

                        let insertPos = 0;
                        if (section.sliderList.length >= 1) {
                            insertPos = section.sliderList.findIndex(slider => {
                                return (utils.isElementBeforeOrAfter(event.element, slider.elemRef) === "after");
                            });
                        }

                        if (insertPos !== -1) {
                            section.sliderList.insert(insertPos, event.element);
                            utils.addClassName(event.element, classes.sliderWrapper);
                        }
                    });
                });

                ObserverEventHandler.startListen();
            }

            (function _init() {
                DOMLoadEventHandler.startListen();
                DOMLoadEventHandler.on("ready", async () => {
                    createHeadStyles();
                    injectStylesOrThrow();

                    if (settings.observer.enabled) {
                        _attachObserver();
                    }

                    const nodes = _getSectionNodesOrThrow();
                    if (!(nodes instanceof Error)) {
                        sections = SectionList(nodes);
                        scroll.init(sections);

                        Logger.info(`OnePage: has been initialized correctly`);
                    }

                });
            }());

            return {
                setOptions: setOptions,

                on: on,
                off: off
            };
        })();

        return Onepage;

})();
