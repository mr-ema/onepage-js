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


import settings from "../settings.js";
import utils from "../utils.js";
import Section from "./section.js";


/**
 * @param sections {NodeListOf<Element>}
 * @returns {SectionList}
 */
export default function SectionList(sections) {
    /** @type {Array<Section>} */
    const sectionList = new Array(sections.length);

    let _currentIndex = 0;

    (function _init() {
        sections.forEach((section, idx) => {
            if (section.classList.contains("active")) {
                _currentIndex = idx;
            }

            const sectionRef = Section(section);

            sectionList[idx] = sectionRef;
        });

        utils.addClassName(sectionList[_currentIndex].elemRef, "active");
        scrollToSection(_currentIndex);
    })();

    function scrollNext() {
        const nextIdx = (_currentIndex + 1 + sectionList.length) % sectionList.length;
        _scrollIntoView(nextIdx, sectionList);

        _currentIndex = nextIdx;
    }

    function scrollPrev() {
        const prevIdx = (_currentIndex - 1 + sectionList.length) % sectionList.length;
        _scrollIntoView(prevIdx, sectionList);

        _currentIndex = prevIdx;
    }

    /** @param index {number} */
    function scrollToSection(index) {
        if (index < 0 || index >= sectionList.length) return;

        _scrollIntoView(index, sectionList);
        _currentIndex = index;
    }

    /** @param sectionElem {Element} */
    function remove(sectionElem) {
        if (sectionList.length <= 0) return;

        const idx = sectionList.findIndex(section => section.elemRef === sectionElem);
        if (idx >= 0) {
            sectionList.splice(idx, 1);
        }
    }

    /**
     * @param pos {number}
     * @param sectionElem {Element}
     */
    function insert(pos, sectionElem) {
        const sectionRef = Section(sectionElem);

        sectionList.splice(pos, 0, sectionRef);
    }

    function getCurrentSection() {
        return sectionList[_currentIndex];
    }

    /**
     * @param sectionList {Array<Section>}
     * @param index {number}
     * @returns {void}
     */
    function _scrollIntoView(index, sectionList) {
        if (index < 0 || index >= sectionList.length) return;

        sectionList[index].elemRef.scrollIntoView({
            behavior: settings.scroll.behavior || "smooth",
            block: "start",
        });

        utils.removeClassName(sectionList[_currentIndex].elemRef, "active");
        utils.addClassName(sectionList[index].elemRef, "active");
    }

    /**
     * @type {ProxyHandler<SectionList>}
     */
    const handler = {
        /**
         * Intercepts property access on the proxy.
         *
         * @param {SectionList} target - The original slider array.
         * @param {string | symbol} prop - The property being accessed.
         */
        get(target, prop) {
            if (prop in target) {
                return target[/** @type {keyof Array<Slider>}*/(prop)];
            }

            switch (prop) {
                case "insert":
                    return insert;
                case "remove":
                    return remove;
                case "scrollNext":
                    return scrollNext;
                case "scrollPrev":
                    return scrollPrev;
                case "scrollToSection":
                    return scrollToSection;
                case "getCurrentSection":
                    return getCurrentSection;
                default:
                    return undefined;
            }
        },
    };

    return new Proxy(/** @type {SectionList} */(sectionList), handler);
}
