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
const optionsOnlyOrList = function (param, callback) {
    if (Array.isArray(param)) {
        param.forEach((item, index) => callback(item, index));
    }
    else {
        callback(param);
    }
};
const optionsListOrCollection = function (param, callback) {
    if (Array.isArray(param)) {
        param.forEach((item, index) => callback(item, String(index)));
    }
    else {
        Object.keys(param).forEach((key) => callback(param[key], key));
    }
};
function checkStringIsEvery(value, condition) {
    const bools = [];
    optionsOnlyOrList(condition, (item) => {
        if (typeof item === "string") {
            bools.push(value.includes(item));
        }
        else if (item instanceof RegExp) {
            bools.push(item.test(value));
        }
        else {
            bools.push(false);
        }
    });
    return bools.every(Boolean);
}
function checkStringIsSome(value, condition) {
    const bools = [];
    optionsOnlyOrList(condition, (item) => {
        if (typeof item === "string") {
            bools.push(value.includes(item));
        }
        else if (item instanceof RegExp) {
            bools.push(item.test(value));
        }
        else {
            bools.push(false);
        }
    });
    return bools.some(Boolean);
}
function log(arg, ...args) {
    if (typeof arg === "object" && arg) {
        console.dir(arg);
        return arg;
    }
    console.log(arg, ...args);
    return arg;
}

