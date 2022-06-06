import MimeTypeArray from './MimeTypeArray';
import PluginArray from './PluginArray';
/**
 * Browser Navigator API.
 *
 * Mocked information is taken from FireFox.
 *
 * Reference:
 * https://html.spec.whatwg.org/multipage/system-state.html#dom-navigator.
 */
export default class Navigator {
    readonly cookieEnabled: boolean;
    readonly credentials: string;
    readonly geolocation: string;
    readonly language: string;
    readonly languages: string[];
    readonly locks: string;
    readonly maxTouchPoints: number;
    readonly hardwareConcurrency: number;
    readonly appCodeName: string;
    readonly appName: string;
    readonly appVersion: string;
    readonly platform: string;
    readonly product: string;
    readonly productSub: string;
    readonly vendor: string;
    readonly vendorSub: string;
    readonly userAgent: string;
    readonly onLine: boolean;
    readonly permissions: string;
    readonly webdriver: boolean;
    readonly doNotTrack: string;
    readonly mimeTypes: MimeTypeArray;
    readonly plugins: PluginArray;
    /**
     * Returns the object as a string.
     *
     * @returns String.
     */
    toString(): string;
}
