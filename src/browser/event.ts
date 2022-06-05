export class EventBus {
  // collection: Record<any, (e: Event) => any> = {};
  collection: { [K in symbol]: any } = { [Symbol("")]: "" };

  on(
    type: string,
    callback: (e: Event) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    const symbol = Symbol(type);
    window.addEventListener(type, { handleEvent: callback }, options);
  }
}
