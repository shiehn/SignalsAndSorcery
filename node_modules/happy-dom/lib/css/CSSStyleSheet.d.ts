import CSSRule from './CSSRule';
import MediaList from './MediaList';
/**
 * Attr node interface.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet.
 */
export default class CSSStyleSheet {
    value: string;
    name: string;
    namespaceURI: string;
    readonly cssRules: CSSRule[];
    media: MediaList | string;
    title: string;
    alternate: boolean;
    disabled: boolean;
    /**
     * Constructor.
     *
     * Constructable Stylesheets is a new feature that only Blink supports:
     * https://wicg.github.io/construct-stylesheets/.
     *
     * @param [options] Options.
     * @param [options.media] Media.
     * @param [options.title] Title.
     * @param [options.alternate] Alternate.
     * @param [options.disabled] Disabled.
     */
    constructor(options?: {
        media?: MediaList | string;
        title?: string;
        alternate?: boolean;
        disabled?: boolean;
    });
    /**
     * Inserts a rule.
     *
     * Constructable Stylesheets is a new feature that only Blink supports:
     * https://wicg.github.io/construct-stylesheets/.
     *
     * @param rule Rule.
     * @param [index] Index.
     * @returns The newly inserterted rule's index.
     */
    insertRule(rule: string, index?: number): number;
    /**
     * Removes a rule.
     *
     * Constructable Stylesheets is a new feature that only Blink supports:
     * https://wicg.github.io/construct-stylesheets/.
     *
     * @param index Index.
     */
    deleteRule(index: number): void;
    /**
     * Replaces all CSS rules.
     *
     * Constructable Stylesheets is a new feature that only Blink supports:
     * https://wicg.github.io/construct-stylesheets/.
     *
     * @param text CSS text.
     * @returns Promise.
     */
    replace(text: string): Promise<void>;
    /**
     * Replaces all CSS rules.
     *
     * Constructable Stylesheets is a new feature that only Blink supports:
     * https://wicg.github.io/construct-stylesheets/.
     *
     * @param text CSS text.
     */
    replaceSync(text: string): void;
}
