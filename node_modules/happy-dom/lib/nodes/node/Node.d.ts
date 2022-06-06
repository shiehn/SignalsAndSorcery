import EventTarget from '../../event/EventTarget';
import MutationObserverListener from '../../mutation-observer/MutationListener';
import Event from '../../event/Event';
import INode from './INode';
import IDocument from '../document/IDocument';
import IElement from '../element/IElement';
import INodeList from './INodeList';
/**
 * Node.
 */
export default class Node extends EventTarget implements INode {
    static readonly ELEMENT_NODE = 1;
    static readonly TEXT_NODE = 3;
    static readonly COMMENT_NODE = 8;
    static readonly DOCUMENT_NODE = 9;
    static readonly DOCUMENT_TYPE_NODE = 10;
    static readonly DOCUMENT_FRAGMENT_NODE = 11;
    static ownerDocument: IDocument;
    readonly ELEMENT_NODE = 1;
    readonly TEXT_NODE = 3;
    readonly COMMENT_NODE = 8;
    readonly DOCUMENT_NODE = 9;
    readonly DOCUMENT_TYPE_NODE = 10;
    readonly DOCUMENT_FRAGMENT_NODE = 11;
    readonly ownerDocument: IDocument;
    readonly parentNode: INode;
    readonly nodeType: number;
    readonly childNodes: INodeList<INode>;
    readonly isConnected: boolean;
    _rootNode: INode;
    protected _observers: MutationObserverListener[];
    /**
     * Constructor.
     */
    constructor();
    /**
     * Get text value of children.
     *
     * @returns Text content.
     */
    get textContent(): string;
    /**
     * Sets text content.
     *
     * @param textContent Text content.
     */
    set textContent(_textContent: string);
    /**
     * Node value.
     *
     * @returns Node value.
     */
    get nodeValue(): string;
    /**
     * Sets node value.
     */
    set nodeValue(_nodeValue: string);
    /**
     * Node name.
     *
     * @returns Node name.
     */
    get nodeName(): string;
    /**
     * Previous sibling.
     *
     * @returns Node.
     */
    get previousSibling(): INode;
    /**
     * Next sibling.
     *
     * @returns Node.
     */
    get nextSibling(): INode;
    /**
     * First child.
     *
     * @returns Node.
     */
    get firstChild(): INode;
    /**
     * Last child.
     *
     * @returns Node.
     */
    get lastChild(): INode;
    /**
     * Returns parent element.
     *
     * @returns Element.
     */
    get parentElement(): IElement;
    /**
     * Returns base URI.
     *
     * @returns Base URI.
     */
    get baseURI(): string;
    /**
     * Connected callback.
     */
    connectedCallback?(): void;
    /**
     * Disconnected callback.
     */
    disconnectedCallback?(): void;
    /**
     * Returns "true" if the node has child nodes.
     *
     * @returns "true" if the node has child nodes.
     */
    hasChildNodes(): boolean;
    /**
     * Returns "true" if this node contains the other node.
     *
     * @param otherNode Node to test with.
     * @returns "true" if this node contains the other node.
     */
    contains(otherNode: INode): boolean;
    /**
     * Returns closest root node (Document or ShadowRoot).
     *
     * @param options Options.
     * @param options.composed A Boolean that indicates whether the shadow root should be returned (false, the default), or a root node beyond shadow root (true).
     * @returns Node.
     */
    getRootNode(options?: {
        composed: boolean;
    }): INode;
    /**
     * Clones a node.
     *
     * @param [deep=false] "true" to clone deep.
     * @returns Cloned node.
     */
    cloneNode(deep?: boolean): INode;
    /**
     * Append a child node to childNodes.
     *
     * @param  node Node to append.
     * @returns Appended node.
     */
    appendChild(node: INode): INode;
    /**
     * Remove Child element from childNodes array.
     *
     * @param node Node to remove.
     * @returns Removed node.
     */
    removeChild(node: INode): INode;
    /**
     * Inserts a node before another.
     *
     * @param newNode Node to insert.
     * @param [referenceNode] Node to insert before.
     * @returns Inserted node.
     */
    insertBefore(newNode: INode, referenceNode: INode | null): INode;
    /**
     * Replaces a node with another.
     *
     * @param newChild New child.
     * @param oldChild Old child.
     * @returns Replaced node.
     */
    replaceChild(newChild: INode, oldChild: INode): INode;
    /**
     * @override
     */
    dispatchEvent(event: Event): boolean;
    /**
     * Converts the node to a string.
     *
     * @param listener Listener.
     */
    toString(): string;
    /**
     * Observeres the node.
     * Used by MutationObserver, but it is not part of the HTML standard.
     *
     * @param listener Listener.
     */
    _observe(listener: MutationObserverListener): void;
    /**
     * Stops observing the node.
     * Used by MutationObserver, but it is not part of the HTML standard.
     *
     * @param listener Listener.
     */
    _unobserve(listener: MutationObserverListener): void;
    /**
     * Connects this element to another element.
     *
     * @param parentNode Parent node.
     */
    _connectToNode(parentNode?: INode): void;
}
