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


import { expect, test, describe, afterEach, beforeEach, mock, spyOn } from "bun:test";
import SwipeEventHandler from "../../../src/events/swipeEventHandler";


describe("SwipeEventHandler", () => {
    const mockCallback = mock();

    beforeEach(() => {
        // simulate touch device
        spyOn(window, "matchMedia").mockReturnValue(/** @type {*} */({ matches: true }));
    });

    afterEach(() => {
        mockCallback.mockReset();
        SwipeEventHandler.stopListen();
    });

    test("should add an event listener using 'on' method", () => {
        SwipeEventHandler.on("swipeStart", mockCallback);
        SwipeEventHandler.startListen();

        // Simulate a swipe start event
        const swipeStartEvent = new TouchEvent("touchstart", {
            changedTouches: [/** @type {*} */({ clientX: 100, clientY: 200 })]
        });
        document.dispatchEvent(swipeStartEvent);

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test("should remove an event listener using 'off' method", () => {
        SwipeEventHandler.on("swipeStart", mockCallback);
        SwipeEventHandler.off("swipeStart", mockCallback);

        SwipeEventHandler.startListen();

        // Simulate a swipe start event
        const swipeStartEvent = new TouchEvent("touchstart", {
            changedTouches: [/** @type {*} */({ clientX: 100, clientY: 200 })]
        });
        document.dispatchEvent(swipeStartEvent);

        expect(mockCallback).not.toHaveBeenCalled();
    });

    test("should handle swipeStart event correctly", () => {
        SwipeEventHandler.on("swipeStart", mockCallback);
        SwipeEventHandler.startListen();

        // Simulate a swipe start event
        const swipeStartEvent = new TouchEvent("touchstart", {
            changedTouches: [/** @type {*} */({ clientX: 100, clientY: 200 })]
        });
        document.dispatchEvent(swipeStartEvent);

        expect(mockCallback).toHaveBeenCalledWith(swipeStartEvent);
    });

    test("should handle swipeEnd event correctly", () => {
        SwipeEventHandler.on("swipeEnd", mockCallback);
        SwipeEventHandler.startListen();

        // Simulate a swipe end event
        const swipeEndEvent = new TouchEvent("touchend", {
            changedTouches: [/** @type {*} */({ clientX: 200, clientY: 300 })]
        });
        document.dispatchEvent(swipeEndEvent);

        expect(mockCallback).toHaveBeenCalledWith(swipeEndEvent);
    });

    test("should start listening for swipe events with 'startListen'", () => {
        const mockWindowLoad = spyOn(document, "addEventListener");

        SwipeEventHandler.startListen();

        expect(mockWindowLoad).toHaveBeenCalled();
        expect(mockWindowLoad).toHaveBeenCalledWith("touchstart", expect.any(Function), expect.anything());

        mockWindowLoad.mockClear();
    });

    test("should stop listening for swipe events with 'stopListen'", () => {
        const mockWindowLoad = spyOn(document, "removeEventListener");
        SwipeEventHandler.startListen();

        SwipeEventHandler.stopListen();

        expect(mockWindowLoad).toHaveBeenCalled();
        expect(mockWindowLoad).toHaveBeenCalledWith("touchstart", expect.any(Function), expect.anything());

        mockWindowLoad.mockClear();
    });

    test("should get correct axis for vertical swipe", () => {
        SwipeEventHandler.startListen();

        const swipeStartEvent = new TouchEvent("touchstart", {
            changedTouches: [/** @type {*} */({ clientX: 100, clientY: 100 })]
        });
        document.dispatchEvent(swipeStartEvent);

        const swipeMoveEvent = new TouchEvent("touchmove", {
            changedTouches: [/** @type {*} */({ clientX: 100, clientY: 200 })]
        });
        document.dispatchEvent(swipeMoveEvent);

        expect(SwipeEventHandler.getAxis("vertical")).toBe(-1);
    });

    test("should get correct axis for horizontal swipe", () => {
        SwipeEventHandler.startListen();

        const swipeStartEvent = new TouchEvent("touchstart", {
            changedTouches: [/** @type {*} */({ clientX: 100, clientY: 100 })]
        });
        document.dispatchEvent(swipeStartEvent);

        const swipeMoveEvent = new TouchEvent("touchmove", {
            changedTouches: [/** @type {*} */({ clientX: 200, clientY: 100 })]
        });
        document.dispatchEvent(swipeMoveEvent);

        expect(SwipeEventHandler.getAxis("horizontal")).toBe(-1);
    });

    test("should not trigger axis when no swipe event occurred", () => {
        SwipeEventHandler.startListen();

        expect(SwipeEventHandler.getAxis("vertical")).toBe(0);
        expect(SwipeEventHandler.getAxis("horizontal")).toBe(0);
    });

    test("should check if swipe event is available", () => {
        expect(SwipeEventHandler.isEventAvailable()).toBe(true);
    });

    test("should not trigger swipe events if no swipe event type is supported", () => {
        const originalTouchEvent = window.TouchEvent;
        const originalPointerEvent = window.PointerEvent;

        // Simulate isEventAvailable returning false (e.g., no TouchEvent or PointerEvent)
        Object.defineProperty(window, "TouchEvent", { value: undefined });
        Object.defineProperty(window, "PointerEvent", { value: undefined });

        expect(SwipeEventHandler.isEventAvailable()).toBe(false);

        // Restore events
        Object.defineProperty(window, "TouchEvent", { value: originalTouchEvent });
        Object.defineProperty(window, "PointerEvent", { value: originalPointerEvent });
    });

    test("should not trigger swipe events if swipe has no movement", () => {
        SwipeEventHandler.on("swipeStart", mockCallback);
        SwipeEventHandler.startListen();

        // Simulate swipe with no movement
        const swipeStartEvent = new TouchEvent("touchstart", {
            changedTouches: [/** @type {*} */({ clientX: 100, clientY: 100 })]
        });
        document.dispatchEvent(swipeStartEvent);

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

});
