import { ParsedPath } from 'path';
import { RmOptions } from 'fs';
import { Stream } from 'stream';

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

interface IFileModel extends Partial<ParsedPath> {
    url: string;
    size?: number;
    createTime?: Date;
    updateTime?: Date;
    data?: Buffer;
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
    data: Buffer;
    constructor(args: IFileModel);
    createFile(): Promise<void> | undefined;
    readFile(): Promise<Buffer>;
    renameFile(name: string): Promise<void>;
    writeFile(data: string | NodeJS.ArrayBufferView | Stream): Promise<void>;
}
interface IDirectoryModel extends Partial<ParsedPath> {
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
    children: Array<FileModel | DirectoryModel>;
    constructor(args: IDirectoryModel);
    createFolder(): Promise<void> | undefined;
    renameFolder(name: string): Promise<void>;
    removeFile(name: string, options?: RmOptions): Promise<FileModel | DirectoryModel | undefined>;
    removeFolder(name: string): Promise<FileModel | DirectoryModel | undefined>;
    eachReadFolder(callback: (n: DirectoryModel | FileModel) => Promise<void>): Promise<void>;
}
declare type ReadFileCallback = (url: string, fileData: FileModel) => FileModel | void;
declare type ReadDirCallback = (url: string, fileData: DirectoryModel) => DirectoryModel | void;
interface ReadFileTreeOptions {
    readFile?: ReadFileCallback;
    readDir?: ReadDirCallback;
    ignore?: string | string[] | RegExp | RegExp[];
}
declare const readDirectory: (url: string, options?: Partial<ReadFileTreeOptions> | undefined) => Promise<Array<FileModel | DirectoryModel> | null>;
declare const readFileTree: (url: string, options?: Partial<ReadFileTreeOptions> | undefined) => Promise<FileModel | DirectoryModel | null>;

declare enum ConsoleColors {
    Reset = "\u001B[0m",
    Bright = "\u001B[1m",
    Dim = "\u001B[2m",
    Underscore = "\u001B[4m",
    Blink = "\u001B[5m",
    Reverse = "\u001B[7m",
    Hidden = "\u001B[8m",
    FgBlack = "\u001B[30m",
    FgRed = "\u001B[31m",
    FgGreen = "\u001B[32m",
    FgYellow = "\u001B[33m",
    FgBlue = "\u001B[34m",
    FgMagenta = "\u001B[35m",
    FgCyan = "\u001B[36m",
    FgWhite = "\u001B[37m",
    BgBlack = "\u001B[40m",
    BgRed = "\u001B[41m",
    BgGreen = "\u001B[42m",
    BgYellow = "\u001B[43m",
    BgBlue = "\u001B[44m",
    BgMagenta = "\u001B[45m",
    BgCyan = "\u001B[46m",
    BgWhite = "\u001B[47m"
}

export { ConditionString, ConsoleColors, DirectoryModel, FileModel, FileName, FormDataObject, FormDataValue, IDirectoryModel, IFileModel, JsonObject, JsonValue, ReadDirCallback, ReadFileCallback, asyncAction, bufferToString, checkStringIsEvery, checkStringIsSome, cloneJson, createFileName, eachElementTree, filter, findNode, findNodeAll, findPath, findPathAll, forEach, formDataFormat, formUrlEncodedFormat, getUrlObject, is, isArrayBufferView, isArrayEmpty, isAsyncFunction, isBlobEmpty, isClass, isDarkMode, isEmpty, isNumberEmpty, isObjectEmpty, isStringEmpty, isTextExcludes, isTextIncludes, jsonToString, listToTree, log, nameToKebabCase, nameToLowerHumpCase, nameToSnakeCase, nameToUpperHumpCase, optionsListOrCollection, optionsOnlyOrList, readDirectory, readFileTree, sleep, stringToJson, transformFileSize, treeMap, treeMapEach, treeToList, uuid, uuidDate };
