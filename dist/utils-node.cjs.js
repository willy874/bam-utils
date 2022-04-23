'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function asyncAction(funcs, initData) {
    return new Promise((resolve, reject) => {
        (async function () {
            let data = initData;
            for (let index = 0; index < funcs.length; index++) {
                const func = funcs[index];
                if (typeof func === 'function') {
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
            const formName = [...keys, key].map((k, i) => (i ? `[${k}]` : k)).join('');
            if (value instanceof Blob) {
                if (value instanceof File) {
                    formData.append(formName, value, value.name);
                }
                else {
                    formData.append(formName, value);
                }
            }
            else if (typeof value === 'object' && value !== null) {
                const obj = value[key];
                format(obj, [...keys, key]);
            }
            else if (value !== undefined) {
                formData.append(formName, String(value));
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
        else if (typeof value === 'object') {
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
        return JSON.parse(JSON.stringify(obj));
    }
    catch (error) {
        return null;
    }
}

function isDarkMode() {
    const mediaQuery = matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches;
}
function isClass(value) {
    return Object.prototype.toString.call(value) === '[object Function]' && typeof value === 'function' && 'constructor' in value;
}
function isArrayEmpty(value) {
    return Array.isArray(value) && JSON.stringify(value.filter(Boolean)) === '[]';
}
function isObjectEmpty(value) {
    return typeof value === 'object' && value !== null && value.constructor === Object && JSON.stringify(value) === '{}';
}
function isBlobEmpty(value) {
    return value instanceof Blob && (value.size === 0 || value.type === '');
}
function isStringEmpty(value) {
    return typeof value === 'string' && /^\s*$/.test(value);
}
function isNumberEmpty(value) {
    return typeof value === 'number' && isNaN(value);
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

function base64toBlob(base64Buf, type) {
    const arr = base64Buf.split(',');
    const mime = (() => {
        if (/^data:(\w|\/)+;base64/.test(base64Buf) && arr[0]) {
            const mineRegexp = arr[0].match(/:(.*?);/);
            return mineRegexp ? mineRegexp[1] : '';
        }
        else {
            return type || '';
        }
    })();
    const bstr = window.atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    if (!mime) {
        throw new Error('Mime is not type.');
    }
    return new Blob([u8arr], { type: mime });
}
async function blobToBase64(blob) {
    let binary = '';
    const blobText = await blob.text();
    for (let i = 0; i < blobText.length; i++) {
        binary += String.fromCharCode(blobText.charCodeAt(i) & 255);
    }
    return 'data:' + blob.type + ';base64,' + window.btoa(binary);
}

class FileName {
    constructor(name) {
        this.data = [];
        const last = name.lastIndexOf('.');
        this.ext = last >= 0 ? name.substring(last) : '';
        this.name = name.replace(this.ext, '');
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
    transformUpperHump() {
        return this.data
            .filter((s) => s)
            .map((s) => s[0].toUpperCase() + s.substring(1))
            .join('');
    }
    transformLowerHump() {
        return this.data
            .filter((s) => s)
            .map((s, i) => {
            if (i === 0) {
                return s[0].toLowerCase() + s.substring(1);
            }
            return s[0].toUpperCase() + s.substring(1);
        })
            .join('');
    }
    transformKebabCase() {
        return this.data.join('-');
    }
    transformSnakeCase() {
        return this.data.join('_');
    }
}

exports.FileName = FileName;
exports.HttpError = HttpError;
exports.asyncAction = asyncAction;
exports.base64toBlob = base64toBlob;
exports.blobToBase64 = blobToBase64;
exports.cloneJson = cloneJson;
exports.formDataFormat = formDataFormat;
exports.formUrlEncodedFormat = formUrlEncodedFormat;
exports.handleErrorLog = handleErrorLog;
exports.handleHttpErrorLog = handleHttpErrorLog;
exports.handleWarningLog = handleWarningLog;
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
exports.messageFormat = messageFormat;
