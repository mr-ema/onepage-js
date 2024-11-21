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


import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import SectionList from "../../../src/objects/sectionList";


describe("SectionList", () => {
    /** @type {*} */
    let sections;

    const container = document.createElement("div");
    const createSections = () => {
        container.innerHTML = "";
        const list = new Array();
        for (let idx = 0; idx < 3; idx++) {
            const section = document.createElement("div");
            if (idx === 0) section.classList.add("active");
            container.appendChild(section);
            list.push(section);
        }

        return /** @type Array<Element> */(list);
    };

    beforeEach(() => {
        sections = createSections();
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    test("initializes with the active section", () => {
        const sectionList = SectionList(sections);
        const currentSection = sectionList.getCurrentSection();

        expect(currentSection.elemRef).toBe(sections[0]);
    });

    test("scrolls to the next section", () => {
        const sectionList = SectionList(sections);
        sectionList.scrollNext();

        const currentSection = sectionList.getCurrentSection();
        expect(currentSection.elemRef).toBe(sections[1]);
        expect(currentSection.elemRef.classList.contains("active")).toBeTrue();
    });

    test("scrolls to the previous section", () => {
        const sectionList = SectionList(sections);
        sectionList.scrollPrev();

        const currentSection = sectionList.getCurrentSection();
        expect(currentSection.elemRef).toBe(sections[2]);
        expect(currentSection.elemRef.classList.contains("active")).toBeTrue();
    });

    test("removes a section", () => {
        const sectionList = SectionList(sections);
        const sectionToRemove = sections[1];

        sectionList.remove(sectionToRemove);

        expect(sectionList.length).toBe(2);
        expect(sectionList.findIndex((s) => s.elemRef === sectionToRemove)).toBe(-1);
    });

    test("inserts a new section", () => {
        const sectionList = SectionList(sections);
        const newSection = document.createElement("div");

        sectionList.insert(1, newSection);

        expect(sectionList.length).toBe(4);
        expect(sectionList[1].elemRef).toBe(newSection);
    });

    test("scrolls to a specific section", () => {
        const sectionList = SectionList(sections);
        sectionList.scrollToSection(2);

        const currentSection = sectionList.getCurrentSection();
        expect(currentSection.elemRef).toBe(sections[2]);
        expect(currentSection.elemRef.classList.contains("active")).toBeTrue();
    });
});
