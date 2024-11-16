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


const constants = {
        CLASS_NAME_PREFIX: "op",
        SECTION_CLASS_NAME: "section",
        ROOT_ID_NAME: "onepage",
        SLIDER_WRAPPER_CLASS_NAME: "slider-ctn",
        SINGLE_SLIDE_CLASS_NAME: "slide",
        TOUCH_THRESHOLD: 30, // Minimum distance in pixels to consider it a swipe

        /**
         * Specifies the mouse buttons to ignore during swipe interactions.
         * This list is used to discard specific buttons when swiping with a mouse,
         * allowing the swipe action to proceed only when other buttons are used.
         *
         * Possible values for mouse buttons:
         * 0: Main button pressed, usually the left button or the un-initialized state.
         * 1: Auxiliary button pressed, usually the wheel button or the middle button (if present).
         * 2: Secondary button pressed, usually the right button.
         * 3: Fourth button, typically the Browser Back button.
         * 4: Fifth button, typically the Browser Forward button.
         *
         * @type {Array<MouseButton>}
         */
        MOUSE_SWIPE_DISCARDED_BUTTONS: [2],
};

export default constants;
