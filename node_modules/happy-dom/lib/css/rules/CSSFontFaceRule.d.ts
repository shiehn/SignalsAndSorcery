import CSSRule from '../CSSRule';
import CSSStyleDeclaration from '../CSSStyleDeclaration';
/**
 * CSSRule interface.
 */
export default class CSSFontFaceRule extends CSSRule {
    readonly type: number;
    readonly style: CSSStyleDeclaration;
}
