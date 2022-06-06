import { VNodeTypes, ConcreteComponent, ComponentPropsOptions } from 'vue';
import { Stubs } from './types';
interface StubOptions {
    name: string;
    propsDeclaration?: ComponentPropsOptions;
    renderStubDefaultSlot?: boolean;
}
export declare const registerStub: ({ source, stub, originalStub }: {
    source: ConcreteComponent;
    stub: ConcreteComponent;
    originalStub?: ConcreteComponent<{}, any, any, import("vue").ComputedOptions, import("vue").MethodOptions> | undefined;
}) => void;
export declare const getOriginalVNodeTypeFromStub: (type: ConcreteComponent) => VNodeTypes | undefined;
export declare const getOriginalStubFromSpecializedStub: (type: ConcreteComponent) => VNodeTypes | undefined;
export declare const addToDoNotStubComponents: (type: ConcreteComponent) => WeakSet<ConcreteComponent<{}, any, any, import("vue").ComputedOptions, import("vue").MethodOptions>>;
export declare const createStub: ({ name, propsDeclaration, renderStubDefaultSlot }: StubOptions) => import("vue").DefineComponent<ComponentPropsOptions<{
    [x: string]: unknown;
}>, unknown, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<unknown[] & {
    [x: number]: string;
} & {
    [Symbol.iterator]?: IterableIterator<string> | undefined;
    concat?: string[] | undefined;
    indexOf?: ((searchElement: string, fromIndex?: number | undefined) => number) | undefined;
    lastIndexOf?: ((searchElement: string, fromIndex?: number | undefined) => number) | undefined;
    slice?: string[] | undefined;
    length?: number | undefined;
    includes?: ((searchElement: string, fromIndex?: number | undefined) => boolean) | undefined;
    at?: ((index: number) => string | undefined) | undefined;
    [Symbol.unscopables]?: {
        copyWithin: boolean;
        entries: boolean;
        fill: boolean;
        find: boolean;
        findIndex: boolean;
        keys: boolean;
        values: boolean;
    } | undefined;
    pop?: string | undefined;
    push?: number | undefined;
    join?: string | undefined;
    reverse?: string[] | undefined;
    shift?: string | undefined;
    sort?: string[] | undefined;
    splice?: {
        (start: number, deleteCount?: number | undefined): string[];
        (start: number, deleteCount: number, ...items: string[]): string[];
    } | undefined;
    unshift?: number | undefined;
    every?: {
        <S extends string>(predicate: (value: string, index: number, array: string[]) => value is S, thisArg?: any): this is S[];
        (predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): boolean;
    } | undefined;
    some?: ((predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) | undefined;
    forEach?: ((callbackfn: (value: string, index: number, array: string[]) => void, thisArg?: any) => void) | undefined;
    map?: (<U>(callbackfn: (value: string, index: number, array: string[]) => U, thisArg?: any) => U[]) | undefined;
    filter?: {
        <S_1 extends string>(predicate: (value: string, index: number, array: string[]) => value is S_1, thisArg?: any): S_1[];
        (predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): string[];
    } | undefined;
    reduce?: {
        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
        <U_1>(callbackfn: (previousValue: U_1, currentValue: string, currentIndex: number, array: string[]) => U_1, initialValue: U_1): U_1;
    } | undefined;
    reduceRight?: {
        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
        <U_2>(callbackfn: (previousValue: U_2, currentValue: string, currentIndex: number, array: string[]) => U_2, initialValue: U_2): U_2;
    } | undefined;
    find?: {
        <S_2 extends string>(predicate: (this: void, value: string, index: number, obj: string[]) => value is S_2, thisArg?: any): S_2 | undefined;
        (predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): string | undefined;
    } | undefined;
    findIndex?: ((predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any) => number) | undefined;
    fill?: ((value: string, start?: number | undefined, end?: number | undefined) => string[]) | undefined;
    copyWithin?: ((target: number, start: number, end?: number | undefined) => string[]) | undefined;
    entries?: IterableIterator<[number, string]> | undefined;
    keys?: IterableIterator<number> | undefined;
    values?: IterableIterator<string> | undefined;
    flatMap?: (<U_3, This = undefined>(callback: (this: This, value: string, index: number, array: string[]) => U_3 | readonly U_3[], thisArg?: This | undefined) => U_3[]) | undefined;
    flat?: unknown[] | undefined;
    toString?: string | undefined;
    toLocaleString?: string | undefined;
}> | Readonly<{
    [x: string]: unknown;
} & {} & {
    [x: string]: import("vue").Prop<unknown, unknown> | null | undefined;
}>, {
    [x: number]: string;
} | {}>;
export declare function stubComponents(stubs?: Stubs, shallow?: boolean, renderStubDefaultSlot?: boolean): void;
export {};
