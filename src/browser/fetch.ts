import { stringToRegExp } from "../rexexp";
import { asyncAction } from "../async";
import { getUrlObject } from "../transform";

export function assignRequest(
  req: Request,
  options: RequestInit & { url: string }
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
  query: URLSearchParams;
};

type Middleware<T> = (p: T) => Promise<T> | T;

export enum MiddlewareType {
  RequestSuccess = "RequestSuccess",
  ResponseSuccess = "ResponseSuccess",
  RequestError = "RequestError",
  ResponseError = "ResponseError",
}

type HttpRequestInit = RequestInit & { url: string };

export class HttpRequest {
  private request: Request;
  private url: HttpRequestUrl;
  private requestMiddleware: Middleware<Request>[] = [];
  private responseMiddleware: Middleware<HttpResponse>[] = [];
  private requestErrorMiddleware: Middleware<HttpError<Request>>[] = [];
  private responseErrorMiddleware: Middleware<HttpError<Response>>[] = [];

  constructor(options: RequestInfo | HttpRequestInit | HttpRequest) {
    if (typeof options === "string") {
      this.url = getUrlObject(options);
      this.request = new Request(this.uri);
    } else if (options instanceof Request) {
      this.request = new Request(options);
      this.url = getUrlObject(this.request.url);
    } else if (options instanceof HttpRequest) {
      this.request = new Request(options.request);
      this.url = options.url;
      this.requestMiddleware = [...options.requestMiddleware];
      this.responseMiddleware = [...options.responseMiddleware];
      this.requestErrorMiddleware = [...options.requestErrorMiddleware];
      this.responseErrorMiddleware = [...options.responseErrorMiddleware];
    } else {
      this.url = getUrlObject(options.url);
      const input: Partial<HttpRequestInit> = { ...options };
      delete input.url;
      this.request = new Request(this.uri, input);
    }
  }

  private get uri() {
    const protocol = this.url.protocol.replace(/:$/, "");
    const port = Number(this.url.port) ? ":" + this.url.port : "";
    const pathname = getUrlParamsFormat(this.url.pathname, this.url.params);
    const query = String(this.url.query || "") ? "?" + this.url.query : "";
    const path = "/" + pathname.replace(/^\//, "");
    return `${protocol}://${this.url.hostname}${port}${path}${query}`;
  }

  async send() {
    return new Promise((resolve, reject) => {
      (async () => {
        let req = this.request;
        let res = new HttpResponse(
          req,
          new Response(null, { headers: req.headers })
        );
        let isResponse = false;
        try {
          req = await asyncAction<Middleware<Request>>(
            this.requestMiddleware,
            req
          );
          const fetchResponse = await fetch(req);
          isResponse = true;
          res = new HttpResponse(req, fetchResponse);
          try {
            res = await asyncAction(this.responseMiddleware, res);
            await resolve(res);
          } catch (info) {
            throw new Error((info as Error).message);
          }
        } catch (info) {
          const error = info as Error;
          let result;
          if (isResponse) {
            result = await asyncAction(
              this.requestErrorMiddleware,
              new HttpError<Request>(error, req)
            );
          } else {
            result = await asyncAction(
              this.responseErrorMiddleware,
              new HttpError<Response>(error, res)
            );
          }
          reject(result);
        }
      })();
    });
  }

  // eslint-disable-next-line prettier/prettier
  middleware(
    type: MiddlewareType.RequestSuccess,
    ...middleware: Middleware<Request>[]
  ): HttpRequest;
  // eslint-disable-next-line prettier/prettier
  middleware(
    type: MiddlewareType.RequestError,
    ...middleware: Middleware<HttpError<Request>>[]
  ): HttpRequest;
  // eslint-disable-next-line prettier/prettier
  middleware(
    type: MiddlewareType.ResponseSuccess,
    ...middleware: Middleware<Response>[]
  ): HttpRequest;
  // eslint-disable-next-line prettier/prettier
  middleware(
    type: MiddlewareType.ResponseError,
    ...middleware: Middleware<HttpError<Response>>[]
  ): HttpRequest;
  middleware<M extends Middleware<any>>(
    type: MiddlewareType,
    ...args: M[]
  ): HttpRequest {
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
    return new HttpRequest(this);
  }

  assign(options: RequestInit & { url?: string }) {
    const req = this.request;
    this.request = assignRequest(req, {
      ...options,
      url: options.url || req.url,
    });
    return new HttpRequest(this);
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
    return this.assign({ headers: result });
  }

  setMethod(method: string) {
    return this.assign({ method: method.toUpperCase() });
  }

  // eslint-disable-next-line prettier/prettier
  setBody(
    body:
      | ReadableStream<Uint8Array>
      | Blob
      | BufferSource
      | FormData
      | URLSearchParams
      | string
  ) {
    const method = this.request.method.toUpperCase();
    if (["GET", "HEAD"].includes(method)) {
      throw new Error(`[HTTP ERROR]${method} body is not allowed.`);
    }
    return this.assign({ body });
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
      this.url = getUrlObject(url);
    } else if (url instanceof URL) {
      this.url = {
        protocol: url.protocol.replace(/:$/, ""),
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        query: new URLSearchParams(url.search),
      };
    } else {
      if (url.protocol) this.url.protocol = url.protocol.replace(/:$/, "");
      if (url.hostname) this.url.hostname = url.hostname;
      if (url.port) this.url.port = url.port;
      if (url.pathname) this.url.pathname = url.pathname;
    }
    return this.assign({ url: this.uri });
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
    return this.assign({ url: this.uri });
  }

  appendQuery(
    query?:
      | string
      | URLSearchParams
      | [string, string][]
      | Record<string, string>
      | undefined
  ) {
    new URLSearchParams(query).forEach((key, value) => {
      this.url.query.append(key, value);
    });
    return this.assign({ url: this.uri });
  }

  setParams(params: Record<string, string> | [string, string][]) {
    const result: Record<string, string> = this.url.params || {};
    if (params instanceof Array) {
      params.forEach(([value, key]) => {
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
    return this.assign({ url: this.uri });
  }
}

export class HttpResponse extends Response {
  isHttpError = false;
  request: Request;
  constructor(req: Request, res: Response) {
    super(res.body, {
      headers: res.headers,
      status: res.status,
      statusText: res.statusText,
    });
    this.request = req;
  }

  static json<T = unknown>(res: Response): Promise<T> {
    return res.json();
  }

  static blob(res: Response): Promise<Blob> {
    return res.blob();
  }
}

export class HttpError<T> extends Error {
  isHttpError = true;
  http: T;

  constructor(error: Error | HttpError<T>, http: T) {
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

export function isHttpError(value: HttpError<any>): value is HttpError<any> {
  return value.http instanceof HttpError;
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
