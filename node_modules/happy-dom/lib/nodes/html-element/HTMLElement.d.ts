import Element from '../element/Element';
import IHTMLElement from './IHTMLElement';
import CSSStyleDeclaration from '../../css/CSSStyleDeclaration';
import Attr from '../../attribute/Attr';
/**
 * HTML Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.
 */
export default class HTMLElement extends Element implements IHTMLElement {
    readonly accessKey = "";
    readonly accessKeyLabel = "";
    readonly contentEditable = "inherit";
    readonly isContentEditable = false;
    readonly offsetHeight = 0;
    readonly offsetWidth = 0;
    readonly offsetLeft = 0;
    readonly offsetTop = 0;
    readonly clientHeight = 0;
    readonly clientWidth = 0;
    private _style;
    private _dataset;
    /**
     * Returns tab index.
     *
     * @returns Tab index.
     */
    get tabIndex(): number;
    /**
     * Returns tab index.
     *
     * @param tabIndex Tab index.
     */
    set tabIndex(tabIndex: number);
    /**
     * Returns inner text, which is the rendered appearance of text.
     *
     * @returns Inner text.
     */
    get innerText(): string;
    /**
     * Sets the inner text, which is the rendered appearance of text.
     *
     * @param innerText Inner text.
     */
    set innerText(innerText: string);
    /**
     * Returns style.
     *
     * @returns Style.
     */
    get style(): CSSStyleDeclaration;
    /**
     * Returns data set.
     *
     * @returns Data set.
     */
    get dataset(): {
        [key: string]: string;
    };
    /**
     * Returns direction.
     *
     * @returns Direction.
     */
    get dir(): string;
    /**
     * Returns direction.
     *
     * @param direction Direction.
     */
    set dir(direction: string);
    /**
     * Returns hidden.
     *
     * @returns Hidden.
     */
    get hidden(): boolean;
    /**
     * Returns hidden.
     *
     * @param hidden Hidden.
     */
    set hidden(hidden: boolean);
    /**
     * Returns language.
     *
     * @returns Language.
     */
    get lang(): string;
    /**
     * Returns language.
     *
     * @param language Language.
     */
    set lang(lang: string);
    /**
     * Returns title.
     *
     * @returns Title.
     */
    get title(): string;
    /**
     * Returns title.
     *
     * @param title Title.
     */
    set title(title: string);
    /**
     * Triggers a click event.
     */
    click(): void;
    /**
     * Triggers a blur event.
     */
    blur(): void;
    /**
     * Triggers a focus event.
     */
    focus(): void;
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
    /**
     * Clones a node.
     *
     * @override
     * @param [deep=false] "true" to clone deep.
     * @returns Cloned node.
     */
    cloneNode(deep?: boolean): IHTMLElement;
}
