declare type AsyncFunction = (...args: unknown[]) => Promise<unknown>;
declare function asyncAction(funcs: AsyncFunction[], initData?: unknown): Promise<unknown>;

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

declare function isDarkMode(): boolean;
declare function isClass(value: unknown): value is DateConstructor;
declare function isArrayEmpty(value: unknown): value is Array<void>;
declare function isObjectEmpty(value: unknown): boolean;
declare function isBlobEmpty(value: unknown): boolean;
declare function isStringEmpty(value: unknown): boolean;
declare function isNumberEmpty(value: unknown): boolean;
declare function isEmpty(value: unknown): boolean;
declare function isTextIncludes(data: Array<string | RegExp>, text: string): boolean;
declare function isTextExcludes(data: Array<string | RegExp>, text: string): boolean;
declare function is<T extends DateConstructor>(val: unknown, type: T): val is T;
declare function isArrayBufferView(data: unknown): data is ArrayBufferView;

declare function messageFormat(message: string, data: Record<string, string>): string;
interface HttpErrorOption {
    message?: string;
    status?: number;
    url?: string;
    method?: string;
}
declare class HttpError extends Error {
    status: number;
    method: string;
    url: string;
    constructor(args?: HttpErrorOption);
}
declare function handleErrorLog(error: unknown, data?: Record<string, string>): void;
declare function handleHttpErrorLog(error: unknown): Error | HttpError;
declare function handleWarningLog(message: string | string[], data?: Record<string, string>): void;

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
declare function findNode<T = any>(tree: any, func: Function, config?: Partial<TreeHelperConfig>): T | null;
declare function findNodeAll<T = any>(tree: any, func: Function, config?: Partial<TreeHelperConfig>): T[];
declare function findPath<T = any>(tree: any, func: Function, config?: Partial<TreeHelperConfig>): T | T[] | null;
declare function findPathAll(tree: any, func: Function, config?: Partial<TreeHelperConfig>): any[];
declare function filter<T = any>(tree: T[], func: (n: T) => boolean, config?: Partial<TreeHelperConfig>): T[];
declare function forEach<T = any>(tree: T[], func: (n: T) => any, config?: Partial<TreeHelperConfig>): void;
/**
 * @description: Extract tree specified structure
 */
declare function treeMap<T = any>(treeData: T[], opt: {
    children?: string;
    conversion: Function;
}): T[];
/**
 * @description: Extract tree specified structure
 */
declare function treeMapEach(data: any, { children, conversion }: {
    children?: string;
    conversion: Function;
}): any;
/**
 * 递归遍历树结构
 * @param treeDatas 树
 * @param callBack 回调
 * @param parentNode 父节点
 */
declare function eachTree(treeDatas: any[], callBack: Function, parentNode?: {}): void;

declare function transformFileSize(value: unknown): number;

declare function uuid(): string;
declare function uuidDate(prefix?: string): string;

declare function isHeaders(data: unknown): data is Headers;
declare function isRequest(data: unknown): data is Request;
declare function isResponse(data: unknown): data is Response;
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

export { FileName, FormDataObject, FormDataValue, HttpError, JsonObject, JsonValue, TransformStyle, ValidateField, ValidateOption, Validator, ValidatorHandler, ValidatorHandlerOption, ValidatorValidOption, ViewportOffsetResult, asyncAction, base64toBlob, blobToBase64, bufferToString, clearDragImage, cloneJson, createFileName, eachTree, filter, findNode, findNodeAll, findPath, findPathAll, forEach, formDataFormat, formUrlEncodedFormat, getBoundingClientRect, getTransformStyleString, getViewportOffset, handleErrorLog, handleHttpErrorLog, handleWarningLog, imageToBase64, is, isArrayBufferView, isArrayEmpty, isBlobEmpty, isBrowserSupported, isClass, isDarkMode, isEmpty, isHeaders, isNumberEmpty, isObjectEmpty, isRequest, isResponse, isStringEmpty, isTextExcludes, isTextIncludes, jsonToString, listToTree, messageFormat, nameToKebabCase, nameToLowerHumpCase, nameToSnakeCase, nameToUpperHumpCase, sleep, stringToJson, transformFileSize, treeMap, treeMapEach, treeToList, urlToImageElement, uuid, uuidDate };
