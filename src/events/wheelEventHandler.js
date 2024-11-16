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

export default WheelEventHandler;
