import { uuid } from "../uuid";

export const eventCollection: { [K in string]: (e: CustomEvent) => any } = {};

export class EventBus {
  static on(
    type: string,
    callback: (e: any) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    const symbol = uuid();
    eventCollection[symbol] = (e: CustomEvent<unknown>) => callback(e.detail);
    window.addEventListener(
      type,
      { handleEvent: eventCollection[symbol] },
      options
    );
    return symbol;
  }

  static off(
    type: string,
    symbol: string,
    options?: boolean | EventListenerOptions
  ) {
    const callback = eventCollection[symbol];
    if (callback) {
      window.removeEventListener(type, { handleEvent: callback }, options);
      delete eventCollection[symbol];
      return true;
    }
    return false;
  }

  static emit<T>(type: string, options?: T) {
    const event = new CustomEvent<T>(type, { detail: options });
    window.dispatchEvent(event);
  }
}
