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


import { classes } from "../css.js";
import settings from "../settings.js";
import utils from "../utils.js";


/**
 * @param slideList {NodeListOf<Element>}
 * @param {Object} [options]
 * @param {number} [options.initialIndex=0] - The starting index of the slide to display in the list.
 * @returns {Slider}
 */
export default function Slider(slideList, options = {}) {
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
