declare type AsyncFunction = (...args: any[]) => Promise<any> | any;
declare function asyncAction<T extends AsyncFunction>(funcs: T[], initData: Parameters<AsyncFunction>[0]): Promise<any>;

interface JsonObject {
    [k: string]: JsonValue;
}
declare type JsonValue = null | boolean | string | number | JsonObject;
interface FormDataObject {
    [k: string]: FormDataValue;
}
declare type FormDataValue = JsonValue | Blob | FormDataObject;
declare function formDataFormat(data: FormDataObject): FormData;
declare function formUrlEncodedFormat(data: JsonObject): URLSearchParams;
declare function cloneJson(obj: unknown): JsonValue;
declare function stringToJson<T extends string | void>(this: T, param: string): JsonValue;
declare function jsonToString<T extends Record<string | number | symbol, unknown> | void>(this: T, param: JsonValue): string;
declare const sleep: (t: number) => Promise<void>;
declare const optionsOnlyOrList: <T>(param: T | T[], callback: (item: T, index?: number | undefined) => void) => void;
declare const optionsListOrCollection: <T>(param: {
    [key: string]: T;
} | T[], callback: (item: T, index?: string | undefined) => void) => void;
declare type ConditionString = string | string[] | RegExp | RegExp[] | undefined;
declare function checkStringIsEvery(value: string, condition: ConditionString): boolean;
declare function checkStringIsSome(value: string, condition: ConditionString): boolean;
declare function log(arg: unknown, ...args: unknown[]): unknown;

declare type AnyFunction = (...args: any[]) => any;
interface ClassConstructor extends Function {
    new (...args: any[]): any;
}

declare function isDarkMode(): boolean;
declare function isClass(value: unknown): value is ClassConstructor;
declare function isAsyncFunction(value: unknown): value is (...args: any[]) => Promise<any>;
declare function isArrayEmpty(value: unknown): value is Array<void>;
declare function isObjectEmpty(value: unknown): boolean;
declare function isBlobEmpty(value: unknown): boolean;
declare function isStringEmpty(value: unknown): boolean;
declare function isNumberEmpty(value: unknown): boolean;
declare function isEmpty(value: unknown): boolean;
declare function isTextIncludes(data: Array<string | RegExp>, text: string): boolean;
declare function isTextExcludes(data: Array<string | RegExp>, text: string): boolean;
declare function is<T extends ClassConstructor>(val: unknown, type: T): val is T;
declare function isArrayBufferView(data: unknown): data is ArrayBufferView;

declare class FileName {
    readonly data: string[];
    readonly ext: string;
    readonly name: string;
    constructor(name: string);
    transformUpperHumpCase(): string;
    transformLowerHumpCase(): string;
    transformKebabCase(): string;
    transformSnakeCase(): string;
}
declare function nameToUpperHumpCase(name: string): string;
declare function nameToLowerHumpCase(name: string): string;
declare function nameToKebabCase(name: string): string;
declare function nameToSnakeCase(name: string): string;
declare function createFileName(value: string): FileName;

declare type BufferArray = Array<number> | ArrayBuffer | ArrayBufferView | Buffer;
declare function bufferToString<T extends BufferArray | void>(this: T, param: BufferArray): string;

interface TreeHelperConfig {
    id: string;
    children: string;
    pid: string;
}
declare function listToTree<T = any>(list: any[], config?: Partial<TreeHelperConfig>): T[];
declare function treeToList<T = any>(tree: any, config?: Partial<TreeHelperConfig>): T;
declare function findNode<T = any>(tree: any, func: AnyFunction, config?: Partial<TreeHelperConfig>): T | null;
declare function findNodeAll<T = any>(tree: any, func: AnyFunction, config?: Partial<TreeHelperConfig>): T[];
declare function findPath<T = any>(tree: any, func: AnyFunction, config?: Partial<TreeHelperConfig>): T | T[] | null;
declare function findPathAll(tree: any, func: AnyFunction, config?: Partial<TreeHelperConfig>): any[];
declare function filter<T = any>(tree: T[], func: (n: T) => boolean, config?: Partial<TreeHelperConfig>): T[];
declare function forEach<T = any>(tree: T[], func: (n: T) => any, config?: Partial<TreeHelperConfig>): Promise<void>;
/**
 * @description: Extract tree specified structure
 */
declare function treeMap<T = any>(treeData: T[], opt: {
    children?: string;
    conversion: AnyFunction;
}): T[];
/**
 * @description: Extract tree specified structure
 */
declare function treeMapEach(data: any, { children, conversion, }: {
    children?: string;
    conversion: AnyFunction;
}): any;
declare function eachElementTree(treeDatas: Array<Element>, callBack: AnyFunction, parentNode?: {}): void;

declare function transformFileSize(value: unknown): number;
declare function getUrlObject(url: string): {
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    query: URLSearchParams;
    hash: string;
};

