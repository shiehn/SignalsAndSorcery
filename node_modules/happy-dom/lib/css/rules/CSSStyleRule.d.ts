import CSSRule from '../CSSRule';
import CSSStyleDeclaration from '../CSSStyleDeclaration';
/**
 * CSSRule interface.
 */
export default class CSSStyleRule extends CSSRule {
    readonly type: number;
    readonly style: CSSStyleDeclaration;
    readonly selectorText = "";
    readonly styleMap: Map<any, any>;
    /**
     * Returns css text.
     *
     * @returns CSS text.
     */
    get cssText(): string;
}
