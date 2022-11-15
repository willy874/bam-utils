import { isIterable } from "./condition";

type RecordInit<T = unknown> =
  | Record<string, T>
  | [string, T][]
  | ((record: Record<string, T>) => void);

export function resolveRecord<T = unknown>(
  record: RecordInit<T>,
  before?: RecordInit<T>
) {
  const result: Record<string, T> = before ? resolveRecord(before) : {};
  if (typeof record === "function") {
    record(result);
  } else if (record instanceof Array) {
    record.forEach(([key, value]) => {
      result[key] = value;
    });
  } else if (isIterable(record)) {
    for (const [key, value] of record) {
      result[key] = value;
    }
  } else if (record && typeof record === "object") {
    for (const key in record) {
      result[key] = record[key];
    }
  }
  return result;
}
