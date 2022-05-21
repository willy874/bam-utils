export interface JsonObject {
  [k: string]: JsonValue;
}

export type JsonValue = null | boolean | string | number | JsonObject;

export interface FormDataObject {
  [k: string]: FormDataValue;
}

export type FormDataValue = JsonValue | Blob | FormDataObject;

export function formDataFormat(data: FormDataObject): FormData {
  const format = (obj: FormDataObject, keys: string[] = []) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const formName = [...keys, key]
        .map((k, i) => (i ? `[${k}]` : k))
        .join("");
      if (value instanceof Blob) {
        if (value instanceof File) {
          formData.append(formName, value, value.name);
        } else {
          formData.append(formName, value);
        }
      } else if (typeof value === "object" && value !== null) {
        const obj = value[key] as FormDataObject;
        format(obj, [...keys, key]);
      } else if (value !== undefined) {
        formData.append(formName, JSON.stringify(value));
      }
    });
  };
  const formData = new FormData();
  format(data);
  return formData;
}

export function formUrlEncodedFormat(data: JsonObject): URLSearchParams {
  const queryParams = new URLSearchParams();
  for (const key in data) {
    const value = data[key];
    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(key, v));
    } else if (typeof value === "object" && value !== null) {
      queryParams.append(key, JSON.stringify(value));
    } else {
      queryParams.append(key, String(value));
    }
  }
  return queryParams;
}

export function cloneJson(obj: unknown): JsonValue {
  try {
    return JSON.parse(JSON.stringify(obj === undefined ? null : obj));
  } catch (error) {
    return null;
  }
}

export function stringToJson<T extends string | void>(
  this: T,
  param: string
): JsonValue {
  const data = typeof param !== "undefined" ? param : this;
  try {
    return typeof data === "string" ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

export function jsonToString<
  T extends Record<string | number | symbol, unknown> | void
>(this: T, param: JsonValue): string {
  const data = typeof param !== "undefined" ? param : this;
  return JSON.stringify(data);
}

export const sleep = (t: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
};

export const optionsOnlyOrList = function <T>(
  param: T | T[],
  callback: (item: T, index?: number) => void
) {
  if (Array.isArray(param)) {
    param.forEach((item, index) => callback(item, index));
  } else {
    callback(param);
  }
};

export const optionsListOrCollection = function <T>(
  param: T[] | { [key: string]: T },
  callback: (item: T, index?: string) => void
) {
  if (Array.isArray(param)) {
    param.forEach((item, index) => callback(item, String(index)));
  } else {
    Object.keys(param).forEach((key) => callback(param[key], key));
  }
};

export type ConditionString = string | string[] | RegExp | RegExp[] | undefined;

export function checkStringIsEvery(value: string, condition: ConditionString) {
  const bools: boolean[] = [];
  optionsOnlyOrList(condition, (item) => {
    if (typeof item === "string") {
      bools.push(value.includes(item));
    } else if (item instanceof RegExp) {
      bools.push(item.test(value));
    } else {
      bools.push(false);
    }
  });
  return bools.every(Boolean);
}

export function checkStringIsSome(value: string, condition: ConditionString) {
  const bools: boolean[] = [];
  optionsOnlyOrList(condition, (item) => {
    if (typeof item === "string") {
      bools.push(value.includes(item));
    } else if (item instanceof RegExp) {
      bools.push(item.test(value));
    } else {
      bools.push(false);
    }
  });
  return bools.some(Boolean);
}
