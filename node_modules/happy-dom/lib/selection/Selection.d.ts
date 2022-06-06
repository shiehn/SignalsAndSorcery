import INode from '../nodes/node/INode';
/**
 * Selection.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Selection.
 */
export default class Selection {
    readonly anchorNode: INode;
    readonly anchorOffset: number;
    readonly baseNode: INode;
    readonly baseOffset: number;
    readonly extentNode: INode;
    readonly extentOffset: number;
    readonly focusNode: INode;
    readonly focusOffset: number;
    readonly isCollapsed: boolean;
    readonly rangeCount: number;
    readonly type: string;
    /**
     * Adds a range.
     *
     * @param _range Range.
     */
    addRange(_range: object): void;
    /**
     * Collapses the current selection to a single point.
     *
     * @param _node Node.
     * @param _offset Offset.
     */
    collapse(_node: INode, _offset?: number): void;
    /**
     * Collapses the selection to the end.
     */
    collapseToEnd(): void;
    /**
     * Collapses the selection to the start.
     */
    collapseToStart(): void;
    /**
     * Indicates whether a specified node is part of the selection.
     *
     * @param _node Node.
     * @param _partialContainer Partial container.
     * @returns Always returns "true" for now.
     */
    containsNode(_node: INode, _partialContainer?: INode): boolean;
    /**
     * Deletes the selected text from the document's DOM.
     */
    deleteFromDocument(): void;
    /**
     * Moves the focus of the selection to a specified point.
     *
     * @param _node Node.
     * @param _offset Offset.
     */
    extend(_node: INode, _offset?: number): void;
    /**
     * Moves the focus of the selection to a specified point.
     *
     * @param _index Index.
     */
    getRangeAt(_index: number): object;
    /**
     * Removes a range from a selection.
     *
     * @param _range Range.
     */
    removeRange(_range: object): void;
    /**
     * Removes all ranges.
     */
    removeAllRanges(): void;
    /**
     * Selects all children.
     *
     * @param _parentNode Parent node.
     */
    selectAllChildren(_parentNode: INode): void;
    /**
     * Sets the selection to be a range including all or parts of two specified DOM nodes, and any content located between them.
     *
     * @param _anchorNode Anchor node.
     * @param _anchorOffset Anchor offset.
     * @param _focusNode Focus node.
     * @param _focusOffset Focus offset.
     */
    setBaseAndExtent(_anchorNode: INode, _anchorOffset: number, _focusNode: INode, _focusOffset: number): void;
    /**
     * Returns string currently being represented by the selection object.
     */
    toString(): string;
}
