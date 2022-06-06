import CSSRule from '../CSSRule';
import CSSStyleDeclaration from '../CSSStyleDeclaration';
/**
 * CSSRule interface.
 */
export default class CSSKeyframeRule extends CSSRule {
    readonly type: number;
    readonly style: CSSStyleDeclaration;
    readonly keyText: string;
    /**
     * Returns css text.
     *
     * @returns CSS text.
     */
    get cssText(): string;
}
