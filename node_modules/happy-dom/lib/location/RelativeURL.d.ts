import Location from './Location';
/**
 * Helper class for getting the URL relative to a Location object.
 */
export default class RelativeURL {
    /**
     * Returns a URL relative to the given Location object.
     *
     * @param location Location.
     * @param url URL.
     */
    static getAbsoluteURL(location: Location, url: string): string;
}
