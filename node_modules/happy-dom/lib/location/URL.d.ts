/**
 *
 */
export default class URL {
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    username: string;
    password: string;
    /**
     * Constructor.
     *
     * @param [url] URL.
     */
    constructor(url?: string);
    /**
     * Returns the entire URL as a string.
     *
     * @returns Href.
     */
    get href(): string;
    /**
     * Sets the href.
     *
     * @param url URL.
     */
    set href(url: string);
    /**
     * Returns the origin.
     *
     * @returns HREF.
     */
    get origin(): string;
    /**
     * Returns the entire URL as a string.
     *
     * @returns Host.
     */
    get host(): string;
    /**
     * Returns the entire URL as a string.
     */
    toString(): string;
    /**
     * Parses an URL.
     *
     * @param url URL.
     */
    protected parse(url: string): void;
}
