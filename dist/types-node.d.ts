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

interface ParsedPath {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
}
interface IFileModel extends ParsedPath {
    url: string;
    size: number;
    createTime: Date;
    updateTime: Date;
}
declare class FileModel {
    url: string;
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
    size: number;
    createTime: Date;
    updateTime: Date;
    constructor(args: IFileModel);
}
interface IDirectoryModel extends ParsedPath {
    url: string;
    children: Array<FileModel | DirectoryModel>;
}
declare class DirectoryModel {
    url: string;
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
    child: Array<FileModel | DirectoryModel>;
    constructor(args: IDirectoryModel);
}
declare type ReadFileCallback<T> = (url: string, fileData: FileModel | DirectoryModel) => T;
declare const readDirectory: <T>(dir: string[], filePath: string, callback?: ReadFileCallback<T> | undefined) => Promise<Array<FileModel | DirectoryModel>>;
declare const readFileTree: <T>(url: string, callback?: ReadFileCallback<T> | undefined) => Promise<FileModel | DirectoryModel>;

export { DirectoryModel, FileModel, FileName, FormDataObject, FormDataValue, HttpError, IDirectoryModel, IFileModel, JsonObject, JsonValue, ReadFileCallback, asyncAction, bufferToString, cloneJson, createFileName, eachTree, filter, findNode, findNodeAll, findPath, findPathAll, forEach, formDataFormat, formUrlEncodedFormat, handleErrorLog, handleHttpErrorLog, handleWarningLog, is, isArrayBufferView, isArrayEmpty, isBlobEmpty, isClass, isDarkMode, isEmpty, isNumberEmpty, isObjectEmpty, isStringEmpty, isTextExcludes, isTextIncludes, jsonToString, listToTree, messageFormat, nameToKebabCase, nameToLowerHumpCase, nameToSnakeCase, nameToUpperHumpCase, readDirectory, readFileTree, stringToJson, transformFileSize, treeMap, treeMapEach, treeToList, uuid, uuidDate };
