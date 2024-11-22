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
import settings from "./settings.js";
import utils from "./utils.js";


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
export function css(strings, ...values) {
    let result = strings.reduce((accum, str, i) => {
        let value = values[i] ? values[i] : '';
        return accum + str + value;
    }, '');

    // Remove new lines and white space
    let fmtResult = utils.inlineString(result, 1);

    const match = utils.extractClassName(fmtResult);
    const className = match ? match[0] : utils.generateRandomString();

    if (match) {
        _cssAcummulator += fmtResult;
    } else {
        _cssAcummulator += `.${className} {${fmtResult}}`;
    }

    return className;
}

export function createHeadStyles() {
    const fmtCss = utils.addPrefixToClassNames(_cssAcummulator, constants.CLASS_NAME_PREFIX);

    const cssTemplate = `<style> ${fmtCss}</style>`;
    document.head.insertAdjacentHTML("beforeend", cssTemplate);
}

/**
 * @param sections {SectionList}
 *
 * @throws {NeverError} - Throws an error if root element doesn't exist.
 */
export function injectStylesOrThrow() {
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

export const classes = (() => {
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
            position: fixed;
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            border-radius: 0.3rem;
            right: 1rem;
            top: 50%;
            z-index: 2;
            list-style: none;

            margin: 0;
            padding: 0.3rem;

            li {
                padding: 0;
                text-align: center;
            }

            li > a {
                display: flex;
                width: 1rem;
                height: 1rem;
            }

            li > a:before {
                content: '';
                position: absolute;
                background: rgba(0, 0, 0, 0.69);
                border-radius: 1rem;
                width: 1rem;
                height: 1rem;
            }

            li > a.active:before {
                background: rgba(0, 0, 0, 0.9);
                width: 1.2rem;
                height: 1.2rem;
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
