import EventTarget from '../event/EventTarget';
import Event from '../event/Event';
/**
 * Media Query List.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList.
 */
export default class MediaQueryList extends EventTarget {
    _matches: boolean;
    _media: string;
    onchange: (event: Event) => void;
    /**
     * Returns "true" if the document matches.
     *
     * @returns Matches.
     */
    get matches(): boolean;
    /**
     * Returns the serialized media query.
     *
     * @returns Serialized media query.
     */
    get media(): string;
    /**
     * Adds a listener.
     *
     * @deprecated
     * @param callback Callback.
     */
    addListener(callback: (event: Event) => void): void;
    /**
     * Removes listener.
     *
     * @deprecated
     * @param callback Callback.
     */
    removeListener(callback: (event: Event) => void): void;
}
