import CSSRule from '../CSSRule';
import MediaList from '../MediaList';
/**
 * CSSRule interface.
 */
export default class CSSMediaRule extends CSSRule {
    readonly type: number;
    readonly cssRules: CSSRule[];
    readonly media: MediaList;
    /**
     * Returns css text.
     *
     * @returns CSS text.
     */
    get cssText(): string;
    /**
     * Returns conditional text.
     *
     * @returns Conditional text.
     */
    get conditionalText(): string;
}
