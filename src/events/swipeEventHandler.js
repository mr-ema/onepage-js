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
import settings from "../settings.js";
import { isTouchDevice } from "../utils.js";


/**
 * Singleton module
 * @type {SwipeEventHandler}
 */
const SwipeEventHandler = (() => {
    let _isListen = false;

    let _startPos = /** @type {Vector2} */  { x: 0, y: 0 };
    let _endPos = /** @type {Vector2} */  { x: 0, y: 0 };

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

    function _cleanInternalListeners() {
        Object.keys(_listeners).forEach(key => _listeners[key] = []);
    }

    /**
     * @param event {SwipeEvent}
     * @returns {Promise<void>}
     */
    async function _handleSwipeStart(event) {
        if (window?.TouchEvent && event instanceof TouchEvent) {
            _startPos.x = event.changedTouches[0].clientX;
            _startPos.y = event.changedTouches[0].clientY;
        } else if (window?.PointerEvent && event instanceof PointerEvent) {
            const button = /** @type {MouseButton} */ (event.button);
            if (!(constants.MOUSE_SWIPE_DISCARDED_BUTTONS.includes(button))) {
                _startPos.x = event.clientX;
                _startPos.y = event.clientY;
            };

            Logger.debug("SwipeEventHandler: pressed mouse button code on 'swipeStart': ", [button]);
        }

        _notifyListeners("swipeStart", event);
    }

    /**
     * @param event {SwipeEvent}
     * @returns {Promise<void>}
     */
    async function _handleSwipeMove(event) {
        _endPos.x = 0;
        _endPos.y = 0;

        if (window?.TouchEvent && event instanceof TouchEvent) {
            _endPos.x = event.changedTouches[0].clientX;
            _endPos.y = event.changedTouches[0].clientY;
        } else if (window?.PointerEvent && event instanceof PointerEvent) {
            const button = /** @type {MouseButton} */ (event.button);
            if (!(constants.MOUSE_SWIPE_DISCARDED_BUTTONS.includes(button))) {
                _endPos.x = event.clientX;
                _endPos.y = event.clientY;
            }

            Logger.debug("SwipeEventHandler: pressed mouse button code on 'swipeMove': ", [button]);
        }
    }

    /**
     * @param event {SwipeEvent}
     * @returns {Promise<void>}
     */
    async function _handleSwipeEnd(event) {
        if (window?.TouchEvent && event instanceof TouchEvent) {
            _endPos.x = event.changedTouches[0].clientX;
            _endPos.y = event.changedTouches[0].clientY;
        } else if (window?.PointerEvent && event instanceof PointerEvent) {
            const button = /** @type {MouseButton} */ (event.button);
            if (!(constants.MOUSE_SWIPE_DISCARDED_BUTTONS.includes(button))) {
                if (event.clientX !== 0 || event.clientY !== 0) {
                    _endPos.x = event.clientX;
                    _endPos.y = event.clientY;
                }
            }

            Logger.debug("SwipeEventHandler: pressed mouse button code on 'swipeEnd': ", [button]);
        }

        _notifyListeners("swipeEnd", event);
    }

    /** @type {typeof SwipeEventHandler.getAxis} */
    function getAxis(direction = "vertical") {
        const diffX = _endPos.x - _startPos.x;
        const diffY = _endPos.y - _startPos.y;

        if (diffX === 0 && diffY === 0) return 0;

        _startPos.x = 0;
        _startPos.y = 0;
        _endPos.x = 0;
        _endPos.y = 0;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) >= constants.TOUCH_THRESHOLD && direction === "horizontal") {
                return (diffX >= 0 ? -1 : 1);
            }
        } else {
            if (Math.abs(diffY) >= constants.TOUCH_THRESHOLD && direction === "vertical") {
                return (diffY >= 0 ? -1 : 1);
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

        // Add pointer event listeners for non-touch devices if swipe scroll is enabled
        if ((window?.PointerEvent && settings.scroll.swipeScroll) && !isTouchDevice()) {
            document.addEventListener("pointerdown", _handleSwipeStart, false);
            document.addEventListener("pointermove", _handleSwipeMove, false);
            document.addEventListener("pointerup", _handleSwipeEnd, false);
            document.addEventListener("pointercancel", _handleSwipeEnd, false);

            Logger.debug("SwipeEventHandler: pointer event listeners [started]");
        }

        // Add touch event listeners for touch-enabled devices
        if (window?.TouchEvent && isTouchDevice()) {
            document.addEventListener("touchstart", _handleSwipeStart, false);
            document.addEventListener("touchend", _handleSwipeEnd, false);
            document.addEventListener("touchmove", _handleSwipeMove, false);
            document.addEventListener("touchcancel", _handleSwipeEnd, false);

            Logger.debug("SwipeEventHandler: touch event listeners [started]");
        }

        _isListen = true;
    }

    function stopListen() {
        if (!_isListen) return;

        // Remove pointer event listeners for non-touch devices if swipe scroll is enabled
        if ((window?.PointerEvent && settings.scroll.swipeScroll) && typeof window?.TouchEvent === "undefined") {
            document.removeEventListener("pointerdown", _handleSwipeStart, false);
            document.removeEventListener("pointermove", _handleSwipeMove, false);
            document.removeEventListener("pointerup", _handleSwipeEnd, false);
            document.removeEventListener("pointercancel", _handleSwipeEnd, false);

            Logger.debug("SwipeEventHandler: pointer event listeners [stoped]");
        }

        // Remove touch event listeners for touch-enabled devices
        if (window?.TouchEvent) {
            document.removeEventListener("touchstart", _handleSwipeStart, false);
            document.removeEventListener("touchend", _handleSwipeEnd, false);
            document.removeEventListener("touchmove", _handleSwipeMove, false);
            document.removeEventListener("touchcancel", _handleSwipeEnd, false);

            Logger.debug("SwipeEventHandler: touch event listeners [stopped]");
        }

        _cleanInternalListeners();
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

export default SwipeEventHandler;
