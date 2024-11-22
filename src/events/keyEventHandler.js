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
import Logger from "../logger.js";
import settings from "../settings.js";


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
        keyup: [],
    };

    let _lastKey = "";

    // special variable only to hold axis related stuff
    let _axisKey = "";

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
            })
        } else if (direction === "horizontal") {
            const offsetLeft = element.scrollLeft;
            element.scroll({
                left: (getAxis(direction) * speed) + offsetLeft,
                behavior: behavior
            })
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

    function _cleanInternalListeners() {
        Object.keys(_listeners).forEach(key => _listeners[key] = []);
    }

    /**
     * @param event {KeyboardEvent}
     * @returns {Promise<void>}
     */
    async function _keydownEventHandler(event) {
        _lastKey = event.key;
        _axisKey = event.key;

        _notifyListeners("keydown", event);
    }

    /**
     * @param event {KeyboardEvent}
     * @returns {Promise<void>}
     */
    async function _keyupEventHandler(event) {
        if (event.key === _axisKey) {
            _axisKey = "";
        }

        _notifyListeners("keyup", event);
    }

    /** @type {typeof KeyEventHandler.getAxis } */
    function getAxis(direction = "vertical") {
        if (direction === "vertical") {
            if (settings.keybindings.up.includes(_axisKey)) return -1;
            if (settings.keybindings.down.includes(_axisKey)) return 1;
        } else if (direction === "horizontal") {
            if (settings.keybindings.right.includes(_axisKey)) return 1;
            if (settings.keybindings.left.includes(_axisKey)) return -1;
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
            window.addEventListener("keydown", _keyupEventHandler, false);

            Logger.debug("KeyEventHandler: key event listeners [started]");
        }

        _isListen = true;
    }

    function stopListen() {
        if (!_isListen) return;

        if (window?.KeyboardEvent && settings.scroll.keyboardScroll) {
            window.removeEventListener("keydown", _keydownEventHandler, false);
            window.removeEventListener("keyup", _keyupEventHandler, false);

            Logger.debug("KeyEventHandler: key event listeners [stopped]");
        }

        _cleanInternalListeners();
        _lastKey = "";
        _axisKey = "";

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

export default KeyEventHandler;
