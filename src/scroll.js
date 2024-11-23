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


import settings from "./settings.js";
import utils from "./utils.js";
import { classes } from "./css.js";

import WheelEventHandler from "./events/wheelEventHandler.js";
import SwipeEventHandler from "./events/swipeEventHandler.js";
import KeyEventHandler from "./events/keyEventHandler.js";


const scroll = (() => {
    /** @type {Timer} */
    let _scrollTimer;
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
                        // TODO: Make it work well on chrome like browsers
                        const scrollable = section.elemRef.querySelector("." + classes.overflow);
                        if (scrollable !== null) {
                            KeyEventHandler.scrollWithKeys(scrollable, "vertical");
                            event.preventDefault()
                        }
                    } else {
                        _handleScroll(event, sections)
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
        }

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

        const axis = _getEventAxis(event, "horizontal");
        if (axis > 0) {
            slider.next();
        } else if (axis < 0) {
            slider.prev();
        }
    }

    function _lockScroll() {
        _isScrolling = true;
        if (_scrollTimer) {
            clearTimeout(_scrollTimer);
        }

        // Unlock scrolling after specified timeout
        _scrollTimer = setTimeout(() => {
            _isScrolling = false;
        }, settings.scroll.unlockTimeout);
    }


    /**
     * @param event {ScrollEvent | SwipeEvent}
     * @param sections {SectionList}
     * @returns {void}
     */
    function _handleScroll(event, sections) {
        if (_isScrolling) return;

        _lockScroll();
        const currentSection = sections.getCurrentSection();
        if (currentSection.sliderList.length >= 1) {
            _handleSlider(event, currentSection.sliderList[0]);
        }

        const axis = _getEventAxis(event, "vertical");
        if (axis > 0) {
            if (!_hasOverflowScroll(currentSection, 1)) {
                sections.scrollNext();
            }
        } else if (axis < 0) {
            if (!_hasOverflowScroll(currentSection, -1)) {
                sections.scrollPrev();
            }
        }
    }

    return {
        init
    };
})();

export default scroll;
