'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

function asyncAction(funcs, initData) {
    return new Promise((resolve, reject) => {
        (async function () {
            let data = initData;
            for (let index = 0; index < funcs.length; index++) {
                const func = funcs[index];
                if (typeof func === "function") {
                    try {
                        data = await func(data);
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            }
            resolve(data);
        })();
    });
}

function formDataFormat(data) {
    const format = (obj, keys = []) => {
        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            const formName = [...keys, key]
                .map((k, i) => (i ? `[${k}]` : k))
                .join("");
            if (value instanceof Blob) {
                if (value instanceof File) {
                    formData.append(formName, value, value.name);
                }
                else {
                    formData.append(formName, value);
                }
            }
            else if (typeof value === "object" && value !== null) {
                const obj = value[key];
                format(obj, [...keys, key]);
            }
            else if (value !== undefined) {
                formData.append(formName, JSON.stringify(value));
            }
        });
    };
    const formData = new FormData();
    format(data);
    return formData;
}
function formUrlEncodedFormat(data) {
    const queryParams = new URLSearchParams();
    for (const key in data) {
        const value = data[key];
        if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v));
        }
        else if (typeof value === "object" && value !== null) {
            queryParams.append(key, JSON.stringify(value));
        }
        else {
            queryParams.append(key, String(value));
        }
    }
    return queryParams;
}
function cloneJson(obj) {
    try {
        return JSON.parse(JSON.stringify(obj === undefined ? null : obj));
    }
    catch (error) {
        return null;
    }
}
function stringToJson(param) {
    const data = typeof param !== "undefined" ? param : this;
    try {
        return typeof data === "string" ? JSON.parse(data) : null;
    }
    catch (error) {
        return null;
    }
}
function jsonToString(param) {
    const data = typeof param !== "undefined" ? param : this;
    return JSON.stringify(data);
}
const sleep = (t) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, t);
    });
};

function isDarkMode() {
    const mediaQuery = matchMedia("(prefers-color-scheme: dark)");
    return mediaQuery.matches;
}
function isClass(value) {
    return (Object.prototype.toString.call(value) === "[object Function]" &&
        typeof value === "function" &&
        "constructor" in value);
}
function isArrayEmpty(value) {
    return Array.isArray(value) && JSON.stringify(value.filter(Boolean)) === "[]";
}
function isObjectEmpty(value) {
    return (typeof value === "object" &&
        value !== null &&
        value.constructor === Object &&
        JSON.stringify(value) === "{}");
}
function isBlobEmpty(value) {
    return value instanceof Blob && (value.size === 0 || value.type === "");
}
function isStringEmpty(value) {
    return typeof value === "string" && /^\s*$/.test(value);
}
function isNumberEmpty(value) {
    return typeof value === "number" && isNaN(value);
}
function isEmpty(value) {
    if (value === undefined)
        return true;
    if (value === null)
        return true;
    if (isNumberEmpty(value))
        return true;
    if (isStringEmpty(value))
        return true;
    if (isArrayEmpty(value))
        return true;
    if (isObjectEmpty(value))
        return true;
    if (isBlobEmpty(value))
        return true;
    return false;
}
function isTextIncludes(data, text) {
    for (let index = 0; index < data.length; index++) {
        const value = data[index];
        if (value instanceof RegExp) {
            if (value.test(text))
                return true;
        }
        else {
            const reg = new RegExp(String(value));
            if (reg.test(text))
                return true;
        }
    }
    return false;
}
function isTextExcludes(data, text) {
    for (let index = 0; index < data.length; index++) {
        const value = data[index];
        if (value instanceof RegExp) {
            if (value.test(text))
                return false;
        }
        else {
            const reg = new RegExp(String(value));
            if (reg.test(text))
                return false;
        }
    }
    return true;
}
function is(val, type) {
    return Object.prototype.toString.call(val) === `[object ${type.name}]`;
}
function isArrayBufferView(data) {
    if ([
        Int8Array,
        Uint8Array,
        Uint8ClampedArray,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float64Array,
        BigInt64Array,
        BigUint64Array,
        DataView,
    ].some((type) => data instanceof type)) {
        return true;
    }
    return false;
}

