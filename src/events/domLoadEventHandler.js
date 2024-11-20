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
 * @type {DOMLoadEventHandler}
 */
const DOMLoadEventHandler = (() => {
    let _isListen = false;

    /**
     * @type {{ [key: string]: Array<(event: Event) => void | Promise<void>>}}
     */
    const _listeners = {
        DOMContentLoaded: [],
        load: [],
        beforeUnload: [],
        unload: [],
    };

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
        _notifyListeners("DOMContentLoaded", event);
    }

    /**
     * Handler for the load event, triggering "complete" listeners.
     * @param {Event} event - The load event object.
     */
    function _loadEvent(event) {
        _notifyListeners("load", event);
    }

    /**
     * Handler for the beforeunload event, triggering "beforeExit" listeners.
     * @param {Event} event - The beforeunload event object.
     */
    function _beforeUnloadEvent(event) {
        _notifyListeners("beforeUnload", event);
    }

    /**
     * Handler for the unload event, triggering "exit" listeners.
     * @param {Event} event - The unload event object.
     */
    function _unloadEvent(event) {
        _notifyListeners("unload", event);
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

        on: on,
        off: off,
    };
})();

export default DOMLoadEventHandler;
