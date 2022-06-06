import IDocument from '../nodes/document/IDocument';
/**
 * Helper class for performing fetch of resources.
 */
export default class ResourceFetchHandler {
    /**
     * Returns resource data asynchonously.
     *
     * @param document Document.
     * @param url URL.
     * @returns Response.
     */
    static fetch(document: IDocument, url: string): Promise<string>;
    /**
     * Returns resource data synchonously.
     *
     * @param document Document.
     * @param url URL.
     * @returns Response.
     */
    static fetchSync(document: IDocument, url: string): string;
}
