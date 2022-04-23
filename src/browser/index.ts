export function isHeaders(data: unknown): data is Headers {
  return typeof Headers !== "undefined" && data instanceof Headers;
}

export function isRequest(data: unknown): data is Request {
  return typeof Request !== "undefined" && data instanceof Request;
}

export function isResponse(data: unknown): data is Response {
  return typeof Response !== "undefined" && data instanceof Response;
}

export function isBrowserSupported(key: string): boolean {
  return typeof Window !== "undefined" && key in window;
}