function messageFormat(message, data) {
    let logMessage = message;
    for (const key in data) {
        const reg = new RegExp('{' + key + '}', 'g');
        logMessage = logMessage.replace(reg, () => data[key]);
    }
    return logMessage;
}
class HttpError extends Error {
    constructor(args = {}) {
        const message = args.message || '';
        super(message);
        this.status = args.status || 0;
        this.method = args.method?.toUpperCase() || 'GET';
        this.url = args.url || '';
    }
}
function handleErrorLog(error, data = {}) {
    if (error instanceof Error) {
        console.error(messageFormat(error.message, data));
    }
    if (typeof error === 'string') {
        console.error(messageFormat(error, data));
    }
}
function handleHttpErrorLog(error) {
    if (error instanceof HttpError) {
        console.error(`%s [%s] %s\n%s`, error.method || 'GET', error.status || 0, error.url || '', error.message);
        return error;
    }
    if (error instanceof Error) {
        handleErrorLog(error);
        return error;
    }
    return new Error('The function param name of error is not Error().');
}
function handleWarningLog(message, data = {}) {
    if (message instanceof Array) {
        console.error(...message);
    }
    if (typeof message === 'string') {
        console.warn(messageFormat(message, data));
    }
}

class FileName {
    constructor(name) {
        this.data = [];
        const last = name.lastIndexOf(".");
        this.ext = last >= 0 ? name.substring(last) : "";
        this.name = name.replace(this.ext, "");
        let index = this.data.push(this.name[0]);
        for (let i = 1; i < this.name.length; i++) {
            const str = this.name[i];
            switch (true) {
                case /\.|-|_|\s/.test(str):
                    i++;
                    index = this.data.push(this.name[i]);
                    break;
                case /[A-Z]/.test(str):
                    index = this.data.push(str);
                    break;
                default:
                    this.data[index - 1] += str;
            }
        }
    }
    transformUpperHumpCase() {
        return this.data
            .filter((s) => s)
            .map((s) => s[0].toUpperCase() + s.substring(1))
            .join("");
    }
    transformLowerHumpCase() {
        return this.data
            .filter((s) => s)
            .map((s, i) => {
            if (i === 0) {
                return s[0].toLowerCase() + s.substring(1);
            }
            return s[0].toUpperCase() + s.substring(1);
        })
            .join("");
    }
    transformKebabCase() {
        return this.data.join("-");
    }
    transformSnakeCase() {
        return this.data.join("_");
    }
}
function nameToUpperHumpCase(name) {
    return new FileName(name).transformUpperHumpCase();
}
function nameToLowerHumpCase(name) {
    return new FileName(name).transformLowerHumpCase();
}
function nameToKebabCase(name) {
    return new FileName(name).transformKebabCase();
}
function nameToSnakeCase(name) {
    return new FileName(name).transformSnakeCase();
}
function createFileName(value) {
    return new FileName(value);
}

function bufferToString(param) {
    const data = typeof param !== "undefined" ? param : this;
    if (data instanceof Array) {
        return String.fromCharCode.apply(null, data);
    }
    if (data instanceof Int8Array ||
        data instanceof Uint8Array ||
        data instanceof Int16Array) {
        return String.fromCharCode.apply(null, Array.from(data));
    }
    if (data instanceof ArrayBuffer) {
        return String.fromCharCode.apply(null, Array.from(new Uint8Array(data)));
    }
    return "";
}

