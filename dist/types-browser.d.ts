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
declare function cloneJson(obj: unknown): JsonObject | null;

declare function isDarkMode(): boolean;
declare function isClass(value: unknown): boolean;
declare function isArrayEmpty(value: unknown): boolean;
declare function isObjectEmpty(value: unknown): boolean;
declare function isBlobEmpty(value: unknown): boolean;
declare function isStringEmpty(value: unknown): boolean;
declare function isNumberEmpty(value: unknown): boolean;
declare function isEmpty(value: unknown): boolean;
declare function isTextIncludes(data: Array<string | RegExp>, text: string): boolean;
declare function isTextExcludes(data: Array<string | RegExp>, text: string): boolean;

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

declare function base64toBlob(base64Buf: string, type?: string): Blob;
declare function blobToBase64(blob: Blob): Promise<string>;

declare class FileName {
    readonly data: string[];
    readonly ext: string;
    readonly name: string;
    constructor(name: string);
    transformUpperHump(): string;
    transformLowerHump(): string;
    transformKebabCase(): string;
    transformSnakeCase(): string;
}

interface DeviceInfoInfo {
    isApp: boolean;
    merchant: string;
    version: string;
    platform: string;
}
declare function isApp(): DeviceInfoInfo | boolean;

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

export { DeviceInfoInfo, FileName, FormDataObject, FormDataValue, HttpError, JsonObject, JsonValue, TransformStyle, ViewportOffsetResult, asyncAction, base64toBlob, blobToBase64, clearDragImage, cloneJson, formDataFormat, formUrlEncodedFormat, getBoundingClientRect, getTransformStyleString, getViewportOffset, handleErrorLog, handleHttpErrorLog, handleWarningLog, isApp, isArrayEmpty, isBlobEmpty, isClass, isDarkMode, isEmpty, isNumberEmpty, isObjectEmpty, isStringEmpty, isTextExcludes, isTextIncludes, messageFormat };
