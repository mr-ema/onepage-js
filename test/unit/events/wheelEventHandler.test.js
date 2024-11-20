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


import { expect, test, describe, afterEach, mock } from "bun:test";
import WheelEventHandler from "../../../src/events/wheelEventHandler";


describe("WheelEventHandler", () => {
    const mockCallback = mock();

    afterEach(() => {
        mockCallback.mockReset();
        WheelEventHandler.stopListen();
    });

    test("should add and trigger a wheel event listener", () => {
        WheelEventHandler.on("wheel", mockCallback);
        WheelEventHandler.startListen();

        // Simulate a wheel event (scrolling vertically)
        const wheelEvent = new WheelEvent("wheel", { deltaY: 100 });
        document.dispatchEvent(wheelEvent);

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test("should trigger vertical axis as 1 for downward scroll", () => {
        WheelEventHandler.startListen();

        const wheelEvent = new WheelEvent("wheel", { deltaY: 100, deltaX: 0 });
        document.dispatchEvent(wheelEvent);

        expect(WheelEventHandler.getAxis("vertical")).toBe(1);
    });

    test("should trigger vertical axis as -1 for upward scroll", () => {
        WheelEventHandler.startListen();

        const wheelEvent = new WheelEvent("wheel", { deltaY: -100, deltaX: 0 });
        document.dispatchEvent(wheelEvent);

        expect(WheelEventHandler.getAxis("vertical")).toBe(-1);
    });

    test("should trigger horizontal axis as 1 for right scroll", () => {
        WheelEventHandler.startListen();

        const wheelEvent = new WheelEvent("wheel", { deltaX: 100, deltaY: 0 });
        document.dispatchEvent(wheelEvent);

        expect(WheelEventHandler.getAxis("horizontal")).toBe(1);
    });

    test("should trigger horizontal axis as -1 for left scroll", () => {
        WheelEventHandler.startListen();

        const wheelEvent = new WheelEvent("wheel", { deltaX: -100, deltaY: 0 });
        document.dispatchEvent(wheelEvent);

        expect(WheelEventHandler.getAxis("horizontal")).toBe(-1);
    });

    test("should not trigger axis when no scroll event occurred", () => {
        WheelEventHandler.startListen();

        expect(WheelEventHandler.getAxis("vertical")).toBe(0);
        expect(WheelEventHandler.getAxis("horizontal")).toBe(0);
    });

    test("should stop listening for wheel events", () => {
        WheelEventHandler.on("wheel", mockCallback);
        WheelEventHandler.startListen();

        // Simulate a wheel event (scrolling vertically)
        const wheelEvent = new WheelEvent("wheel", { deltaY: 100 });
        document.dispatchEvent(wheelEvent);

        // Stop listening
        WheelEventHandler.stopListen();

        // Dispatch another wheel event, this should not trigger the callback
        document.dispatchEvent(wheelEvent);
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test("should return false for isEventAvailable if WheelEvent is not supported", () => {
        const originalWheelEvent = window.WheelEvent;

        // Temporarily modify window to simulate an environment without WheelEvent
        Object.defineProperty(window, "WheelEvent", { value: undefined });
        expect(WheelEventHandler.isEventAvailable()).toBe(false);

        // Restore Event
        Object.defineProperty(window, "WheelEvent", { value: originalWheelEvent });
    });

    test("should return true for isEventAvailable if WheelEvent is supported", () => {
        expect(WheelEventHandler.isEventAvailable()).toBe(true);
    });
});
