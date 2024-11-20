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


import { expect, test, describe, afterEach, beforeEach, mock } from "bun:test";
import ObserverEventHandler from "../../../src/events/observerEventHandler";
import constants from "../../../src/constans";


describe("ObserverEventHandler", () => {
    const mockCallback = mock();

    beforeEach(() => {
        document.body.id = "#" + constants.ROOT_ID_NAME;
    });

    afterEach(() => {
        mockCallback.mockReset();
        ObserverEventHandler.stopListen();

        document.body.innerHTML = "";
    });

    test("should add and remove a listener", () => {
        ObserverEventHandler.on("added", mockCallback);
        ObserverEventHandler.off("added", mockCallback);

        ObserverEventHandler.startListen();

        const newElement = document.createElement("div");
        newElement.classList.add("section-class-name");
        document.body.appendChild(newElement);

        expect(mockCallback).not.toHaveBeenCalled();
    });

    test("should not notify unsupported event types", () => {
        const unsupportedEvent = () => ObserverEventHandler.on(/** @type {*} */("unsupported"), mockCallback);

        expect(unsupportedEvent).toThrow();
    });

    test("should not start observers twice", () => {
        ObserverEventHandler.startListen();
        ObserverEventHandler.startListen();

        expect(() => ObserverEventHandler.startListen()).not.toThrow();
    });

    test("should stop observing mutations", () => {
        ObserverEventHandler.on("added", mockCallback);

        ObserverEventHandler.startListen();
        ObserverEventHandler.stopListen();

        const newElement = document.createElement("div");
        newElement.classList.add("section-class-name");
        document.body.appendChild(newElement);

        expect(mockCallback).not.toHaveBeenCalled();
    });
});
