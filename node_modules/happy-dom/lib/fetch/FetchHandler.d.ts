import IRequestInit from './IRequestInit';
import IDocument from '../nodes/document/IDocument';
import IResponse from './IResponse';
/**
 * Helper class for performing fetch.
 */
export default class FetchHandler {
    /**
     * Returns resource data asynchonously.
     *
     * @param document Document.
     * @param url URL to resource.
     * @param [init] Init.
     * @returns Response.
     */
    static fetch(document: IDocument, url: string, init?: IRequestInit): Promise<IResponse>;
}
