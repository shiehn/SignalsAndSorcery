import CSSStyleDeclaration from '../../css/CSSStyleDeclaration';
import Element from '../element/Element';
import ISVGElement from './ISVGElement';
import ISVGSVGElement from './ISVGSVGElement';
import Attr from '../../attribute/Attr';
/**
 * SVG Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/SVGElement.
 */
export default class SVGElement extends Element implements ISVGElement {
    private _style;
    /**
     * Returns viewport.
     *
     * @returns SVG rect.
     */
    get viewportElement(): ISVGElement;
    /**
     * Returns current translate.
     *
     * @returns Element.
     */
    get ownerSVGElement(): ISVGSVGElement;
    /**
     * Returns data set.
     *
     * @returns Data set.
     */
    get dataset(): {
        [key: string]: string;
    };
    /**
     * Returns style.
     *
     * @returns Style.
     */
    get style(): CSSStyleDeclaration;
    /**
     * The setAttributeNode() method adds a new Attr node to the specified element.
     *
     * @override
     * @param attribute Attribute.
     * @returns Replaced attribute.
     */
    setAttributeNode(attribute: Attr): Attr;
    /**
     * Removes an Attr node.
     *
     * @override
     * @param attribute Attribute.
     */
    removeAttributeNode(attribute: Attr): void;
}
