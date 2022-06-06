import Location from '../location/Location';
/**
 * Cookie utility.
 */
export default class CookieUtility {
    /**
     * Returns a cookie string.
     *
     * @param location Location.
     * @param cookies Current cookie string.
     * @param newCookie New cookie string.
     * @returns Generated cookie string.
     */
    static getCookieString(location: Location, cookies: string, newCookie: any): string;
}
