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

export { FileName, FormDataObject, FormDataValue, HttpError, JsonObject, JsonValue, asyncAction, base64toBlob, blobToBase64, cloneJson, formDataFormat, formUrlEncodedFormat, handleErrorLog, handleHttpErrorLog, handleWarningLog, isArrayEmpty, isBlobEmpty, isClass, isDarkMode, isEmpty, isNumberEmpty, isObjectEmpty, isStringEmpty, isTextExcludes, isTextIncludes, messageFormat };
