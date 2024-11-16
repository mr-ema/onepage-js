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
import SliderList from "./sliderList.js";


/**
 * @param section {Element}
 * @returns {Section}
 */
export default function Section(section) {
    const elemRef = section;
    const sliderList = SliderList(section);

    (function _addClasses() {
        utils.addClassName(section, classes.section)

        // create a separated function
        if (settings.scroll.overflowScroll) {
            const wrapper = utils.wrapAllChildrenOf(section);
            utils.addClassName(wrapper, classes.overflow)
        }
    })();

    return {
        elemRef: elemRef,
        sliderList: sliderList,
    };
};
