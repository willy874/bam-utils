export type AnyFunction = (...args: any[]) => any;

export type UnknownFunction = (...args: unknown[]) => unknown;

export interface ClassConstructor extends Function {
  new (...args: any[]): any;
}
