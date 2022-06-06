import BaseWrapper from './baseWrapper';
import { RefSelector } from './types';
export declare class DOMWrapper<NodeType extends Node> extends BaseWrapper<NodeType> {
    constructor(element: NodeType);
    getRootNodes(): import("./types").VueNode<NodeType>[];
    getCurrentComponent(): import("vue").ComponentInternalInstance | undefined;
    find(selector: string | RefSelector): DOMWrapper<any>;
    findAllComponents(selector: any): any;
    private setChecked;
    setValue(value?: any): Promise<void>;
    private setSelected;
}
