import { stringToRegExp } from "../rexexp";
import { asyncAction } from "../async";

export function assignRequest(
  req: Request,
  options: RequestInit & { url: string; body: BodyInit | null }
) {
  return new Request(options.url, {
    body: options.body,
    cache: options.cache || req.cache,
    credentials: options.credentials || req.credentials,
    headers: new Headers(options.headers || req.headers),
    integrity: options.integrity || req.integrity,
    keepalive: options.keepalive || req.keepalive,
    method: options.method || req.method,
    mode: options.mode || req.mode,
    redirect: options.redirect || req.redirect,
    referrer: options.referrer || req.referrer,
    referrerPolicy: options.referrerPolicy || req.referrerPolicy,
    signal: options.signal || req.signal,
  });
}

export function resolveHeader(
  headers: HeadersInit | Record<string, any>
): Record<string, string> {
  const result: Record<string, string> = {};
  if (headers instanceof Headers) {
    headers.forEach((key, value) => {
      result[key] = value;
    });
  } else if (headers instanceof Array) {
    headers.forEach(([key, value]) => {
      result[key] = value;
    });
  } else {
    Object.keys(headers).forEach((key) => {
      result[key] =
        typeof headers[key] === "object"
          ? JSON.stringify(headers[key])
          : headers[key];
    });
  }
  return result;
}

export function getUrlParamsFormat(
  url: string,
  params: Record<string, string> = {}
) {
  let u = url;
  for (const key in params) {
    const value = params[key];
    u = u.replace(new RegExp(`{${stringToRegExp(key)}}`), value);
  }
  return u.replace(/\/+/g, "/");
}

type HttpRequestUrl = {
  protocol: string;
  hostname: string;
  port: string | number;
  pathname: string;
  params?: Record<string, string>;
  query?: URLSearchParams;
};

type RequestMiddleware = (req?: Request) => Promise<Request>;
type ResponseMiddleware = (res?: HttpResponse) => Promise<HttpResponse>;
type RequestErrorMiddleware = (
  err?: HttpError<Request>
) => Promise<HttpError<Request>>;
type ResponseErrorMiddleware = (
  err?: HttpError<Response>
) => Promise<HttpError<Response>>;

export enum MiddlewareType {
  RequestSuccess = "RequestSuccess",
  ResponseSuccess = "ResponseSuccess",
  RequestError = "RequestError",
  ResponseError = "ResponseError",
}

export class HttpRequest {
  private request: Request;
  private body: BodyInit | null;
  private url: HttpRequestUrl;
  private requestMiddleware: RequestMiddleware[] = [];
  private responseMiddleware: ResponseMiddleware[] = [];
  private requestErrorMiddleware: RequestErrorMiddleware[] = [];
  private responseErrorMiddleware: ResponseErrorMiddleware[] = [];

  constructor(input?: RequestInfo, init?: RequestInit) {
    this.request = new Request(input || "", init);
    this.body = init && init.body ? init.body : null;
    this.url = {
      protocol: location.protocol,
      hostname: location.hostname,
      port: location.port,
      pathname: location.pathname,
    };
    this.setUrl(this.request.url);
  }

