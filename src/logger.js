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

import settings from "./settings";


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

export default Logger;