declare function uuid(): string;
declare function uuidDate(prefix?: string): string;

declare type StorageGetter = (value: string | null) => string;
declare type StorageSetter = (value: string) => string;
declare class StorageManager {
    private readonly storage;
    private instance;
    private lifecycle;
    private getter?;
    private setter?;
    constructor(storage: Storage);
    init(data: string[] | Record<string, string>): this;
    getInstance(): Record<string, string>;
    forEach(callback: (value: string, key: string) => void): void;
    useProxy(getter: StorageGetter, setter: StorageSetter): this;
    getItem(key: string): string | null;
    setItem(key: string, value: string, life?: number): this;
    extendLifecycle(key: string, life: number): this;
    clear(): this;
    removeItem(key: string): this;
}

declare function isBrowserSupported(key: string): boolean;
declare function urlToImageElement(url: string): Promise<HTMLImageElement>;
declare function imageToBase64(img: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap, type?: string): string;
declare function blobToBase64(blob: Blob): Promise<string>;
declare function base64toBlob(base64Buf: string, type?: string): Blob;

interface BaseValidateOption<M> {
    message?: string;
    messageOption?: Record<keyof M, string>;
}
declare type ValidateOption<V> = V & BaseValidateOption<V>;
declare type StringResult = string | string[] | null;
declare type ValidatorHandlerResult = Promise<StringResult> | StringResult;
declare type ValidatorHandler = (value: unknown, option?: ValidateOption<never>) => ValidatorHandlerResult;
interface ValidatorHandlerList {
    [k: string]: ValidatorHandler;
}
declare type ValidateField<V> = {
    [Type in keyof V]: ValidatorHandlerOption<V[Type]>;
};
declare type ValidatorValidOption<M, V> = {
    [K in keyof M]?: ValidateField<V>;
};
declare type ValidatorHandlerOption<F> = F extends (value: unknown, option: infer A) => ValidatorHandlerResult ? A : never;
interface ErrorMessages {
    [key: string]: string[] | null;
}
declare class Validator<M> {
    readonly validatorHandler: ValidatorHandlerList;
    private readonly model;
    private readonly validateOption?;
    readonly errors: {
        [K in keyof M]?: string[];
    };
    constructor(model: M, option?: ValidatorValidOption<M, ValidatorHandlerList>);
    validate(options?: ValidatorValidOption<M, ValidatorHandlerList>): Promise<ErrorMessages>;
    setValidatorHandler(name: string, handler: ValidatorHandler): void;
    validateField(value: unknown, options?: ValidateField<ValidatorHandlerList>): Promise<string[] | null>;
    errorsToArray(): string[];
    getErrors(): {
        [K in keyof M]?: string[];
    };
    isValid(field: keyof M): boolean;
}

/**
 * 清除拖拉顯示元素
 * @param {DragEvent} event
 */
declare function clearDragImage(event: DragEvent): void;
interface ViewportOffsetResult {
    left: number;
    top: number;
    right: number;
    bottom: number;
    rightIncludeBody: number;
    bottomIncludeBody: number;
}
declare function getBoundingClientRect(element: Element): DOMRect | number;
declare function getViewportOffset(element: Element): ViewportOffsetResult;
interface TransformStyle {
    rotate?: string;
    rotateX?: string;
    rotateY?: string;
    rotateZ?: string;
    scaleX?: string;
    scaleY?: string;
    scaleZ?: string;
    skewX?: string;
    skewY?: string;
    translateX?: string;
    translateY?: string;
    translateZ?: string;
}
declare function getTransformStyleString(transform: TransformStyle): string;

export { ConditionString, FileName, FormDataObject, FormDataValue, JsonObject, JsonValue, StorageGetter, StorageManager, StorageSetter, TransformStyle, ValidateField, ValidateOption, Validator, ValidatorHandler, ValidatorHandlerOption, ValidatorValidOption, ViewportOffsetResult, asyncAction, base64toBlob, blobToBase64, bufferToString, checkStringIsEvery, checkStringIsSome, clearDragImage, cloneJson, createFileName, eachElementTree, filter, findNode, findNodeAll, findPath, findPathAll, forEach, formDataFormat, formUrlEncodedFormat, getBoundingClientRect, getTransformStyleString, getUrlObject, getViewportOffset, imageToBase64, is, isArrayBufferView, isArrayEmpty, isAsyncFunction, isBlobEmpty, isBrowserSupported, isClass, isDarkMode, isEmpty, isNumberEmpty, isObjectEmpty, isStringEmpty, isTextExcludes, isTextIncludes, jsonToString, listToTree, log, nameToKebabCase, nameToLowerHumpCase, nameToSnakeCase, nameToUpperHumpCase, optionsListOrCollection, optionsOnlyOrList, sleep, stringToJson, transformFileSize, treeMap, treeMapEach, treeToList, urlToImageElement, uuid, uuidDate };
