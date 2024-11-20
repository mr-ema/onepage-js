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
import DOMLoadEventHandler from "../../../src/events/domLoadEventHandler";


describe("DOMLoadEventHandler", () => {
    const mockCallback = mock();

    afterEach(() => {
        mockCallback.mockReset();
        DOMLoadEventHandler.stopListen();
    });

    test("should add a listener and execute it on DOMContentLoaded", () => {
        DOMLoadEventHandler.on("DOMContentLoaded", mockCallback);

        // Simulate starting listeners and triggering the DOMContentLoaded event
        DOMLoadEventHandler.startListen();
        document.dispatchEvent(new Event("DOMContentLoaded"));

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test("should add a listener and execute it on window load", () => {
        DOMLoadEventHandler.on("load", mockCallback);

        DOMLoadEventHandler.startListen();
        window.dispatchEvent(new Event("load"));

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test("should add and remove a listener", () => {
        DOMLoadEventHandler.on("DOMContentLoaded", mockCallback);

        // Remove the listener
        DOMLoadEventHandler.off("DOMContentLoaded", mockCallback);

        DOMLoadEventHandler.startListen();
        document.dispatchEvent(new Event("DOMContentLoaded"));

        expect(mockCallback).not.toHaveBeenCalled();
    });

    test("should execute beforeExit listeners on beforeunload event", () => {
        DOMLoadEventHandler.on("beforeUnload", mockCallback);

        DOMLoadEventHandler.startListen();
        window.dispatchEvent(new Event("beforeunload"));

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test("should execute exit listeners on unload event", () => {
        DOMLoadEventHandler.on("unload", mockCallback);

        DOMLoadEventHandler.startListen();
        window.dispatchEvent(new Event("unload"));

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test("should not start listeners twice", () => {
        const mockDOMContentLoaded = spyOn(document, "addEventListener");
        const mockWindowLoad = spyOn(window, "addEventListener");

        DOMLoadEventHandler.startListen();
        DOMLoadEventHandler.startListen();

        expect(mockDOMContentLoaded).toHaveBeenCalled();
        expect(mockWindowLoad).toHaveBeenCalled();

        mockDOMContentLoaded.mockClear();
        mockWindowLoad.mockClear();
    });

    test("should not trigger unsupported event type", () => {
        const unsupportedEvent = () => DOMLoadEventHandler.on(/** @type {*} */("unsupported"), () => { });
        expect(unsupportedEvent).toThrow();
    });

    test("should stop listening to events", () => {
        DOMLoadEventHandler.on("DOMContentLoaded", mockCallback);

        DOMLoadEventHandler.startListen();
        DOMLoadEventHandler.stopListen();

        const event = new Event("DOMContentLoaded");
        document.dispatchEvent(event);

        expect(mockCallback).not.toHaveBeenCalled();
    });
});
