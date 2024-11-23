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


import { never } from "../assert.js";
import constants from "../constans.js";
import Logger from "../logger.js";
import utils from "../utils.js";


/**
 * Singleton module
 * @type {ObserverEventHandler}
 */
const ObserverEventHandler = (() => {
    const _observableClasses = [
        constants.SECTION_CLASS_NAME,
        constants.SLIDER_WRAPPER_CLASS_NAME,
        constants.SINGLE_SLIDE_CLASS_NAME,
    ]

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

    function _cleanInternalListeners() {
        Object.keys(_listeners).forEach(key => _listeners[key] = []);
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

    function _makeCleanup() {
        _cleanInternalListeners();
        _observer = null;
    }

    function stopListen() {
        if (_observer === null) return;

        _observer.disconnect();
        _makeCleanup();

        Logger.debug("ObserverEventHandler: Listeners [stopped]");
    }

    return {
        startListen,
        stopListen,

        on: on,
        off: off,
    };
})();

export default ObserverEventHandler;
