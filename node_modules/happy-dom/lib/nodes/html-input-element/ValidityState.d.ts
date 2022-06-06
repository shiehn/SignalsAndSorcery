import HTMLInputElement from './HTMLInputElement';
/**
 * Input validity state.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 */
export default class ValidityState {
    badInput: boolean;
    customError: boolean;
    patternMismatch: boolean;
    rangeOverflow: boolean;
    rangeUnderflow: boolean;
    stepMismatch: boolean;
    private element;
    /**
     * Constructor.
     *
     * @param element Input element.
     */
    constructor(element: HTMLInputElement);
    /**
     * Returns validity.
     *
     * @returns "true" if valid.
     */
    get tooLong(): boolean;
    /**
     * Returns validity.
     *
     * @returns "true" if valid.
     */
    get tooShort(): boolean;
    /**
     * Returns validity.
     *
     * @returns "true" if valid.
     */
    get typeMismatch(): boolean;
    /**
     * Returns validity.
     *
     * @returns "true" if valid.
     */
    get valueMissing(): boolean;
    /**
     * Returns validity.
     *
     * @returns "true" if valid.
     */
    get valid(): boolean;
}