function isDarkMode() {
    const mediaQuery = matchMedia("(prefers-color-scheme: dark)");
    return mediaQuery.matches;
}
function isClass(value) {
    return (Object.prototype.toString.call(value) === "[object Function]" &&
        typeof value === "function" &&
        "constructor" in value);
}
function isAsyncFunction(value) {
    return Object.prototype.toString.call(value) === "[object AsyncFunction]";
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
    id: "id",
    children: "children",
    pid: "pid",
};
const getConfig = (config) => {
    return Object.assign({}, DEFAULT_CONFIG, config);
};
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
async function forEach(tree, func, config = {}) {
    config = getConfig(config);
    const list = [...tree];
    const { children } = config;
    for (let i = 0; i < list.length; i++) {
        if (isAsyncFunction(func)) {
            if (await func(list[i])) {
                return;
            }
        }
        else {
            const result = func(list[i]);
            if (result instanceof Promise && (await result)) {
                return;
            }
            else if (result) {
                return;
            }
        }
        children &&
            list[i][children] &&
            list.splice(i + 1, 0, ...list[i][children]);
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
function treeMapEach(data, { children = "children", conversion, }) {
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
function eachElementTree(treeDatas, callBack, parentNode = {}) {
    treeDatas.forEach((element) => {
        const newNode = callBack(element, parentNode) || element;
        if (element.children) {
            eachElementTree(Array.from(element.children), callBack, newNode);
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
function getUrlObject(url) {
    const [u1, u2] = url.split(/:\/\//);
    const protocol = u2 ? u1 : "";
    const [u3, ...u4] = protocol ? u2.split("/") : u1.split("/");
    const host = protocol ? u3 : "";
    const u5 = protocol ? [...u4] : [u3, ...u4];
    const [hostname, port] = host ? host.split(":") : ["", ""];
    const [pathname, params] = u5.join("/").split("?");
    const [search, hash] = params ? params.split("#") : ["", ""];
    return {
        protocol: protocol || location.protocol.replace(/:$/, ""),
        hostname: hostname || location.hostname,
        port: port || location.port || "",
        pathname,
        query: new URLSearchParams(search || ""),
        hash: hash || "",
    };
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

const isFileNotEmpty = function (file) {
    return is(file, FileModel) || is(file, DirectoryModel);
};
class FileModel {
    constructor(args) {
        this.url = args.url;
        const parsedPath = path__default["default"].parse(args.url);
        this.root = args.root || parsedPath.root;
        this.base = args.base || parsedPath.base;
        this.name = args.name || parsedPath.name;
        this.ext = args.ext || parsedPath.ext;
        this.dir = args.dir || parsedPath.dir;
        this.size = args.size || 0;
        this.createTime = args.createTime || new Date();
        this.updateTime = args.updateTime || new Date();
        this.data = args.data || Buffer.from("");
    }
    createFile() {
        try {
            return fs__default["default"].promises.writeFile(this.url, this.data);
        }
        catch (error) {
            console.error(error);
        }
    }
    async readFile() {
        try {
            this.data = await fs__default["default"].promises.readFile(this.url);
        }
        catch (error) {
            console.error(error);
        }
        return this.data;
    }
    async renameFile(name) {
        try {
            await fs__default["default"].promises.rename(this.url, this.dir + name);
            this.name = name;
        }
        catch (error) {
            console.error(error);
        }
    }
    async writeFile(data) {
        try {
            await fs__default["default"].promises.writeFile(this.url, data);
            this.data = await fs__default["default"].promises.readFile(this.url);
        }
        catch (error) {
            console.error(error);
        }
    }
}
class DirectoryModel {
    constructor(args) {
        this.url = args.url;
        const parsedPath = path__default["default"].parse(args.url);
        this.root = args.root || parsedPath.root;
        this.base = args.base || parsedPath.base;
        this.name = args.name || parsedPath.name;
        this.ext = args.ext || parsedPath.ext;
        this.dir = args.dir || parsedPath.dir;
        this.children = args.children ? [...args.children] : [];
    }
    createFolder() {
        try {
            return fs__default["default"].promises.mkdir(this.url);
        }
        catch (error) {
            console.error(error);
        }
    }
    async renameFolder(name) {
        try {
            await fs__default["default"].promises.rename(this.url, path__default["default"].join(this.dir, name));
            this.name = name;
        }
        catch (error) {
            console.error(error);
        }
    }
    async removeFile(name, options) {
        try {
            const url = path__default["default"].join(this.dir, name);
            await fs__default["default"].promises.rm(url, options);
            const index = this.children.map((f) => f.url).indexOf(url);
            return this.children.splice(index, 1)[0];
        }
        catch (error) {
            console.error(error);
        }
    }
    async removeFolder(name) {
        try {
            const url = path__default["default"].join(this.dir, name);
            await fs__default["default"].promises.mkdir(path__default["default"].join(this.dir, name), { recursive: true });
            const index = this.children.map((f) => f.url).indexOf(url);
            return this.children.splice(index, 1)[0];
        }
        catch (error) {
            console.error(error);
        }
    }
    eachReadFolder(callback) {
        return forEach(this.children, callback);
    }
}
const readDirectory = async function (url, options) {
    const dir = await fs__default["default"].promises.readdir(url);
    if (!fs__default["default"].existsSync(url)) {
        console.error(`There are no files for "${url}".`);
        return null;
    }
    const dirData = await Promise.all(dir.map((file) => readFileTree(path__default["default"].join(url, file), options)));
    return dirData.filter(isFileNotEmpty);
};
const readFileTree = async function (url, options) {
    const { readFile, readDir, ignore } = options || {};
    if (checkStringIsSome(url, ignore)) {
        return null;
    }
    if (!fs__default["default"].existsSync(url)) {
        console.error(`There are no files for "${url}".`);
        return null;
    }
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
        if (readFile) {
            const result = await readFile(url, fileData);
            if (result instanceof FileModel)
                return result;
        }
        return fileData;
    }
    else {
        const children = await readDirectory(url, options);
        const dirData = new DirectoryModel({
            url,
            ...ParsedPath,
            children: children || [],
        });
        if (readDir) {
            const result = await readDir(url, dirData);
            if (result instanceof DirectoryModel)
                return result;
        }
        return dirData;
    }
};

exports.ConsoleColors = void 0;
(function (ConsoleColors) {
    ConsoleColors["Reset"] = "\u001B[0m";
    ConsoleColors["Bright"] = "\u001B[1m";
    ConsoleColors["Dim"] = "\u001B[2m";
    ConsoleColors["Underscore"] = "\u001B[4m";
    ConsoleColors["Blink"] = "\u001B[5m";
    ConsoleColors["Reverse"] = "\u001B[7m";
    ConsoleColors["Hidden"] = "\u001B[8m";
    ConsoleColors["FgBlack"] = "\u001B[30m";
    ConsoleColors["FgRed"] = "\u001B[31m";
    ConsoleColors["FgGreen"] = "\u001B[32m";
    ConsoleColors["FgYellow"] = "\u001B[33m";
    ConsoleColors["FgBlue"] = "\u001B[34m";
    ConsoleColors["FgMagenta"] = "\u001B[35m";
    ConsoleColors["FgCyan"] = "\u001B[36m";
    ConsoleColors["FgWhite"] = "\u001B[37m";
    ConsoleColors["BgBlack"] = "\u001B[40m";
    ConsoleColors["BgRed"] = "\u001B[41m";
    ConsoleColors["BgGreen"] = "\u001B[42m";
    ConsoleColors["BgYellow"] = "\u001B[43m";
    ConsoleColors["BgBlue"] = "\u001B[44m";
    ConsoleColors["BgMagenta"] = "\u001B[45m";
    ConsoleColors["BgCyan"] = "\u001B[46m";
    ConsoleColors["BgWhite"] = "\u001B[47m";
})(exports.ConsoleColors || (exports.ConsoleColors = {}));

exports.DirectoryModel = DirectoryModel;
exports.FileModel = FileModel;
exports.FileName = FileName;
exports.asyncAction = asyncAction;
exports.bufferToString = bufferToString;
exports.checkStringIsEvery = checkStringIsEvery;
exports.checkStringIsSome = checkStringIsSome;
exports.cloneJson = cloneJson;
exports.createFileName = createFileName;
exports.eachElementTree = eachElementTree;
exports.filter = filter;
exports.findNode = findNode;
exports.findNodeAll = findNodeAll;
exports.findPath = findPath;
exports.findPathAll = findPathAll;
exports.forEach = forEach;
exports.formDataFormat = formDataFormat;
exports.formUrlEncodedFormat = formUrlEncodedFormat;
exports.getUrlObject = getUrlObject;
exports.is = is;
exports.isArrayBufferView = isArrayBufferView;
exports.isArrayEmpty = isArrayEmpty;
exports.isAsyncFunction = isAsyncFunction;
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
exports.log = log;
exports.nameToKebabCase = nameToKebabCase;
exports.nameToLowerHumpCase = nameToLowerHumpCase;
exports.nameToSnakeCase = nameToSnakeCase;
exports.nameToUpperHumpCase = nameToUpperHumpCase;
exports.optionsListOrCollection = optionsListOrCollection;
exports.optionsOnlyOrList = optionsOnlyOrList;
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
