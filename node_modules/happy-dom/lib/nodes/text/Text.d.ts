import CharacterData from '../character-data/CharacterData';
import IText from './IText';
/**
 * Text node.
 */
export default class Text extends CharacterData implements IText {
    readonly nodeType = 3;
    /**
     * Node name.
     *
     * @returns Node name.
     */
    get nodeName(): string;
    /**
     * Converts to string.
     *
     * @returns String.
     */
    toString(): string;
    /**
     * Clones a node.
     *
     * @override
     * @param [deep=false] "true" to clone deep.
     * @returns Cloned node.
     */
    cloneNode(deep?: boolean): IText;
}