const DEFAULT_CONFIG = {
    id: 'id',
    children: 'children',
    pid: 'pid',
};
const getConfig = (config) => Object.assign({}, DEFAULT_CONFIG, config);
// tree from list
function listToTree(list, config = {}) {
    const conf = getConfig(config);
    const nodeMap = new Map();
    const result = [];
    const { id, children, pid } = conf;
    for (const node of list) {
        node[children] = node[children] || [];
        nodeMap.set(node[id], node);
    }
    for (const node of list) {
        const parent = nodeMap.get(node[pid]);
        (parent ? parent[children] : result).push(node);
    }
    return result;
}
function treeToList(tree, config = {}) {
    config = getConfig(config);
    const { children } = config;
    const result = [...tree];
    for (let i = 0; i < result.length; i++) {
        if (!result[i][children])
            continue;
        result.splice(i + 1, 0, ...result[i][children]);
    }
    return result;
}
function findNode(tree, func, config = {}) {
    config = getConfig(config);
    const { children } = config;
    const list = [...tree];
    for (const node of list) {
        if (func(node))
            return node;
        node[children] && list.push(...node[children]);
    }
    return null;
}
function findNodeAll(tree, func, config = {}) {
    config = getConfig(config);
    const { children } = config;
    const list = [...tree];
    const result = [];
    for (const node of list) {
        func(node) && result.push(node);
        node[children] && list.push(...node[children]);
    }
    return result;
}
function findPath(tree, func, config = {}) {
    config = getConfig(config);
    const path = [];
    const list = [...tree];
    const visitedSet = new Set();
    const { children } = config;
    while (list.length) {
        const node = list[0];
        if (visitedSet.has(node)) {
            path.pop();
            list.shift();
        }
        else {
            visitedSet.add(node);
            node[children] && list.unshift(...node[children]);
            path.push(node);
            if (func(node)) {
                return path;
            }
        }
    }
    return null;
}
function findPathAll(tree, func, config = {}) {
    config = getConfig(config);
    const path = [];
    const list = [...tree];
    const result = [];
    const visitedSet = new Set(), { children } = config;
    while (list.length) {
        const node = list[0];
        if (visitedSet.has(node)) {
            path.pop();
            list.shift();
        }
        else {
            visitedSet.add(node);
            node[children] && list.unshift(...node[children]);
            path.push(node);
            func(node) && result.push([...path]);
        }
    }
    return result;
}
function filter(tree, func, config = {}) {
    config = getConfig(config);
    const children = config.children;
    function listFilter(list) {
        return list
            .map((node) => ({ ...node }))
            .filter((node) => {
            node[children] = node[children] && listFilter(node[children]);
            return func(node) || (node[children] && node[children].length);
        });
    }
    return listFilter(tree);
}
function forEach(tree, func, config = {}) {
    config = getConfig(config);
    const list = [...tree];
    const { children } = config;
    for (let i = 0; i < list.length; i++) {
        //func 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿
        if (func(list[i])) {
            return;
        }
        children && list[i][children] && list.splice(i + 1, 0, ...list[i][children]);
    }
}
/**
 * @description: Extract tree specified structure
 */
function treeMap(treeData, opt) {
    return treeData.map((item) => treeMapEach(item, opt));
}
/**
 * @description: Extract tree specified structure
 */
function treeMapEach(data, { children = 'children', conversion }) {
    const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
    const conversionData = conversion(data) || {};
    if (haveChildren) {
        return {
            ...conversionData,
            [children]: data[children].map((i) => treeMapEach(i, {
                children,
                conversion,
            })),
        };
    }
    else {
        return {
            ...conversionData,
        };
    }
}
/**
 * 递归遍历树结构
 * @param treeDatas 树
 * @param callBack 回调
 * @param parentNode 父节点
 */
function eachTree(treeDatas, callBack, parentNode = {}) {
    treeDatas.forEach((element) => {
        const newNode = callBack(element, parentNode) || element;
        if (element.children) {
            eachTree(element.children, callBack, newNode);
        }
    });
}

function transformFileSize(value) {
    if (typeof value === "string") {
        const size = value.replace(/\s+/g, "").toUpperCase();
        if (/KB$/.test(size)) {
            const num = Number(size.replace(/KB$/, ""));
            return num * 10 ** 3;
        }
        if (/MB$/.test(size)) {
            const num = Number(size.replace(/MB$/, ""));
            return num * 10 ** 6;
        }
        if (/GB$/.test(size)) {
            const num = Number(size.replace(/GB$/, ""));
            return num * 10 ** 9;
        }
        if (/TB$/.test(size)) {
            const num = Number(size.replace(/TB$/, ""));
            return num * 10 ** 12;
        }
        return Number(size);
    }
    if (typeof value === "number") {
        return value;
    }
    return NaN;
}

