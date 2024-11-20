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


import utils from "./utils.js";
import scroll from "./scroll.js";
import SectionList from "./objects/sectionList.js";
import Logger from "./logger.js";
import DOMLoadEventHandler from "./events/domLoadEventHandler.js";
import ObserverEventHandler from "./events/observerEventHandler.js";
import settings, { setOptions } from "./settings.js";
import { never } from "./assert.js";
import { classes, createHeadStyles, injectStylesOrThrow } from "./css.js";


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
        DOMLoadEventHandler.on("DOMContentLoaded", async () => {
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

export default Onepage;
