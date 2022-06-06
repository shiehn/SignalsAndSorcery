import Node from '../node/Node';
import HTMLElement from '../html-element/HTMLElement';
import IDocumentFragment from '../document-fragment/IDocumentFragment';
import INode from '../node/INode';
import IHTMLTemplateElement from './IHTMLTemplateElement';
/**
 * HTML Template Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement.
 */
export default class HTMLTemplateElement extends HTMLElement implements IHTMLTemplateElement {
    private _contentElement;
    /**
     * Returns the content.
     *
     * @returns Content.
     */
    get content(): IDocumentFragment;
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
     */
    removeChild(node: Node): INode;
    /**
     * Inserts a node before another.
     *
     * @param newNode Node to insert.
     * @param referenceNode Node to insert before.
     * @returns Inserted node.
     */
    insertBefore(newNode: INode, referenceNode: INode): INode;
    /**
     * Replaces a node with another.
     *
     * @param newChild New child.
     * @param oldChild Old child.
     * @returns Replaced node.
     */
    replaceChild(newChild: INode, oldChild: INode): INode;
    /**
     * Clones a node.
     *
     * @override
     * @param [deep=false] "true" to clone deep.
     * @returns Cloned node.
     */
    cloneNode(deep?: boolean): IHTMLTemplateElement;
}
