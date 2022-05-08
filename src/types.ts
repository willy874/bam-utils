export type AnyFunction = (...args: any[]) => any;

export type UnknownFunction = (...args: unknown[]) => unknown;

export interface ClassConstructor {
  readonly name: string;
  new (...args: any[]): any;
}
