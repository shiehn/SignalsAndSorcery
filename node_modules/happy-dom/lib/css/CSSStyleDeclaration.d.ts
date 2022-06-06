import Attr from '../attribute/Attr';
import CSSRule from './CSSRule';
/**
 * CSS Style Declaration.
 */
export default class CSSStyleDeclaration {
    readonly length = 0;
    readonly parentRule: CSSRule;
    private _attributes;
    private _computedStyleElement;
    /**
     * Constructor.
     *
     * @param [attributes] Attributes.
     * @param [computedStyleElement] Computed style element.
     * @param computedStyleElement.isConnected
     */
    constructor(attributes?: {
        [k: string]: Attr;
    }, computedStyleElement?: {
        isConnected: boolean;
    });
    /**
     *
     */
    get alignContent(): string;
    /**
     *
     */
    set alignContent(alignContent: string);
    /**
     *
     */
    get alignItems(): string;
    /**
     *
     */
    set alignItems(alignItems: string);
    /**
     *
     */
    get alignSelf(): string;
    /**
     *
     */
    set alignSelf(alignSelf: string);
    /**
     *
     */
    get alignmentBaseline(): string;
    /**
     *
     */
    set alignmentBaseline(alignmentBaseline: string);
    /**
     *
     */
    get all(): string;
    /**
     *
     */
    set all(all: string);
    /**
     *
     */
    get animation(): string;
    /**
     *
     */
    set animation(animation: string);
    /**
     *
     */
    get animationDelay(): string;
    /**
     *
     */
    set animationDelay(animationDelay: string);
    /**
     *
     */
    get animationDirection(): string;
    /**
     *
     */
    set animationDirection(animationDirection: string);
    /**
     *
     */
    get animationDuration(): string;
    /**
     *
     */
    set animationDuration(animationDuration: string);
    /**
     *
     */
    get animationFillMode(): string;
    /**
     *
     */
    set animationFillMode(animationFillMode: string);
    /**
     *
     */
    get animationIterationCount(): string;
    /**
     *
     */
    set animationIterationCount(animationIterationCount: string);
    /**
     *
     */
    get animationName(): string;
    /**
     *
     */
    set animationName(animationName: string);
    /**
     *
     */
    get animationPlayState(): string;
    /**
     *
     */
    set animationPlayState(animationPlayState: string);
    /**
     *
     */
    get animationTimingFunction(): string;
    /**
     *
     */
    set animationTimingFunction(animationTimingFunction: string);
    /**
     *
     */
    get appearance(): string;
    /**
     *
     */
    set appearance(appearance: string);
    /**
     *
     */
    get backdropFilter(): string;
    /**
     *
     */
    set backdropFilter(backdropFilter: string);
    /**
     *
     */
    get backfaceVisibility(): string;
    /**
     *
     */
    set backfaceVisibility(backfaceVisibility: string);
    /**
     *
     */
    get background(): string;
    /**
     *
     */
    set background(background: string);
    /**
     *
     */
    get backgroundAttachment(): string;
    /**
     *
     */
    set backgroundAttachment(backgroundAttachment: string);
    /**
     *
     */
    get backgroundBlendMode(): string;
    /**
     *
     */
    set backgroundBlendMode(backgroundBlendMode: string);
    /**
     *
     */
    get backgroundClip(): string;
    /**
     *
     */
    set backgroundClip(backgroundClip: string);
    /**
     *
     */
    get backgroundColor(): string;
    /**
     *
     */
    set backgroundColor(backgroundColor: string);
    /**
     *
     */
    get backgroundImage(): string;
    /**
     *
     */
    set backgroundImage(backgroundImage: string);
    /**
     *
     */
    get backgroundOrigin(): string;
    /**
     *
     */
    set backgroundOrigin(backgroundOrigin: string);
    /**
     *
     */
    get backgroundPosition(): string;
    /**
     *
     */
    set backgroundPosition(backgroundPosition: string);
    /**
     *
     */
    get backgroundPositionX(): string;
    /**
     *
     */
    set backgroundPositionX(backgroundPositionX: string);
    /**
     *
     */
    get backgroundPositionY(): string;
    /**
     *
     */
    set backgroundPositionY(backgroundPositionY: string);
    /**
     *
     */
    get backgroundRepeat(): string;
    /**
     *
     */
    set backgroundRepeat(backgroundRepeat: string);
    /**
     *
     */
    get backgroundRepeatX(): string;
    /**
     *
     */
    set backgroundRepeatX(backgroundRepeatX: string);
    /**
     *
     */
    get backgroundRepeatY(): string;
    /**
     *
     */
    set backgroundRepeatY(backgroundRepeatY: string);
    /**
     *
     */
    get backgroundSize(): string;
    /**
     *
     */
    set backgroundSize(backgroundSize: string);
    /**
     *
     */
    get baselineShift(): string;
    /**
     *
     */
    set baselineShift(baselineShift: string);
    /**
     *
     */
    get blockSize(): string;
    /**
     *
     */
    set blockSize(blockSize: string);
    /**
     *
     */
    get border(): string;
    /**
     *
     */
    set border(border: string);
    /**
     *
     */
    get borderBlockEnd(): string;
    /**
     *
     */
    set borderBlockEnd(borderBlockEnd: string);
    /**
     *
     */
    get borderBlockEndColor(): string;
    /**
     *
     */
    set borderBlockEndColor(borderBlockEndColor: string);
    /**
     *
     */
    get borderBlockEndStyle(): string;
    /**
     *
     */
    set borderBlockEndStyle(borderBlockEndStyle: string);
    /**
     *
     */
    get borderBlockEndWidth(): string;
    /**
     *
     */
    set borderBlockEndWidth(borderBlockEndWidth: string);
    /**
     *
     */
    get borderBlockStart(): string;
    /**
     *
     */
    set borderBlockStart(borderBlockStart: string);
    /**
     *
     */
    get borderBlockStartColor(): string;
    /**
     *
     */
    set borderBlockStartColor(borderBlockStartColor: string);
    /**
     *
     */
    get borderBlockStartStyle(): string;
    /**
     *
     */
    set borderBlockStartStyle(borderBlockStartStyle: string);
    /**
     *
     */
    get borderBlockStartWidth(): string;
    /**
     *
     */
    set borderBlockStartWidth(borderBlockStartWidth: string);
    /**
     *
     */
    get borderBottom(): string;
    /**
     *
     */
    set borderBottom(borderBottom: string);
    /**
     *
     */
    get borderBottomColor(): string;
    /**
     *
     */
    set borderBottomColor(borderBottomColor: string);
    /**
     *
     */
    get borderBottomLeftRadius(): string;
    /**
     *
     */
    set borderBottomLeftRadius(borderBottomLeftRadius: string);
    /**
     *
     */
    get borderBottomRightRadius(): string;
    /**
     *
     */
    set borderBottomRightRadius(borderBottomRightRadius: string);
    /**
     *
     */
    get borderBottomStyle(): string;
    /**
     *
     */
    set borderBottomStyle(borderBottomStyle: string);
    /**
     *
     */
    get borderBottomWidth(): string;
    /**
     *
     */
    set borderBottomWidth(borderBottomWidth: string);
    /**
     *
     */
    get borderCollapse(): string;
    /**
     *
     */
    set borderCollapse(borderCollapse: string);
    /**
     *
     */
    get borderColor(): string;
    /**
     *
     */
    set borderColor(borderColor: string);
    /**
     *
     */
    get borderImage(): string;
    /**
     *
     */
    set borderImage(borderImage: string);
    /**
     *
     */
    get borderImageOutset(): string;
    /**
     *
     */
    set borderImageOutset(borderImageOutset: string);
    /**
     *
     */
    get borderImageRepeat(): string;
    /**
     *
     */
    set borderImageRepeat(borderImageRepeat: string);
    /**
     *
     */
    get borderImageSlice(): string;
    /**
     *
     */
    set borderImageSlice(borderImageSlice: string);
    /**
     *
     */
    get borderImageSource(): string;
    /**
     *
     */
    set borderImageSource(borderImageSource: string);
    /**
     *
     */
    get borderImageWidth(): string;
    /**
     *
     */
    set borderImageWidth(borderImageWidth: string);
    /**
     *
     */
    get borderInlineEnd(): string;
    /**
     *
     */
    set borderInlineEnd(borderInlineEnd: string);
    /**
     *
     */
    get borderInlineEndColor(): string;
    /**
     *
     */
    set borderInlineEndColor(borderInlineEndColor: string);
    /**
     *
     */
    get borderInlineEndStyle(): string;
    /**
     *
     */
    set borderInlineEndStyle(borderInlineEndStyle: string);
    /**
     *
     */
    get borderInlineEndWidth(): string;
    /**
     *
     */
    set borderInlineEndWidth(borderInlineEndWidth: string);
    /**
     *
     */
    get borderInlineStart(): string;
    /**
     *
     */
    set borderInlineStart(borderInlineStart: string);
    /**
     *
     */
    get borderInlineStartColor(): string;
    /**
     *
     */
    set borderInlineStartColor(borderInlineStartColor: string);
    /**
     *
     */
    get borderInlineStartStyle(): string;
    /**
     *
     */
    set borderInlineStartStyle(borderInlineStartStyle: string);
    /**
     *
     */
    get borderInlineStartWidth(): string;
    /**
     *
     */
    set borderInlineStartWidth(borderInlineStartWidth: string);
    /**
     *
     */
    get borderLeft(): string;
    /**
     *
     */
    set borderLeft(borderLeft: string);
    /**
     *
     */
    get borderLeftColor(): string;
    /**
     *
     */
    set borderLeftColor(borderLeftColor: string);
    /**
     *
     */
    get borderLeftStyle(): string;
    /**
     *
     */
    set borderLeftStyle(borderLeftStyle: string);
    /**
     *
     */
    get borderLeftWidth(): string;
    /**
     *
     */
    set borderLeftWidth(borderLeftWidth: string);
    /**
     *
     */
    get borderRadius(): string;
    /**
     *
     */
    set borderRadius(borderRadius: string);
    /**
     *
     */
    get borderRight(): string;
    /**
     *
     */
    set borderRight(borderRight: string);
    /**
     *
     */
    get borderRightColor(): string;
    /**
     *
     */
    set borderRightColor(borderRightColor: string);
    /**
     *
     */
    get borderRightStyle(): string;
    /**
     *
     */
    set borderRightStyle(borderRightStyle: string);
    /**
     *
     */
    get borderRightWidth(): string;
    /**
     *
     */
    set borderRightWidth(borderRightWidth: string);
    /**
     *
     */
    get borderSpacing(): string;
    /**
     *
     */
    set borderSpacing(borderSpacing: string);
    /**
     *
     */
    get borderStyle(): string;
    /**
     *
     */
    set borderStyle(borderStyle: string);
    /**
     *
     */
    get borderTop(): string;
    /**
     *
     */
    set borderTop(borderTop: string);
    /**
     *
     */
    get borderTopColor(): string;
    /**
     *
     */
    set borderTopColor(borderTopColor: string);
    /**
     *
     */
    get borderTopLeftRadius(): string;
    /**
     *
     */
    set borderTopLeftRadius(borderTopLeftRadius: string);
    /**
     *
     */
    get borderTopRightRadius(): string;
    /**
     *
     */
    set borderTopRightRadius(borderTopRightRadius: string);
    /**
     *
     */
    get borderTopStyle(): string;
    /**
     *
     */
    set borderTopStyle(borderTopStyle: string);
    /**
     *
     */
    get borderTopWidth(): string;
    /**
     *
     */
    set borderTopWidth(borderTopWidth: string);
    /**
     *
     */
    get borderWidth(): string;
    /**
     *
     */
    set borderWidth(borderWidth: string);
    /**
     *
     */
    get bottom(): string;
    /**
     *
     */
    set bottom(bottom: string);
    /**
     *
     */
    get boxShadow(): string;
    /**
     *
     */
    set boxShadow(boxShadow: string);
    /**
     *
     */
    get boxSizing(): string;
    /**
     *
     */
    set boxSizing(boxSizing: string);
    /**
     *
     */
    get breakAfter(): string;
    /**
     *
     */
    set breakAfter(breakAfter: string);
    /**
     *
     */
    get breakBefore(): string;
    /**
     *
     */
    set breakBefore(breakBefore: string);
    /**
     *
     */
    get breakInside(): string;
    /**
     *
     */
    set breakInside(breakInside: string);
    /**
     *
     */
    get bufferedRendering(): string;
    /**
     *
     */
    set bufferedRendering(bufferedRendering: string);
    /**
     *
     */
    get captionSide(): string;
    /**
     *
     */
    set captionSide(captionSide: string);
    /**
     *
     */
    get caretColor(): string;
    /**
     *
     */
    set caretColor(caretColor: string);
    /**
     *
     */
    get clear(): string;
    /**
     *
     */
    set clear(clear: string);
    /**
     *
     */
    get clip(): string;
    /**
     *
     */
    set clip(clip: string);
    /**
     *
     */
    get clipPath(): string;
    /**
     *
     */
    set clipPath(clipPath: string);
    /**
     *
     */
    get clipRule(): string;
    /**
     *
     */
    set clipRule(clipRule: string);
    /**
     *
     */
    get color(): string;
    /**
     *
     */
    set color(color: string);
    /**
     *
     */
    get colorInterpolation(): string;
    /**
     *
     */
    set colorInterpolation(colorInterpolation: string);
    /**
     *
     */
    get colorInterpolationFilters(): string;
    /**
     *
     */
    set colorInterpolationFilters(colorInterpolationFilters: string);
    /**
     *
     */
    get colorRendering(): string;
    /**
     *
     */
    set colorRendering(colorRendering: string);
    /**
     *
     */
    get colorScheme(): string;
    /**
     *
     */
    set colorScheme(colorScheme: string);
    /**
     *
     */
    get columnCount(): string;
    /**
     *
     */
    set columnCount(columnCount: string);
    /**
     *
     */
    get columnFill(): string;
    /**
     *
     */
    set columnFill(columnFill: string);
    /**
     *
     */
    get columnGap(): string;
    /**
     *
     */
    set columnGap(columnGap: string);
    /**
     *
     */
    get columnRule(): string;
    /**
     *
     */
    set columnRule(columnRule: string);
    /**
     *
     */
    get columnRuleColor(): string;
    /**
     *
     */
    set columnRuleColor(columnRuleColor: string);
    /**
     *
     */
    get columnRuleStyle(): string;
    /**
     *
     */
    set columnRuleStyle(columnRuleStyle: string);
    /**
     *
     */
    get columnRuleWidth(): string;
    /**
     *
     */
    set columnRuleWidth(columnRuleWidth: string);
    /**
     *
     */
    get columnSpan(): string;
    /**
     *
     */
    set columnSpan(columnSpan: string);
    /**
     *
     */
    get columnWidth(): string;
    /**
     *
     */
    set columnWidth(columnWidth: string);
    /**
     *
     */
    get columns(): string;
    /**
     *
     */
    set columns(columns: string);
    /**
     *
     */
    get contain(): string;
    /**
     *
     */
    set contain(contain: string);
    /**
     *
     */
    get containIntrinsicSize(): string;
    /**
     *
     */
    set containIntrinsicSize(containIntrinsicSize: string);
    /**
     *
     */
    get content(): string;
    /**
     *
     */
    set content(content: string);
    /**
     *
     */
    get contentVisibility(): string;
    /**
     *
     */
    set contentVisibility(contentVisibility: string);
    /**
     *
     */
    get counterIncrement(): string;
    /**
     *
     */
    set counterIncrement(counterIncrement: string);
    /**
     *
     */
    get counterReset(): string;
    /**
     *
     */
    set counterReset(counterReset: string);
    /**
     *
     */
    get counterSet(): string;
    /**
     *
     */
    set counterSet(counterSet: string);
    /**
     *
     */
    get cssFloat(): string;
    /**
     *
     */
    set cssFloat(cssFloat: string);
    /**
     *
     */
    get cursor(): string;
    /**
     *
     */
    set cursor(cursor: string);
    /**
     *
     */
    get cx(): string;
    /**
     *
     */
    set cx(cx: string);
    /**
     *
     */
    get cy(): string;
    /**
     *
     */
    set cy(cy: string);
    /**
     *
     */
    get d(): string;
    /**
     *
     */
    set d(d: string);
    /**
     *
     */
    get direction(): string;
    /**
     *
     */
    set direction(direction: string);
    /**
     *
     */
    get display(): string;
    /**
     *
     */
    set display(display: string);
    /**
     *
     */
    get dominantBaseline(): string;
    /**
     *
     */
    set dominantBaseline(dominantBaseline: string);
    /**
     *
     */
    get emptyCells(): string;
    /**
     *
     */
    set emptyCells(emptyCells: string);
    /**
     *
     */
    get fill(): string;
    /**
     *
     */
    set fill(fill: string);
    /**
     *
     */
    get fillOpacity(): string;
    /**
     *
     */
    set fillOpacity(fillOpacity: string);
    /**
     *
     */
    get fillRule(): string;
    /**
     *
     */
    set fillRule(fillRule: string);
    /**
     *
     */
    get filter(): string;
    /**
     *
     */
    set filter(filter: string);
    /**
     *
     */
    get flex(): string;
    /**
     *
     */
    set flex(flex: string);
    /**
     *
     */
    get flexBasis(): string;
    /**
     *
     */
    set flexBasis(flexBasis: string);
    /**
     *
     */
    get flexDirection(): string;
    /**
     *
     */
    set flexDirection(flexDirection: string);
    /**
     *
     */
    get flexFlow(): string;
    /**
     *
     */
    set flexFlow(flexFlow: string);
    /**
     *
     */
    get flexGrow(): string;
    /**
     *
     */
    set flexGrow(flexGrow: string);
    /**
     *
     */
    get flexShrink(): string;
    /**
     *
     */
    set flexShrink(flexShrink: string);
    /**
     *
     */
    get flexWrap(): string;
    /**
     *
     */
    set flexWrap(flexWrap: string);
    /**
     *
     */
    get float(): string;
    /**
     *
     */
    set float(float: string);
    /**
     *
     */
    get floodColor(): string;
    /**
     *
     */
    set floodColor(floodColor: string);
    /**
     *
     */
    get floodOpacity(): string;
    /**
     *
     */
    set floodOpacity(floodOpacity: string);
    /**
     *
     */
    get font(): string;
    /**
     *
     */
    set font(font: string);
    /**
     *
     */
    get fontDisplay(): string;
    /**
     *
     */
    set fontDisplay(fontDisplay: string);
    /**
     *
     */
    get fontFamily(): string;
    /**
     *
     */
    set fontFamily(fontFamily: string);
    /**
     *
     */
    get fontFeatureSettings(): string;
    /**
     *
     */
    set fontFeatureSettings(fontFeatureSettings: string);
    /**
     *
     */
    get fontKerning(): string;
    /**
     *
     */
    set fontKerning(fontKerning: string);
    /**
     *
     */
    get fontOpticalSizing(): string;
    /**
     *
     */
    set fontOpticalSizing(fontOpticalSizing: string);
    /**
     *
     */
    get fontSize(): string;
    /**
     *
     */
    set fontSize(fontSize: string);
    /**
     *
     */
    get fontStretch(): string;
    /**
     *
     */
    set fontStretch(fontStretch: string);
    /**
     *
     */
    get fontStyle(): string;
    /**
     *
     */
    set fontStyle(fontStyle: string);
    /**
     *
     */
    get fontVariant(): string;
    /**
     *
     */
    set fontVariant(fontVariant: string);
    /**
     *
     */
    get fontVariantCaps(): string;
    /**
     *
     */
    set fontVariantCaps(fontVariantCaps: string);
    /**
     *
     */
    get fontVariantEastAsian(): string;
    /**
     *
     */
    set fontVariantEastAsian(fontVariantEastAsian: string);
    /**
     *
     */
    get fontVariantLigatures(): string;
    /**
     *
     */
    set fontVariantLigatures(fontVariantLigatures: string);
    /**
     *
     */
    get fontVariantNumeric(): string;
    /**
     *
     */
    set fontVariantNumeric(fontVariantNumeric: string);
    /**
     *
     */
    get fontVariationSettings(): string;
    /**
     *
     */
    set fontVariationSettings(fontVariationSettings: string);
    /**
     *
     */
    get fontWeight(): string;
    /**
     *
     */
    set fontWeight(fontWeight: string);
    /**
     *
     */
    get gap(): string;
    /**
     *
     */
    set gap(gap: string);
    /**
     *
     */
    get grid(): string;
    /**
     *
     */
    set grid(grid: string);
    /**
     *
     */
    get gridArea(): string;
    /**
     *
     */
    set gridArea(gridArea: string);
    /**
     *
     */
    get gridAutoColumns(): string;
    /**
     *
     */
    set gridAutoColumns(gridAutoColumns: string);
    /**
     *
     */
    get gridAutoFlow(): string;
    /**
     *
     */
    set gridAutoFlow(gridAutoFlow: string);
    /**
     *
     */
    get gridAutoRows(): string;
    /**
     *
     */
    set gridAutoRows(gridAutoRows: string);
    /**
     *
     */
    get gridColumn(): string;
    /**
     *
     */
    set gridColumn(gridColumn: string);
    /**
     *
     */
    get gridColumnEnd(): string;
    /**
     *
     */
    set gridColumnEnd(gridColumnEnd: string);
    /**
     *
     */
    get gridColumnGap(): string;
    /**
     *
     */
    set gridColumnGap(gridColumnGap: string);
    /**
     *
     */
    get gridColumnStart(): string;
    /**
     *
     */
    set gridColumnStart(gridColumnStart: string);
    /**
     *
     */
    get gridGap(): string;
    /**
     *
     */
    set gridGap(gridGap: string);
    /**
     *
     */
    get gridRow(): string;
    /**
     *
     */
    set gridRow(gridRow: string);
    /**
     *
     */
    get gridRowEnd(): string;
    /**
     *
     */
    set gridRowEnd(gridRowEnd: string);
    /**
     *
     */
    get gridRowGap(): string;
    /**
     *
     */
    set gridRowGap(gridRowGap: string);
    /**
     *
     */
    get gridRowStart(): string;
    /**
     *
     */
    set gridRowStart(gridRowStart: string);
    /**
     *
     */
    get gridTemplate(): string;
    /**
     *
     */
    set gridTemplate(gridTemplate: string);
    /**
     *
     */
    get gridTemplateAreas(): string;
    /**
     *
     */
    set gridTemplateAreas(gridTemplateAreas: string);
    /**
     *
     */
    get gridTemplateColumns(): string;
    /**
     *
     */
    set gridTemplateColumns(gridTemplateColumns: string);
    /**
     *
     */
    get gridTemplateRows(): string;
    /**
     *
     */
    set gridTemplateRows(gridTemplateRows: string);
    /**
     *
     */
    get height(): string;
    /**
     *
     */
    set height(height: string);
    /**
     *
     */
    get hyphens(): string;
    /**
     *
     */
    set hyphens(hyphens: string);
    /**
     *
     */
    get imageOrientation(): string;
    /**
     *
     */
    set imageOrientation(imageOrientation: string);
    /**
     *
     */
    get imageRendering(): string;
    /**
     *
     */
    set imageRendering(imageRendering: string);
    /**
     *
     */
    get inherits(): string;
    /**
     *
     */
    set inherits(inherits: string);
    /**
     *
     */
    get initialValue(): string;
    /**
     *
     */
    set initialValue(initialValue: string);
    /**
     *
     */
    get inlineSize(): string;
    /**
     *
     */
    set inlineSize(inlineSize: string);
    /**
     *
     */
    get isolation(): string;
    /**
     *
     */
    set isolation(isolation: string);
    /**
     *
     */
    get justifyContent(): string;
    /**
     *
     */
    set justifyContent(justifyContent: string);
    /**
     *
     */
    get justifyItems(): string;
    /**
     *
     */
    set justifyItems(justifyItems: string);
    /**
     *
     */
    get justifySelf(): string;
    /**
     *
     */
    set justifySelf(justifySelf: string);
    /**
     *
     */
    get left(): string;
    /**
     *
     */
    set left(left: string);
    /**
     *
     */
    get letterSpacing(): string;
    /**
     *
     */
    set letterSpacing(letterSpacing: string);
    /**
     *
     */
    get lightingColor(): string;
    /**
     *
     */
    set lightingColor(lightingColor: string);
    /**
     *
     */
    get lineBreak(): string;
    /**
     *
     */
    set lineBreak(lineBreak: string);
    /**
     *
     */
    get lineHeight(): string;
    /**
     *
     */
    set lineHeight(lineHeight: string);
    /**
     *
     */
    get listStyle(): string;
    /**
     *
     */
    set listStyle(listStyle: string);
    /**
     *
     */
    get listStyleImage(): string;
    /**
     *
     */
    set listStyleImage(listStyleImage: string);
    /**
     *
     */
    get listStylePosition(): string;
    /**
     *
     */
    set listStylePosition(listStylePosition: string);
    /**
     *
     */
    get listStyleType(): string;
    /**
     *
     */
    set listStyleType(listStyleType: string);
    /**
     *
     */
    get margin(): string;
    /**
     *
     */
    set margin(margin: string);
    /**
     *
     */
    get marginBlockEnd(): string;
    /**
     *
     */
    set marginBlockEnd(marginBlockEnd: string);
    /**
     *
     */
    get marginBlockStart(): string;
    /**
     *
     */
    set marginBlockStart(marginBlockStart: string);
    /**
     *
     */
    get marginBottom(): string;
    /**
     *
     */
    set marginBottom(marginBottom: string);
    /**
     *
     */
    get marginInlineEnd(): string;
    /**
     *
     */
    set marginInlineEnd(marginInlineEnd: string);
    /**
     *
     */
    get marginInlineStart(): string;
    /**
     *
     */
    set marginInlineStart(marginInlineStart: string);
    /**
     *
     */
    get marginLeft(): string;
    /**
     *
     */
    set marginLeft(marginLeft: string);
    /**
     *
     */
    get marginRight(): string;
    /**
     *
     */
    set marginRight(marginRight: string);
    /**
     *
     */
    get marginTop(): string;
    /**
     *
     */
    set marginTop(marginTop: string);
    /**
     *
     */
    get marker(): string;
    /**
     *
     */
    set marker(marker: string);
    /**
     *
     */
    get markerEnd(): string;
    /**
     *
     */
    set markerEnd(markerEnd: string);
    /**
     *
     */
    get markerMid(): string;
    /**
     *
     */
    set markerMid(markerMid: string);
    /**
     *
     */
    get markerStart(): string;
    /**
     *
     */
    set markerStart(markerStart: string);
    /**
     *
     */
    get mask(): string;
    /**
     *
     */
    set mask(mask: string);
    /**
     *
     */
    get maskType(): string;
    /**
     *
     */
    set maskType(maskType: string);
    /**
     *
     */
    get maxBlockSize(): string;
    /**
     *
     */
    set maxBlockSize(maxBlockSize: string);
    /**
     *
     */
    get maxHeight(): string;
    /**
     *
     */
    set maxHeight(maxHeight: string);
    /**
     *
     */
    get maxInlineSize(): string;
    /**
     *
     */
    set maxInlineSize(maxInlineSize: string);
    /**
     *
     */
    get maxWidth(): string;
    /**
     *
     */
    set maxWidth(maxWidth: string);
    /**
     *
     */
    get maxZoom(): string;
    /**
     *
     */
    set maxZoom(maxZoom: string);
    /**
     *
     */
    get minBlockSize(): string;
    /**
     *
     */
    set minBlockSize(minBlockSize: string);
    /**
     *
     */
    get minHeight(): string;
    /**
     *
     */
    set minHeight(minHeight: string);
    /**
     *
     */
    get minInlineSize(): string;
    /**
     *
     */
    set minInlineSize(minInlineSize: string);
    /**
     *
     */
    get minWidth(): string;
    /**
     *
     */
    set minWidth(minWidth: string);
    /**
     *
     */
    get minZoom(): string;
    /**
     *
     */
    set minZoom(minZoom: string);
    /**
     *
     */
    get mixBlendMode(): string;
    /**
     *
     */
    set mixBlendMode(mixBlendMode: string);
    /**
     *
     */
    get objectFit(): string;
    /**
     *
     */
    set objectFit(objectFit: string);
    /**
     *
     */
    get objectPosition(): string;
    /**
     *
     */
    set objectPosition(objectPosition: string);
    /**
     *
     */
    get offset(): string;
    /**
     *
     */
    set offset(offset: string);
    /**
     *
     */
    get offsetDistance(): string;
    /**
     *
     */
    set offsetDistance(offsetDistance: string);
    /**
     *
     */
    get offsetPath(): string;
    /**
     *
     */
    set offsetPath(offsetPath: string);
    /**
     *
     */
    get offsetRotate(): string;
    /**
     *
     */
    set offsetRotate(offsetRotate: string);
    /**
     *
     */
    get opacity(): string;
    /**
     *
     */
    set opacity(opacity: string);
    /**
     *
     */
    get order(): string;
    /**
     *
     */
    set order(order: string);
    /**
     *
     */
    get orientation(): string;
    /**
     *
     */
    set orientation(orientation: string);
    /**
     *
     */
    get orphans(): string;
    /**
     *
     */
    set orphans(orphans: string);
    /**
     *
     */
    get outline(): string;
    /**
     *
     */
    set outline(outline: string);
    /**
     *
     */
    get outlineColor(): string;
    /**
     *
     */
    set outlineColor(outlineColor: string);
    /**
     *
     */
    get outlineOffset(): string;
    /**
     *
     */
    set outlineOffset(outlineOffset: string);
    /**
     *
     */
    get outlineStyle(): string;
    /**
     *
     */
    set outlineStyle(outlineStyle: string);
    /**
     *
     */
    get outlineWidth(): string;
    /**
     *
     */
    set outlineWidth(outlineWidth: string);
    /**
     *
     */
    get overflow(): string;
    /**
     *
     */
    set overflow(overflow: string);
    /**
     *
     */
    get overflowAnchor(): string;
    /**
     *
     */
    set overflowAnchor(overflowAnchor: string);
    /**
     *
     */
    get overflowWrap(): string;
    /**
     *
     */
    set overflowWrap(overflowWrap: string);
    /**
     *
     */
    get overflowX(): string;
    /**
     *
     */
    set overflowX(overflowX: string);
    /**
     *
     */
    get overflowY(): string;
    /**
     *
     */
    set overflowY(overflowY: string);
    /**
     *
     */
    get overscrollBehavior(): string;
    /**
     *
     */
    set overscrollBehavior(overscrollBehavior: string);
    /**
     *
     */
    get overscrollBehaviorBlock(): string;
    /**
     *
     */
    set overscrollBehaviorBlock(overscrollBehaviorBlock: string);
    /**
     *
     */
    get overscrollBehaviorInline(): string;
    /**
     *
     */
    set overscrollBehaviorInline(overscrollBehaviorInline: string);
    /**
     *
     */
    get overscrollBehaviorX(): string;
    /**
     *
     */
    set overscrollBehaviorX(overscrollBehaviorX: string);
    /**
     *
     */
    get overscrollBehaviorY(): string;
    /**
     *
     */
    set overscrollBehaviorY(overscrollBehaviorY: string);
    /**
     *
     */
    get padding(): string;
    /**
     *
     */
    set padding(padding: string);
    /**
     *
     */
    get paddingBlockEnd(): string;
    /**
     *
     */
    set paddingBlockEnd(paddingBlockEnd: string);
    /**
     *
     */
    get paddingBlockStart(): string;
    /**
     *
     */
    set paddingBlockStart(paddingBlockStart: string);
    /**
     *
     */
    get paddingBottom(): string;
    /**
     *
     */
    set paddingBottom(paddingBottom: string);
    /**
     *
     */
    get paddingInlineEnd(): string;
    /**
     *
     */
    set paddingInlineEnd(paddingInlineEnd: string);
    /**
     *
     */
    get paddingInlineStart(): string;
    /**
     *
     */
    set paddingInlineStart(paddingInlineStart: string);
    /**
     *
     */
    get paddingLeft(): string;
    /**
     *
     */
    set paddingLeft(paddingLeft: string);
    /**
     *
     */
    get paddingRight(): string;
    /**
     *
     */
    set paddingRight(paddingRight: string);
    /**
     *
     */
    get paddingTop(): string;
    /**
     *
     */
    set paddingTop(paddingTop: string);
    /**
     *
     */
    get page(): string;
    /**
     *
     */
    set page(page: string);
    /**
     *
     */
    get pageBreakAfter(): string;
    /**
     *
     */
    set pageBreakAfter(pageBreakAfter: string);
    /**
     *
     */
    get pageBreakBefore(): string;
    /**
     *
     */
    set pageBreakBefore(pageBreakBefore: string);
    /**
     *
     */
    get pageBreakInside(): string;
    /**
     *
     */
    set pageBreakInside(pageBreakInside: string);
    /**
     *
     */
    get pageOrientation(): string;
    /**
     *
     */
    set pageOrientation(pageOrientation: string);
    /**
     *
     */
    get paintOrder(): string;
    /**
     *
     */
    set paintOrder(paintOrder: string);
    /**
     *
     */
    get perspective(): string;
    /**
     *
     */
    set perspective(perspective: string);
    /**
     *
     */
    get perspectiveOrigin(): string;
    /**
     *
     */
    set perspectiveOrigin(perspectiveOrigin: string);
    /**
     *
     */
    get placeContent(): string;
    /**
     *
     */
    set placeContent(placeContent: string);
    /**
     *
     */
    get placeItems(): string;
    /**
     *
     */
    set placeItems(placeItems: string);
    /**
     *
     */
    get placeSelf(): string;
    /**
     *
     */
    set placeSelf(placeSelf: string);
    /**
     *
     */
    get pointerEvents(): string;
    /**
     *
     */
    set pointerEvents(pointerEvents: string);
    /**
     *
     */
    get position(): string;
    /**
     *
     */
    set position(position: string);
    /**
     *
     */
    get quotes(): string;
    /**
     *
     */
    set quotes(quotes: string);
    /**
     *
     */
    get r(): string;
    /**
     *
     */
    set r(r: string);
    /**
     *
     */
    get resize(): string;
    /**
     *
     */
    set resize(resize: string);
    /**
     *
     */
    get right(): string;
    /**
     *
     */
    set right(right: string);
    /**
     *
     */
    get rowGap(): string;
    /**
     *
     */
    set rowGap(rowGap: string);
    /**
     *
     */
    get rubyPosition(): string;
    /**
     *
     */
    set rubyPosition(rubyPosition: string);
    /**
     *
     */
    get rx(): string;
    /**
     *
     */
    set rx(rx: string);
    /**
     *
     */
    get ry(): string;
    /**
     *
     */
    set ry(ry: string);
    /**
     *
     */
    get scrollBehavior(): string;
    /**
     *
     */
    set scrollBehavior(scrollBehavior: string);
    /**
     *
     */
    get scrollMargin(): string;
    /**
     *
     */
    set scrollMargin(scrollMargin: string);
    /**
     *
     */
    get scrollMarginBlock(): string;
    /**
     *
     */
    set scrollMarginBlock(scrollMarginBlock: string);
    /**
     *
     */
    get scrollMarginBlockEnd(): string;
    /**
     *
     */
    set scrollMarginBlockEnd(scrollMarginBlockEnd: string);
    /**
     *
     */
    get scrollMarginBlockStart(): string;
    /**
     *
     */
    set scrollMarginBlockStart(scrollMarginBlockStart: string);
    /**
     *
     */
    get scrollMarginBottom(): string;
    /**
     *
     */
    set scrollMarginBottom(scrollMarginBottom: string);
    /**
     *
     */
    get scrollMarginInline(): string;
    /**
     *
     */
    set scrollMarginInline(scrollMarginInline: string);
    /**
     *
     */
    get scrollMarginInlineEnd(): string;
    /**
     *
     */
    set scrollMarginInlineEnd(scrollMarginInlineEnd: string);
    /**
     *
     */
    get scrollMarginInlineStart(): string;
    /**
     *
     */
    set scrollMarginInlineStart(scrollMarginInlineStart: string);
    /**
     *
     */
    get scrollMarginLeft(): string;
    /**
     *
     */
    set scrollMarginLeft(scrollMarginLeft: string);
    /**
     *
     */
    get scrollMarginRight(): string;
    /**
     *
     */
    set scrollMarginRight(scrollMarginRight: string);
    /**
     *
     */
    get scrollMarginTop(): string;
    /**
     *
     */
    set scrollMarginTop(scrollMarginTop: string);
    /**
     *
     */
    get scrollPadding(): string;
    /**
     *
     */
    set scrollPadding(scrollPadding: string);
    /**
     *
     */
    get scrollPaddingBlock(): string;
    /**
     *
     */
    set scrollPaddingBlock(scrollPaddingBlock: string);
    /**
     *
     */
    get scrollPaddingBlockEnd(): string;
    /**
     *
     */
    set scrollPaddingBlockEnd(scrollPaddingBlockEnd: string);
    /**
     *
     */
    get scrollPaddingBlockStart(): string;
    /**
     *
     */
    set scrollPaddingBlockStart(scrollPaddingBlockStart: string);
    /**
     *
     */
    get scrollPaddingBottom(): string;
    /**
     *
     */
    set scrollPaddingBottom(scrollPaddingBottom: string);
    /**
     *
     */
    get scrollPaddingInline(): string;
    /**
     *
     */
    set scrollPaddingInline(scrollPaddingInline: string);
    /**
     *
     */
    get scrollPaddingInlineEnd(): string;
    /**
     *
     */
    set scrollPaddingInlineEnd(scrollPaddingInlineEnd: string);
    /**
     *
     */
    get scrollPaddingInlineStart(): string;
    /**
     *
     */
    set scrollPaddingInlineStart(scrollPaddingInlineStart: string);
    /**
     *
     */
    get scrollPaddingLeft(): string;
    /**
     *
     */
    set scrollPaddingLeft(scrollPaddingLeft: string);
    /**
     *
     */
    get scrollPaddingRight(): string;
    /**
     *
     */
    set scrollPaddingRight(scrollPaddingRight: string);
    /**
     *
     */
    get scrollPaddingTop(): string;
    /**
     *
     */
    set scrollPaddingTop(scrollPaddingTop: string);
    /**
     *
     */
    get scrollSnapAlign(): string;
    /**
     *
     */
    set scrollSnapAlign(scrollSnapAlign: string);
    /**
     *
     */
    get scrollSnapStop(): string;
    /**
     *
     */
    set scrollSnapStop(scrollSnapStop: string);
    /**
     *
     */
    get scrollSnapType(): string;
    /**
     *
     */
    set scrollSnapType(scrollSnapType: string);
    /**
     *
     */
    get shapeImageThreshold(): string;
    /**
     *
     */
    set shapeImageThreshold(shapeImageThreshold: string);
    /**
     *
     */
    get shapeMargin(): string;
    /**
     *
     */
    set shapeMargin(shapeMargin: string);
    /**
     *
     */
    get shapeOutside(): string;
    /**
     *
     */
    set shapeOutside(shapeOutside: string);
    /**
     *
     */
    get shapeRendering(): string;
    /**
     *
     */
    set shapeRendering(shapeRendering: string);
    /**
     *
     */
    get size(): string;
    /**
     *
     */
    set size(size: string);
    /**
     *
     */
    get speak(): string;
    /**
     *
     */
    set speak(speak: string);
    /**
     *
     */
    get src(): string;
    /**
     *
     */
    set src(src: string);
    /**
     *
     */
    get stopColor(): string;
    /**
     *
     */
    set stopColor(stopColor: string);
    /**
     *
     */
    get stopOpacity(): string;
    /**
     *
     */
    set stopOpacity(stopOpacity: string);
    /**
     *
     */
    get stroke(): string;
    /**
     *
     */
    set stroke(stroke: string);
    /**
     *
     */
    get strokeDasharray(): string;
    /**
     *
     */
    set strokeDasharray(strokeDasharray: string);
    /**
     *
     */
    get strokeDashoffset(): string;
    /**
     *
     */
    set strokeDashoffset(strokeDashoffset: string);
    /**
     *
     */
    get strokeLinecap(): string;
    /**
     *
     */
    set strokeLinecap(strokeLinecap: string);
    /**
     *
     */
    get strokeLinejoin(): string;
    /**
     *
     */
    set strokeLinejoin(strokeLinejoin: string);
    /**
     *
     */
    get strokeMiterlimit(): string;
    /**
     *
     */
    set strokeMiterlimit(strokeMiterlimit: string);
    /**
     *
     */
    get strokeOpacity(): string;
    /**
     *
     */
    set strokeOpacity(strokeOpacity: string);
    /**
     *
     */
    get strokeWidth(): string;
    /**
     *
     */
    set strokeWidth(strokeWidth: string);
    /**
     *
     */
    get syntax(): string;
    /**
     *
     */
    set syntax(syntax: string);
    /**
     *
     */
    get tabSize(): string;
    /**
     *
     */
    set tabSize(tabSize: string);
    /**
     *
     */
    get tableLayout(): string;
    /**
     *
     */
    set tableLayout(tableLayout: string);
    /**
     *
     */
    get textAlign(): string;
    /**
     *
     */
    set textAlign(textAlign: string);
    /**
     *
     */
    get textAlignLast(): string;
    /**
     *
     */
    set textAlignLast(textAlignLast: string);
    /**
     *
     */
    get textAnchor(): string;
    /**
     *
     */
    set textAnchor(textAnchor: string);
    /**
     *
     */
    get textCombineUpright(): string;
    /**
     *
     */
    set textCombineUpright(textCombineUpright: string);
    /**
     *
     */
    get textDecoration(): string;
    /**
     *
     */
    set textDecoration(textDecoration: string);
    /**
     *
     */
    get textDecorationColor(): string;
    /**
     *
     */
    set textDecorationColor(textDecorationColor: string);
    /**
     *
     */
    get textDecorationLine(): string;
    /**
     *
     */
    set textDecorationLine(textDecorationLine: string);
    /**
     *
     */
    get textDecorationSkipInk(): string;
    /**
     *
     */
    set textDecorationSkipInk(textDecorationSkipInk: string);
    /**
     *
     */
    get textDecorationStyle(): string;
    /**
     *
     */
    set textDecorationStyle(textDecorationStyle: string);
    /**
     *
     */
    get textIndent(): string;
    /**
     *
     */
    set textIndent(textIndent: string);
    /**
     *
     */
    get textOrientation(): string;
    /**
     *
     */
    set textOrientation(textOrientation: string);
    /**
     *
     */
    get textOverflow(): string;
    /**
     *
     */
    set textOverflow(textOverflow: string);
    /**
     *
     */
    get textRendering(): string;
    /**
     *
     */
    set textRendering(textRendering: string);
    /**
     *
     */
    get textShadow(): string;
    /**
     *
     */
    set textShadow(textShadow: string);
    /**
     *
     */
    get textSizeAdjust(): string;
    /**
     *
     */
    set textSizeAdjust(textSizeAdjust: string);
    /**
     *
     */
    get textTransform(): string;
    /**
     *
     */
    set textTransform(textTransform: string);
    /**
     *
     */
    get textUnderlinePosition(): string;
    /**
     *
     */
    set textUnderlinePosition(textUnderlinePosition: string);
    /**
     *
     */
    get top(): string;
    /**
     *
     */
    set top(top: string);
    /**
     *
     */
    get touchAction(): string;
    /**
     *
     */
    set touchAction(touchAction: string);
    /**
     *
     */
    get transform(): string;
    /**
     *
     */
    set transform(transform: string);
    /**
     *
     */
    get transformBox(): string;
    /**
     *
     */
    set transformBox(transformBox: string);
    /**
     *
     */
    get transformOrigin(): string;
    /**
     *
     */
    set transformOrigin(transformOrigin: string);
    /**
     *
     */
    get transformStyle(): string;
    /**
     *
     */
    set transformStyle(transformStyle: string);
    /**
     *
     */
    get transition(): string;
    /**
     *
     */
    set transition(transition: string);
    /**
     *
     */
    get transitionDelay(): string;
    /**
     *
     */
    set transitionDelay(transitionDelay: string);
    /**
     *
     */
    get transitionDuration(): string;
    /**
     *
     */
    set transitionDuration(transitionDuration: string);
    /**
     *
     */
    get transitionProperty(): string;
    /**
     *
     */
    set transitionProperty(transitionProperty: string);
    /**
     *
     */
    get transitionTimingFunction(): string;
    /**
     *
     */
    set transitionTimingFunction(transitionTimingFunction: string);
    /**
     *
     */
    get unicodeBidi(): string;
    /**
     *
     */
    set unicodeBidi(unicodeBidi: string);
    /**
     *
     */
    get unicodeRange(): string;
    /**
     *
     */
    set unicodeRange(unicodeRange: string);
    /**
     *
     */
    get userSelect(): string;
    /**
     *
     */
    set userSelect(userSelect: string);
    /**
     *
     */
    get userZoom(): string;
    /**
     *
     */
    set userZoom(userZoom: string);
    /**
     *
     */
    get vectorEffect(): string;
    /**
     *
     */
    set vectorEffect(vectorEffect: string);
    /**
     *
     */
    get verticalAlign(): string;
    /**
     *
     */
    set verticalAlign(verticalAlign: string);
    /**
     *
     */
    get visibility(): string;
    /**
     *
     */
    set visibility(visibility: string);
    /**
     *
     */
    get whiteSpace(): string;
    /**
     *
     */
    set whiteSpace(whiteSpace: string);
    /**
     *
     */
    get widows(): string;
    /**
     *
     */
    set widows(widows: string);
    /**
     *
     */
    get width(): string;
    /**
     *
     */
    set width(width: string);
    /**
     *
     */
    get willChange(): string;
    /**
     *
     */
    set willChange(willChange: string);
    /**
     *
     */
    get wordBreak(): string;
    /**
     *
     */
    set wordBreak(wordBreak: string);
    /**
     *
     */
    get wordSpacing(): string;
    /**
     *
     */
    set wordSpacing(wordSpacing: string);
    /**
     *
     */
    get wordWrap(): string;
    /**
     *
     */
    set wordWrap(wordWrap: string);
    /**
     *
     */
    get writingMode(): string;
    /**
     *
     */
    set writingMode(writingMode: string);
    /**
     *
     */
    get x(): string;
    /**
     *
     */
    set x(x: string);
    /**
     *
     */
    get y(): string;
    /**
     *
     */
    set y(y: string);
    /**
     *
     */
    get zIndex(): string;
    /**
     *
     */
    set zIndex(zIndex: string);
    /**
     *
     */
    get zoom(): string;
    /**
     *
     */
    set zoom(zoom: string);
    /**
     * Returns the style decleration as a CSS text.
     *
     * @returns CSS text.
     */
    get cssText(): string;
    /**
     * Sets CSS text.
     *
     * @param cssText CSS text.
     */
    set cssText(cssText: string);
    /**
     * Returns item.
     *
     * @param index Index.
     * @returns Item.
     */
    item(index: number): string;
    /**
     * Set a property.
     *
     * @param propertyName Property name.
     * @param value Value. Must not contain "!important" as that should be set using the priority parameter.
     * @param [priority] Can be "important", or an empty string.
     */
    setProperty(propertyName: string, value: string, priority?: string): void;
    /**
     * Removes a property.
     *
     * @param propertyName Property name in kebab case.
     * @param value Value. Must not contain "!important" as that should be set using the priority parameter.
     * @param [priority] Can be "important", or an empty string.
     */
    removeProperty(propertyName: string): void;
    /**
     * Returns a property.
     *
     * @param propertyName Property name in kebab case.
     * @returns Property value.
     */
    getPropertyValue(propertyName: string): string;
}
