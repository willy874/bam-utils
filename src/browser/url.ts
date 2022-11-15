import { stringToRegExp } from "../rexexp";
import { resolveRecord } from "../record";

export type HttpRequestUrlInit = {
  baseUrl: string;
  protocol: string;
  hostname: string;
  port: string | number;
  pathname: string;
  params: Record<string, string>;
  query: string[][] | Record<string, string> | string | URLSearchParams;
};

export class HttpRequestUrl {
  baseUrl = "";
  protocol: string;
  hostname: string;
  port: string | number;
  pathname: string;
  search = "";
  hash = "";
  params: Record<string, string> = {};
  query = new URLSearchParams();

  constructor(url: string | Partial<HttpRequestUrlInit>) {
    if (typeof Location === "undefined") {
      throw new Error("The Location is not defined.");
    }
    if (typeof URLSearchParams === "undefined") {
      throw new Error("The URLSearchParams is not defined.");
    }
    this.protocol = location.protocol.replace(/:$/, "");
    this.hostname = location.hostname;
    this.port = location.port.replace(/:/, "");
    this.pathname = location.pathname;
    if (typeof url === "string") {
      const { protocol, hostname, port, pathname, search, query, hash } =
        this.createUrl(url);
      this.protocol = protocol;
      this.hostname = hostname;
      this.port = port;
      this.pathname = pathname;
      this.search = search;
      this.query = query;
      this.hash = hash;
    } else {
      if (url.baseUrl) this.baseUrl = url.baseUrl;
      if (url.protocol) this.protocol = url.protocol;
      if (url.hostname) this.hostname = url.hostname;
      if (url.port) this.port = url.port;
      if (url.pathname) this.pathname = url.pathname;
      if (url.query) {
        this.query = new URLSearchParams(url.query);
        this.search = this.query.toString();
      }
    }
  }

  setParams(
    params:
      | Record<string, string>
      | [string, string][]
      | ((p: Record<string, string>) => Record<string, string>)
  ) {
    this.params = resolveRecord(params);
  }

  appendParams(
    params:
      | Record<string, string>
      | [string, string][]
      | ((p: Record<string, string>) => Record<string, string>)
  ) {
    this.params = resolveRecord(params, this.params);
  }

  setQuery(
    query:
      | string
      | URLSearchParams
      | [string, string][]
      | Record<string, string>
  ) {
    this.query = new URLSearchParams(query);
  }

  appendQuery(
    query:
      | string
      | URLSearchParams
      | [string, string][]
      | Record<string, string>
  ) {
    new URLSearchParams(query).forEach((key, value) => {
      this.query.append(key, value);
    });
  }

  createUrl(url: string) {
    let protocol = location.protocol.replace(/:$/, "");
    let hostname = location.hostname;
    let port = location.port.replace(/:/, "");
    let pathname = location.pathname;
    let search = "";
    let query = new URLSearchParams();
    let hash = "";

    let str = url;
    if (/^[a-zA-Z]+:\/\//.test(url)) {
      const [u1, u2] = str.split(/:\/\//);
      const [u3, ...u4] = u2.split("/");
      const [u5, u6] = u3.split(":");
      protocol = u1;
      hostname = u5;
      port = u6;
      str = "/" + u4.join("/").replace(/\/$/, "");
    }
    if (/^\//.test(str)) {
      pathname = str;
    }
    if (/^\.\//.test(str)) {
      pathname += str.replace(/\./, "");
    }
    if (/^\.\.\//.test(str)) {
      const prev = pathname.replace(/\/\S+\/$/, "/");
      pathname = prev + str.replace(/\./, "");
    }
    if (/\S\?\W/.test(str)) {
      const match = str.match(/\S\?\W/);
      if (match && match.index) {
        const prefix = str[match.index];
        const suffix = str[match.index + 2];
        if (prefix && suffix) {
          const [u1, u2] = prefix + str.split(/\S\?\W/) + suffix;
          str = u1;
          pathname = u1;
          search = u2;
          query = new URLSearchParams("?" + u2);
        }
      }
    }
    if (/#/.test(str)) {
      const [u1, u2] = str.split("#");
      str = u1;
      hash = u2;
    }
    return {
      protocol,
      hostname,
      port,
      pathname,
      search,
      query,
      hash,
    };
  }

  appendUrl(url: string) {
    this.pathname = this.pathname + "/" + url.replace(/^\//, "/");
  }

  getPathname() {
    return Object.keys(this.params)
      .reduce((url, key) => {
        return url.replace(
          new RegExp(`:${stringToRegExp(key)}\\?`),
          this.params[key]
        );
      }, this.pathname)
      .replace(/\/+/g, "/")
      .replace(/^\/|\/$/, "");
  }

  toString() {
    const protocol = this.protocol;
    const hostname = this.hostname;
    const port = Number(this.port) ? ":" + this.port : "";
    const pathname = this.getPathname();
    const query = String(this.query || "") ? "?" + this.query : "";
    if (this.baseUrl) {
      return `${this.baseUrl}/${pathname}${query}`;
    }
    return `${protocol}://${hostname}${port}/${pathname}${query}`;
  }
}
