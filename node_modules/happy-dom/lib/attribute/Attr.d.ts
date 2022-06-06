import IDocument from '../nodes/document/IDocument';
import IElement from '../nodes/element/IElement';
/**
 * Attribute node interface.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Attr.
 */
export default class Attr {
    value: string;
    name: string;
    namespaceURI: string;
    /**
     * @deprecated
     */
    readonly ownerElement: IElement;
    /**
     * @deprecated
     */
    readonly ownerDocument: IDocument;
    /**
     * @deprecated
     */
    readonly specified = true;
    /**
     * Returns local name.
     *
     * @returns Local name.
     */
    get localName(): string;
    /**
     * Returns prefix.
     *
     * @returns Prefix.
     */
    get prefix(): string;
}
