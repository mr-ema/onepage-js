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


import { expect, test, describe, afterEach, mock, spyOn } from "bun:test";
import KeyEventHandler from "../../../src/events/keyEventHandler";


describe("KeyEventHandler", () => {
    const mockCallback = mock();

    afterEach(() => {
        mockCallback.mockReset();
        KeyEventHandler.stopListen();
    });

    test("should add an event listener using 'on' method", () => {
        KeyEventHandler.on("keydown", mockCallback);
        KeyEventHandler.startListen();

        // Simulate a keydown event
        const keyEvent = new KeyboardEvent("keydown", { key: "ArrowUp" });
        window.dispatchEvent(keyEvent);

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test("should remove an event listener using 'off' method", () => {
        KeyEventHandler.on("keydown", mockCallback);
        KeyEventHandler.off("keydown", mockCallback);

        KeyEventHandler.startListen();

        // Simulate a keydown event
        const keyEvent = new KeyboardEvent("keydown", { key: "ArrowUp" });
        window.dispatchEvent(keyEvent);

        expect(mockCallback).not.toHaveBeenCalled();
    });

    test("should perform vertical scrolling with keys", () => {
        KeyEventHandler.startListen();

        const mockElement = document.createElement("div");
        Object.defineProperty(mockElement, "scrollHeight", { value: 1000 });
        Object.defineProperty(mockElement, "scrollWidth", { value: 1000 });
        Object.defineProperty(mockElement, "scrollTop", { value: 100 });
        Object.defineProperty(mockElement, "scrollLeft", { value: 100 });
        Object.defineProperty(mockElement, "scroll", { value: mock() });

        // Simulate a vertical scroll
        const keyEvent = new KeyboardEvent("keydown", { key: "ArrowUp" });
        window.dispatchEvent(keyEvent);

        KeyEventHandler.scrollWithKeys(mockElement, "vertical");

        expect(mockElement.scroll).toHaveBeenCalled();
    });

    test("should perform horizontal scrolling with keys", () => {
        KeyEventHandler.startListen();

        const mockElement = document.createElement("div");
        Object.defineProperty(mockElement, "scrollHeight", { value: 1000 });
        Object.defineProperty(mockElement, "scrollWidth", { value: 1000 });
        Object.defineProperty(mockElement, "scrollTop", { value: 100 });
        Object.defineProperty(mockElement, "scrollLeft", { value: 100 });
        Object.defineProperty(mockElement, "scroll", { value: mock() });

        // Simulate a horizontal scroll
        const keyEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
        window.dispatchEvent(keyEvent);

        KeyEventHandler.scrollWithKeys(mockElement, "horizontal");

        expect(mockElement.scroll).toHaveBeenCalled();
    });

    test("should start listening for keydown events with 'startListen'", () => {
        const mockWindowLoad = spyOn(window, "addEventListener");

        KeyEventHandler.startListen();
        expect(mockWindowLoad).toHaveBeenCalled();
        expect(mockWindowLoad).toHaveBeenCalledWith("keydown", expect.any(Function), expect.anything());

        mockWindowLoad.mockClear();
    });

    test("should stop listening for keydown events with 'stopListen'", () => {
        const mockWindowLoad = spyOn(window, "removeEventListener");
        KeyEventHandler.startListen();

        KeyEventHandler.stopListen();
        expect(mockWindowLoad).toHaveBeenCalled();
        expect(mockWindowLoad).toHaveBeenCalledWith("keydown", expect.any(Function), expect.anything());

        mockWindowLoad.mockClear();
    });

    test("should get correct axis for vertical scroll", () => {
        KeyEventHandler.startListen();

        const upKeyEvent = new KeyboardEvent("keydown", { key: "ArrowUp" });
        window.dispatchEvent(upKeyEvent);
        expect(KeyEventHandler.getAxis("vertical")).toBe(-1);

        const downKeyEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
        window.dispatchEvent(downKeyEvent);
        expect(KeyEventHandler.getAxis("vertical")).toBe(1);
    });

    test("should get correct axis for horizontal scroll", () => {
        KeyEventHandler.startListen();

        const leftKeyEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
        window.dispatchEvent(leftKeyEvent);
        expect(KeyEventHandler.getAxis("horizontal")).toBe(-1);

        const rightKeyEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
        window.dispatchEvent(rightKeyEvent);
        expect(KeyEventHandler.getAxis("horizontal")).toBe(1);
    });

    test("should not trigger axis when no scroll event occurred", () => {
        KeyEventHandler.startListen();

        expect(KeyEventHandler.getAxis("vertical")).toBe(0);
        expect(KeyEventHandler.getAxis("horizontal")).toBe(0);
    });

    test("should not scroll if element has no scroll height or width", () => {
        KeyEventHandler.startListen();

        const mockElement = document.createElement("div");
        Object.defineProperty(mockElement, "scrollHeight", { value: 0 });
        Object.defineProperty(mockElement, "scrollWidth", { value: 0 });
        Object.defineProperty(mockElement, "scrollTop", { value: 0 });
        Object.defineProperty(mockElement, "scrollLeft", { value: 0 });
        Object.defineProperty(mockElement, "scroll", { value: mock() });

        KeyEventHandler.scrollWithKeys(mockElement, "vertical");

        expect(mockElement.scroll).not.toHaveBeenCalled();
    });

    test("should check if keyboard event is available", () => {
        expect(KeyEventHandler.isEventAvailable()).toBe(true);
    });
});
