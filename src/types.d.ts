import type settings from "./settings";

export { };

declare global {
    type ScrollEvent = WheelEvent | KeyboardEvent | TouchEvent | PointerEvent;
    type SwipeEvent = PointerEvent | TouchEvent;
    type Direction = "vertical" | "horizontal";
    type Axis = 0 | 1 | -1;
    type Vector2 = { x: number, y: number };
    // type JSEnviroment = "vanilla" | "svelte" | "react" | "vue";

    /**
     * 0: Main button pressed, usually the left button or the un-initialized state
     * 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
     * 2: Secondary button pressed, usually the right button
     * 3: Fourth button, typically the Browser Back button
     * 4: Fifth button, typically the Browser Forward button
     */
    type MouseButton = 0 | 1 | 2 | 3 | 4;

    type OnePageEventType = "destroy";
    type OnePage = {
        setOptions(options: typeof settings): void;

        on(type: OnePageEventType, callback: () => void | Promise<void>): void;
        off(type: OnePageEventType, callback: () => void | Promise<void>): void;
    };

    type LogLevel = Values<{
        DEBUG: 1;
        INFO: 2;
        WARN: 4;
        ERROR: 8;

        ALL: number
    }>;

    interface Logger {
        error: (message: string, ...data: any[][]) => void;
        warn: (message: string, ...data: any[][]) => void;
        info: (message: string, ...data: any[][]) => void;
        debug: (message: string, ...data: any[][]) => void;
        setLevel: (level: LogLevel) => void;
    };

    /* ----------------- Event Handlers ----------------- */
    type ObserverEventType = "added" | "removed" | "changed";
    type ObserverEventObject = {
        targetType: "section" | "slider" | "slide" | "other";
        element: Element;
    };
    interface ObserverEventHandler {
        startListen(): void;
        stopListen(): void;

        on(type: ObserverEventType, callback: (event: ObserverEventObject) => void | Promise<void>): void;
        off(type: ObserverEventType, callback: (event: ObserverEventObject) => void | Promise<void>): void;
    };

    type DOMLoadEventType = "DOMContentLoaded" | "load" | "beforeUnload" | "unload";
    interface DOMLoadEventHandler {
        startListen(): void;
        stopListen(): void;

        on(type: DOMLoadEventType, callback: (event: Event) => void | Promise<void>): void;
        off(type: DOMLoadEventType, callback: (event: Event) => void | Promise<void>): void;
    };

    interface ScrollEventHandlerInterface {
        startListen(): void;
        stopListen(): void;

        getAxis(direction: Direction): Axis;
        isEventAvailable(): boolean;
    };

    type SwipeEventType = "swipeStart" | "swipeEnd";
    type SwipeEventHandler = ScrollEventHandlerInterface & {
        on(type: SwipeEventType, callback: (event: SwipeEvent) => void | Promise<void>): void;
        off(type: SwipeEventType, callback: (event: SwipeEvent) => void | Promise<void>): void;
    };

    type KeyEventType = "keydown" | "keyup";
    type KeyEventHandler = ScrollEventHandlerInterface & {
        on(type: KeyEventType, callback: (event: KeyboardEvent) => void | Promise<void>): void;
        off(type: KeyEventType, callback: (event: KeyboardEvent) => void | Promise<void>): void;

        scrollWithKeys(element: Element, direction: Direction): void;
    };

    type WheelEventType = "wheel";
    type WheelEventHandler = ScrollEventHandlerInterface & {
        on(type: WheelEventType, callback: (event: WheelEvent) => void | Promise<void>): void;
        off(type: WheelEventType, callback: (event: WheelEvent) => void | Promise<void>): void;
    };

    /* ----------------- Objects ----------------- */
    type SectionList = Array<Section> & {
        insert(pos: number, sectionElem: Element): void;
        remove(sectionElem: Element): void;

        scrollNext(): void;
        scrollPrev(): void;
        scrollToSection(index: number): void;

        getCurrentSection(): Section;
    };

    type Section = {
        elemRef: Element;
        sliderList: SliderList;
    };

    type SliderList = Array<Slider> & {
        insert(pos: number, sliderElem: Element): void;
        remove(sliderElem: Element): void;
    };


    type Slider = {
        elemRef: Element;

        slideList: Array<Element>;

        insert(pos: number, slideElem: Element): void;
        remove(slideElem: Element): void;

        next(): void;
        prev(): void;
        goToSlide(index: number): void;
    };
}
