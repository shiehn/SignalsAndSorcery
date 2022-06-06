import Document from '../nodes/document/Document';
/**
 * DOM parser.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMParser.
 */
export default class DOMParser {
    static _ownerDocument: Document;
    /**
     * Parses HTML and returns a root element.
     *
     * @param string HTML data.
     * @param mimeType Mime type.
     * @returns Root element.
     */
    parseFromString(string: string, mimeType: string): Document;
    /**
     *
     * @param mimeType Mime type.
     * @returns Document.
     */
    private _createDocument;
}