const hexList = [];
for (let i = 0; i <= 15; i++) {
    hexList[i] = i.toString(16);
}
function uuid() {
    let uuid = "";
    for (let i = 1; i <= 36; i++) {
        if (i === 9 || i === 14 || i === 19 || i === 24) {
            uuid += "-";
        }
        else if (i === 15) {
            uuid += 4;
        }
        else if (i === 20) {
            uuid += hexList[(Math.random() * 4) | 8];
        }
        else {
            uuid += hexList[(Math.random() * 16) | 0];
        }
    }
    return uuid.replace(/-/g, "");
}
let unique = 0;
function uuidDate(prefix = "") {
    const time = Date.now();
    const random = Math.floor(Math.random() * 1000000000);
    unique++;
    return prefix + "_" + random + unique + String(time);
}

class FileModel {
    constructor(args) {
        this.url = args.url;
        this.root = args.root;
        this.base = args.base;
        this.name = args.name;
        this.ext = args.ext;
        this.dir = args.ext;
        this.size = args.size;
        this.createTime = args.createTime;
        this.updateTime = args.updateTime;
    }
}
class DirectoryModel {
    constructor(args) {
        this.url = args.url;
        this.root = args.root;
        this.base = args.base;
        this.name = args.name;
        this.ext = args.ext;
        this.dir = args.ext;
        this.child = args.children;
    }
}
const readDirectory = async function (dir, filePath, callback) {
    return await Promise.all(dir.map((file) => readFileTree(path__default["default"].join(filePath, file), callback)));
};
const readFileTree = async function (url, callback) {
    const ParsedPath = path__default["default"].parse(url);
    const stat = await fs__default["default"].promises.stat(url);
    if (stat.isFile()) {
        const fileData = new FileModel({
            url,
            ...ParsedPath,
            size: stat.size,
            createTime: stat.birthtime,
            updateTime: stat.mtime,
        });
        if (callback)
            await callback(url, fileData);
        return fileData;
    }
    else {
        const dir = await fs__default["default"].promises.readdir(url);
        const children = await readDirectory(dir, url, callback);
        const dirData = new DirectoryModel({ url, ...ParsedPath, children });
        if (callback)
            await callback(url, dirData);
        return dirData;
    }
};

exports.DirectoryModel = DirectoryModel;
exports.FileModel = FileModel;
exports.FileName = FileName;
exports.HttpError = HttpError;
exports.asyncAction = asyncAction;
exports.bufferToString = bufferToString;
exports.cloneJson = cloneJson;
exports.createFileName = createFileName;
exports.eachTree = eachTree;
exports.filter = filter;
exports.findNode = findNode;
exports.findNodeAll = findNodeAll;
exports.findPath = findPath;
exports.findPathAll = findPathAll;
exports.forEach = forEach;
exports.formDataFormat = formDataFormat;
exports.formUrlEncodedFormat = formUrlEncodedFormat;
exports.handleErrorLog = handleErrorLog;
exports.handleHttpErrorLog = handleHttpErrorLog;
exports.handleWarningLog = handleWarningLog;
exports.is = is;
exports.isArrayBufferView = isArrayBufferView;
exports.isArrayEmpty = isArrayEmpty;
exports.isBlobEmpty = isBlobEmpty;
exports.isClass = isClass;
exports.isDarkMode = isDarkMode;
exports.isEmpty = isEmpty;
exports.isNumberEmpty = isNumberEmpty;
exports.isObjectEmpty = isObjectEmpty;
exports.isStringEmpty = isStringEmpty;
exports.isTextExcludes = isTextExcludes;
exports.isTextIncludes = isTextIncludes;
exports.jsonToString = jsonToString;
exports.listToTree = listToTree;
exports.messageFormat = messageFormat;
exports.nameToKebabCase = nameToKebabCase;
exports.nameToLowerHumpCase = nameToLowerHumpCase;
exports.nameToSnakeCase = nameToSnakeCase;
exports.nameToUpperHumpCase = nameToUpperHumpCase;
exports.readDirectory = readDirectory;
exports.readFileTree = readFileTree;
exports.sleep = sleep;
exports.stringToJson = stringToJson;
exports.transformFileSize = transformFileSize;
exports.treeMap = treeMap;
exports.treeMapEach = treeMapEach;
exports.treeToList = treeToList;
exports.uuid = uuid;
exports.uuidDate = uuidDate;
