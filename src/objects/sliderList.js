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


import settings from "../settings";
import utils from "../utils";
import Slider from "./slider";


/**
 * @param section {Element}
 * @returns {SliderList}
 */
export default function SliderList(section) {
    /** @type {Array<Slider>} */
    const sliderList = new Array();

    (function _init() {
        const sliders = utils.getSliderListInElement(section);
        const aloneSlides = utils.getSingleSlidesInElementOrNull(section);
        if (aloneSlides !== null) {
            let shouldAdd = (() => {
                for (const idx in aloneSlides) {
                    const slideParent = aloneSlides[idx].parentElement;
                    if (slideParent !== null) {
                        return !utils.isSlider(/** @type {Element} */(slideParent));
                    }
                }

                return true;
            })();

            if (shouldAdd) {
                sliderList.push(Slider(aloneSlides));
            }
        }

        sliders.forEach(slider => {
            const slides = slider.querySelectorAll("." + settings.constants.SINGLE_SLIDE_CLASS_NAME);
            const sliderRef = Slider(slides);

            sliderList.push(sliderRef);
        });
    })();

    /** @param sliderElem {Element} */
    function remove(sliderElem) {
        if (sliderList.length <= 0) return;

        const idx = sliderList.findIndex(slider => slider.elemRef === sliderElem);
        if (idx >= 0) {
            sliderList.splice(idx, 1);
        }
    }

    /**
     * @param pos {number}
     * @param sliderElem {Element}
     */
    function insert(pos, sliderElem) {
        const slides = sliderElem.querySelectorAll("." + settings.constants.SINGLE_SLIDE_CLASS_NAME);
        const sliderRef = Slider(slides);

        sliderList.splice(pos, 0, sliderRef);
    }

    /**
     * @type {ProxyHandler<SliderList>}
     */
    const handler = {
        /**
         * Intercepts property access on the proxy.
         *
         * @param {SliderList} target - The original slider array.
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
                default:
                    return undefined;
            }
        },
    };

    return new Proxy(/** @type {SliderList} */(sliderList), handler);
}
