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


import { expect, test, describe, beforeEach, afterEach, spyOn } from "bun:test";
import Slider from "../../../src/objects/slider";
import utils from "../../../src/utils";
import constants from "../../../src/constans";


describe("Slider", () => {
    /** @type {*} */
    let slides;

    let isSliderSpy = spyOn(utils, "isSlider");
    let wrapChildrenInTagSpy = spyOn(utils, "wrapChildrenInTag");

    const container = document.createElement("div");
    const createSlides = () => {
        container.innerHTML = "";
        container.classList.add(constants.SLIDER_WRAPPER_CLASS_NAME);
        for (let idx = 0; idx < 3; idx++) {
            const slide = document.createElement("div");
            slide.classList.add(constants.SINGLE_SLIDE_CLASS_NAME);
            container.appendChild(slide);
        }

        return container.childNodes;
    };

    beforeEach(() => {
        document.body.appendChild(container);
        slides = createSlides();
    });

    afterEach(() => {
        document.body.innerHTML = "";

        isSliderSpy.mockRestore();
        wrapChildrenInTagSpy.mockRestore();
    });

    test("initializes with slides", () => {
        const slider = Slider(slides);

        expect(slider.elemRef).toBeDefined();
        expect(slider.slideList.length).toBe(3);
        expect(slider.slideList[0]).toBe(slides.item(0));
    });

    test("scrolls to the next slide", () => {
        const slider = Slider(slides);

        // TODO: Test later after adding getCurrentSlide
        slider.next();
    });

    test("scrolls to the previous slide", () => {
        const slider = Slider(slides);

        // TODO: Test later after adding getCurrentSlide
        slider.prev();
    });

    test("goes to a specific slide", () => {
        const slider = Slider(slides);

        // TODO: Test later after adding getCurrentSlide
        slider.goToSlide(2);
    });

    test("does not scroll to invalid slide index", () => {
        const slider = Slider(slides);

        expect(() => slider.goToSlide(10)).not.toThrow();
        expect(() => slider.goToSlide(-1)).not.toThrow();
    });

    test("removes a slide", () => {
        const slider = Slider(slides);
        const slideToRemove = slides.item(1);

        slider.remove(slideToRemove);

        expect(slider.slideList.length).toBe(2);
        expect(slider.slideList.includes(slideToRemove)).toBe(false);
    });

    test("inserts a slide at a specific position", () => {
        const slider = Slider(slides);
        const newSlide = document.createElement("div");
        newSlide.textContent = "New Slide";

        slider.insert(1, newSlide);

        expect(slider.slideList.length).toBe(4);
        expect(slider.slideList[1]).toBe(newSlide);
    });

    test("wraps slides in a container if not already wrapped", () => {
        isSliderSpy.mockImplementation(() => false);

        const slider = Slider(slides);

        expect(slider.elemRef.classList.contains(constants.SLIDER_WRAPPER_CLASS_NAME)).toBeTrue();
    });

    test("does not re-wrap slides if already wrapped", () => {
        isSliderSpy.mockImplementation(() => true);
        const slider = Slider(slides);

        expect(wrapChildrenInTagSpy).not.toHaveBeenCalled();
        expect(slider.elemRef).toBe(slides.item(0).parentElement);
    });
});
