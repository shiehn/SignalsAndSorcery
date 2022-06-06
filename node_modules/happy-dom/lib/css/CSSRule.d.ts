import CSSStyleSheet from './CSSStyleSheet';
/**
 * CSSRule interface.
 */
export default class CSSRule {
    static STYLE_RULE: number;
    static IMPORT_RULE: number;
    static MEDIA_RULE: number;
    static FONT_FACE_RULE: number;
    static PAGE_RULE: number;
    static KEYFRAMES_RULE: number;
    static KEYFRAME_RULE: number;
    static NAMESPACE_RULE: number;
    static COUNTER_STYLE_RULE: number;
    static SUPPORTS_RULE: number;
    static DOCUMENT_RULE: number;
    static FONT_FEATURE_VALUES_RULE: number;
    static REGION_STYLE_RULE: number;
    parentRule: CSSRule;
    parentStyleSheet: CSSStyleSheet;
    type: number;
    /**
     * Returns selector text.
     *
     * @returns Selector text.
     */
    get cssText(): string;
}
