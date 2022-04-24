type BufferArray = Array<number> | ArrayBuffer | ArrayBufferView | Buffer;

export function bufferToString<T extends BufferArray | void>(
  this: T,
  param: BufferArray
): string {
  const data = typeof param !== "undefined" ? param : this;
  if (data instanceof Array) {
    return String.fromCharCode.apply(null, data);
  }
  if (
    data instanceof Int8Array ||
    data instanceof Uint8Array ||
    data instanceof Int16Array
  ) {
    return String.fromCharCode.apply(null, Array.from(data));
  }
  if (data instanceof ArrayBuffer) {
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(data)));
  }
  return "";
}
