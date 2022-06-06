import Node from '../node/Node';
import DocumentFragment from '../document-fragment/DocumentFragment';
import DOMRect from './DOMRect';
/**
 * Range object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Range
 */
export default class Range {
    private _startContainer;
    private _endContainer;
    private _startOffset;
    private _endOffset;
    private _collapsed;
    /**
     * Returns collapsed.
     *
     * @returns "true" if collapsed.
     */
    get collapsed(): boolean;
    /**
     * Returns common ancestor container.
     *
     * @returns Node.
     */
    get commonAncestorContainer(): Node;
    /**
     * Returns end container.
     *
     * @returns Node.
     */
    get endContainer(): Node;
    /**
     * Returns start container.
     *
     * @returns Node.
     */
    get startContainer(): Node;
    /**
     * Returns end offset.
     *
     * @returns Offset.
     */
    get endOffset(): number;
    /**
     * Returns start offset.
     *
     * @returns Offset.
     */
    get startOffset(): number;
    /**
     * Sets start.
     *
     * @param startNode Start node.
     * @param startOffset Start offset.
     */
    setStart(startNode: Node, startOffset: number): void;
    /**
     * Sets end.
     *
     * @param endNode End node.
     * @param endOffset End offset.
     */
    setEnd(endNode: Node, endOffset: number): void;
    /**
     * Sets start before.
     */
    setStartBefore(): void;
    /**
     * Sets start after.
     */
    setStartAfter(): void;
    /**
     * Sets end before.
     */
    setEndBefore(): void;
    /**
     * Sets end after.
     */
    setEndAfter(): void;
    /**
     * Selects a node.
     */
    selectNode(): void;
    /**
     * Selects node content.
     */
    selectNodeContents(): void;
    /**
     * Collapses the Range to one of its boundary points.
     */
    collapse(): void;
    /**
     * Removes the contents of a Range from the Document.
     */
    deleteContents(): void;
    /**
     * Moves contents of a Range from the document tree into a DocumentFragment.
     */
    extractContents(): DocumentFragment;
    /**
     * Insert a Node at the start of a Range.
     */
    insertNode(): void;
    /**
     * Moves content of a Range into a new Node.
     */
    surroundContents(): void;
    /**
     * Compares the boundary points of the Range with another Range.
     *
     * @returns "true" when equal.
     */
    compareBoundaryPoints(): boolean;
    /**
     * Clones the range.
     *
     * @returns Range.
     */
    cloneRange(): Range;
    /**
     * Releases the Range from use to improve performance.
     */
    detach(): void;
    /**
     * Returns the text of the Range.
     *
     * @returns Text.
     */
    toString(): string;
    /**
     * Returns -1, 0, or 1 indicating whether the point occurs before, inside, or after the Range.
     *
     * @returns Number.
     */
    comparePoint(): number;
    /**
     * Returns a DocumentFragment created from a given string of code.
     *
     * @returns Document fragment.
     */
    createContextualFragment(): DocumentFragment;
    /**
     * Returns a DOMRect object which bounds the entire contents of the Range; this would be the union of all the rectangles returned by range.getClientRects().
     *
     * @returns DOM rect.
     */
    getBoundingClientRect(): DOMRect;
    /**
     * Returns a list of DOMRect objects that aggregates the results of Element.getClientRects() for all the elements in the Range.
     *
     * @returns DOM rect.
     */
    getClientRects(): DOMRect;
    /**
     * Returns a boolean indicating whether the given node intersects the Range.
     *
     * @returns "true" when intersecting.
     */
    intersectsNode(): boolean;
    /**
     * Returns a boolean indicating whether the given point is in the Range.
     *
     * @returns "true" when in range.
     */
    isPointInRange(): boolean;
}