  private get uri() {
    const protocol = this.url.protocol.replace(/:$/, "");
    const port = Number(this.url.port) ? ":" + this.url.port : "";
    const pathname = getUrlParamsFormat(this.url.pathname, this.url.params);
    const query = String(this.url.query) ? "?" + this.url.query : "";
    const path = "/" + pathname.replace(/^\//, "");
    return `${protocol}://${this.url.hostname}${port}${path}${query}`;
  }

  async send<T>(
    this: HttpRequest,
    resolve?: (res: HttpResponse) => Promise<T>,
    reject?: (
      err: HttpError<Request | Response>
    ) => Promise<HttpError<Request | Response>>
  ) {
    let req = this.request;
    let res = new HttpResponse(
      req,
      new Response(null, { headers: req.headers })
    );
    let isResponse = false;
    try {
      req = await asyncAction<Request>(this.requestMiddleware, req);
      const fetchResponse = await fetch(req);
      isResponse = true;
      res = new HttpResponse(req, fetchResponse);
      try {
        this.fetchHandler(res.response);
        res = await asyncAction<HttpResponse>(this.responseMiddleware, res);
        return resolve ? await resolve(res) : res;
      } catch (info) {
        throw new Error((info as Error).message);
      }
    } catch (info) {
      const error = info as Error;
      let result;
      if (isResponse) {
        result = await asyncAction<HttpError<Request>>(
          this.requestErrorMiddleware,
          new HttpError<Request>(error, res.request)
        );
      } else {
        result = await asyncAction<HttpError<Response>>(
          this.responseErrorMiddleware,
          new HttpError<Response>(error, res.response)
        );
      }
      return reject ? await reject(result) : result;
    }
  }

  async fetchHandler(res: Response) {
    let message = "";
    function isResult(val: unknown): val is { message: string } {
      return Boolean(val && typeof val === "object" && "message" in val);
    }
    if (!res.ok) {
      try {
        const data = await res.json();
        if (isResult(data)) {
          message = data.message;
        }
        throw new Error();
      } catch (error) {
        message = await res.text();
      }
      throw new Error(message);
    }
  }

  middleware(
    type: MiddlewareType.RequestSuccess,
    ...middleware: RequestMiddleware[]
  ): HttpRequest;
  middleware(
    type: MiddlewareType.RequestError,
    ...middleware: RequestMiddleware[]
  ): HttpRequest;
  middleware(
    type: MiddlewareType.ResponseSuccess,
    ...middleware: RequestMiddleware[]
  ): HttpRequest;
  middleware(
    type: MiddlewareType.ResponseError,
    ...middleware: RequestMiddleware[]
  ): HttpRequest;
  middleware(type: MiddlewareType, ...args: any) {
    switch (type) {
      case MiddlewareType.RequestSuccess:
        this.requestMiddleware.push(...args);
        break;
      case MiddlewareType.RequestError:
        this.requestErrorMiddleware.push(...args);
        break;
      case MiddlewareType.ResponseSuccess:
        this.responseMiddleware.push(...args);
        break;
      case MiddlewareType.ResponseError:
        this.responseErrorMiddleware.push(...args);
        break;
    }
    return this;
  }

  clone() {
    return this.request.clone();
  }

  assign(options: RequestInit & { url?: string }) {
    const req = this.request;
    this.request = assignRequest(req, {
      ...options,
      url: options.url || req.url,
      body: this.body,
    });
    return this;
  }

  setHeader(
    headers: HeadersInit | Record<string, any> | ((h: Headers) => void)
  ) {
    const result: Record<string, string> = resolveHeader(this.request.headers);
    if (typeof headers === "function") {
      headers(this.request.headers);
    } else if (headers instanceof Headers) {
      headers.forEach((key, value) => {
        result[key] = value;
      });
    } else if (headers instanceof Array) {
      headers.forEach(([key, value]) => {
        result[key] = value;
      });
    } else {
      Object.keys(headers).forEach((key) => {
        result[key] =
          typeof headers[key] === "object"
            ? JSON.stringify(headers[key])
            : headers[key];
      });
    }
    this.assign({ headers: result });
    return this;
  }

  setMethod(method: string) {
    this.assign({ method });
    return this;
  }

  setUrl(
    url:
      | string
      | URL
      | Partial<HttpRequestUrl>
      | ((u: HttpRequestUrl) => HttpRequestUrl)
  ) {
    if (typeof url === "function") {
      url(this.url);
    } else if (typeof url === "string") {
      const targetUrl = new URL(url);
      this.url = {
        protocol: targetUrl.protocol,
        hostname: targetUrl.hostname,
        port: targetUrl.port,
        pathname: targetUrl.pathname,
      };
    } else if (url instanceof URL) {
      this.url = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
      };
    } else {
      if (url.protocol) this.url.protocol = url.protocol;
      if (url.hostname) this.url.hostname = url.hostname;
      if (url.port) this.url.port = url.port;
      if (url.pathname) this.url.pathname = url.pathname;
    }
    this.assign({ url: this.uri });
    return this;
  }

  setQuery(
    query?:
      | string
      | URLSearchParams
      | [string, string][]
      | Record<string, string>
      | undefined
  ) {
    this.url.query = new URLSearchParams(query);
    return this;
  }

  setParams(params: Record<string, string> | [string, string][]) {
    const result: Record<string, string> = this.url.params || {};
    if (params instanceof Array) {
      params.forEach(([key, value]) => {
        result[key] = value;
      });
    } else {
      Object.keys(params).forEach((key) => {
        result[key] =
          typeof params[key] === "object"
            ? JSON.stringify(params[key])
            : params[key];
      });
    }
    this.url.params = result;
    return this;
  }
}

export class HttpResponse<T = unknown> {
  isHttpError = false;
  request: Request;
  response: Response;
  constructor(req: Request, res: Response) {
    this.request = req;
    this.response = res;
  }

  json(): Promise<T> {
    return this.response.json();
  }

  text(): Promise<string> {
    return this.response.text();
  }
}

export class HttpError<T> extends Error {
  isHttpError = true;
  http?: T;

  constructor(error: Error | HttpError<T>, http?: T) {
    super(error.message);
    this.name = error.name;
    this.stack = error.stack;
    this.http = http;
  }
}

export function isHttpSuccess(
  value: HttpResponse | HttpError<any>
): value is HttpResponse {
  return value.isHttpError === false;
}

export function isHttpRequestError(
  value: HttpError<unknown>
): value is HttpError<Request> {
  return value.http instanceof Request;
}

export function isHttpResponseError(
  value: HttpError<unknown>
): value is HttpError<Response> {
  return value.http instanceof Response;
}

export function httpObservable(url: string) {
  return new HttpRequest(url);
}
