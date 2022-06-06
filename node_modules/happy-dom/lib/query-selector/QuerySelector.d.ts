import IElement from '../nodes/element/IElement';
import INode from '../nodes/node/INode';
import INodeList from '../nodes/node/INodeList';
/**
 * Utility for query selection in an HTML element.
 *
 * @class QuerySelector
 */
export default class QuerySelector {
    /**
     * Finds elements based on a query selector.
     *
     * @param node Node to search in.
     * @param selector Selector.
     * @returns HTML elements.
     */
    static querySelectorAll(node: INode, selector: string): INodeList<IElement>;
    /**
     * Finds an element based on a query selector.
     *
     * @param node Node to search in.
     * @param selector Selector.
     * @returns HTML element.
     */
    static querySelector(node: INode, selector: string): IElement;
    /**
     * Finds elements based on a query selector for a part of a list of selectors separated with comma.
     *
     * @param rootNode Root node.
     * @param nodes Nodes.
     * @param selectorParts Selector parts.
     * @param [selectorItem] Selector item.
     * @returns HTML elements.
     */
    private static findAll;
    /**
     * Finds an element based on a query selector for a part of a list of selectors separated with comma.
     *
     * @param rootNode
     * @param nodes Nodes.
     * @param selector Selector.
     * @param selectorParts
     * @param [selectorItem] Selector item.
     * @returns HTML element.
     */
    private static findFirst;
    /**
     * Splits a selector string into groups and parts.
     *
     * @param selector Selector.
     * @returns HTML element.
     */
    private static getSelectorParts;
}
