import { HttpRequestUrl, HttpRequestUrlInit } from "./url";
import { resolveRecord } from "../record";
import { JsonObject } from "../types";

type HttpRequestConfig = RequestInit;

type HttpRequestInit = HttpRequestConfig & { url: string };

type HttpRequestMiddleware = (req: Request) => Promise<Request>;

function resolveRequest(options?: HttpRequestConfig): HttpRequestConfig {
  const ops = options || {};
  return {
    body: ops.body ? ops.body : null,
    cache: ops.cache ? ops.cache : "default",
    credentials: ops.credentials ? ops.credentials : "same-origin",
    headers: ops.headers ? ops.headers : new Headers(),
    integrity: ops.integrity ? ops.integrity : "",
    keepalive: Boolean(ops.keepalive),
    method: ops.method ? ops.method : "GET",
    mode: ops.mode ? ops.mode : "cors",
    redirect: ops.redirect ? ops.redirect : "follow",
    referrer: ops.referrer ? ops.referrer : "about:client",
    referrerPolicy: ops.referrerPolicy ? ops.referrerPolicy : "",
    signal: ops.signal ? ops.signal : null,
  };
}

export class HttpRequest {
  private config: HttpRequestConfig;
  private url: HttpRequestUrl;
  private middleware: HttpRequestMiddleware[] = [];
  constructor(init: RequestInfo | HttpRequestInit | HttpRequest) {
    if (typeof init === "string") {
      this.url = new HttpRequestUrl(init);
      this.config = resolveRequest();
    } else if (init instanceof HttpRequest) {
      this.url = new HttpRequestUrl(init.url);
      this.config = resolveRequest(init.config);
      this.middleware = init.middleware;
    } else {
      this.url = new HttpRequestUrl(init.url);
      this.config = resolveRequest(init);
    }
  }

  group(handler: (req: HttpRequest) => HttpRequest) {
    return handler(this);
  }

  setRequest(req: HttpRequestConfig | Request) {
    this.config = resolveRequest(req);
    return new HttpRequest(this);
  }

  setMethod(method: string) {
    this.config.method = method;
    return new HttpRequest(this);
  }

  setBody(
    body:
      | ReadableStream<Uint8Array>
      | Blob
      | BufferSource
      | FormData
      | URLSearchParams
      | string
  ) {
    this.config.body = body;
    return new HttpRequest(this);
  }

  setHeader(
    headers: HeadersInit | Record<string, any> | ((h: Headers) => void)
  ) {
    this.config.headers = resolveRecord(headers);
    return new HttpRequest(this);
  }

  appendHeader(
    headers: HeadersInit | Record<string, any> | ((h: Headers) => void)
  ) {
    this.config.headers = resolveRecord(headers, this.config.headers);
    return new HttpRequest(this);
  }

  setUrl(url: string | Partial<HttpRequestUrlInit>) {
    this.url = new HttpRequestUrl(url);
    return new HttpRequest(this);
  }

  appendUrl(url: string) {
    this.url.appendUrl(url);
    return new HttpRequest(this);
  }

  setParams(
    params:
      | Record<string, string>
      | [string, string][]
      | ((p: Record<string, string>) => Record<string, string>)
  ) {
    this.url.setParams(params);
    return new HttpRequest(this);
  }

  appendParams(
    params:
      | Record<string, string>
      | [string, string][]
      | ((p: Record<string, string>) => Record<string, string>)
  ) {
    this.url.appendParams(params);
    return new HttpRequest(this);
  }

  setQuery(
    query:
      | string
      | URLSearchParams
      | [string, string][]
      | Record<string, string>
  ) {
    this.url.setQuery(query);
    return new HttpRequest(this);
  }

  appendQuery(
    query:
      | string
      | URLSearchParams
      | [string, string][]
      | Record<string, string>
  ) {
    this.url.appendQuery(query);
    return new HttpRequest(this);
  }

  setMiddleware<T extends HttpRequestMiddleware>(fn: T | T[]) {
    const fns: T[] = [];
    if (Array.isArray(fn)) {
      fns.push(...fn);
    } else {
      fns.push(fn);
    }
    this.middleware = fns;
    return new HttpRequest(this);
  }

  async responseHandler(res: HttpResponse): Promise<HttpResponse> {
    const request = res.request;
    const response = res.response;
    if (!response) {
      throw new HttpError(new Error(), request, response);
    }
    return res;
  }

  async send(configuration?: HttpRequestConfig): Promise<HttpResponse> {
    let req: Request | null = null;
    let res: Response | null = null;
    try {
      const config = Object.assign({}, this.config, configuration || {});
      req = new Request(this.url.toString(), config);
      for (let index = 0; index < this.middleware.length; index++) {
        const middleware = this.middleware[index];
        req = await middleware(req);
      }
      res = await fetch(req);
    } catch (error) {
      throw new HttpError(error, req, res);
    }
    const response = new HttpResponse(req, res);
    return await this.responseHandler(response);
  }
}

export class HttpError extends Error {
  isCreateRequest = false;
  isSendRequest = false;
  request: Request | null = null;
  response: Response | null = null;
  constructor(error: Error, req?: Request | null, res?: Response | null) {
    super(error.message);
    if (req) {
      this.isCreateRequest = true;
      this.request = req;
    }
    if (res) {
      this.isSendRequest = true;
      this.response = res;
    }
  }
}

class ResponseCondition {
  static isJson(response: Response) {
    return /^\s*application\/json/.test(
      response.headers.get("Content-Type") || ""
    );
  }
}

export class HttpResponse {
  config: HttpRequestConfig;
  request: Request;
  response: Response | null;
  constructor(req: Request, res: Response | null) {
    this.request = req;
    this.response = res;
    this.config = resolveRequest(req);
  }

  auto(): Promise<any> {
    if (this.response) {
      if (ResponseCondition.isJson(this.response)) {
        return this.json();
      }
    }
    throw new Error("The response is not successfully.");
  }

  json<T extends JsonObject>(): Promise<T> {
    if (this.response) {
      return this.response.json();
    }
    throw new Error("The response is not successfully.");
  }
}
