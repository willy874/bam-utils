export function transformFileSize(value: unknown): number {
  if (typeof value === "string") {
    const size = value.replace(/\s+/g, "").toUpperCase();
    if (/KB$/.test(size)) {
      const num = Number(size.replace(/KB$/, ""));
      return num * 10 ** 3;
    }
    if (/MB$/.test(size)) {
      const num = Number(size.replace(/MB$/, ""));
      return num * 10 ** 6;
    }
    if (/GB$/.test(size)) {
      const num = Number(size.replace(/GB$/, ""));
      return num * 10 ** 9;
    }
    if (/TB$/.test(size)) {
      const num = Number(size.replace(/TB$/, ""));
      return num * 10 ** 12;
    }
    return Number(size);
  }
  if (typeof value === "number") {
    return value;
  }
  return NaN;
}

export function getUrlObject(url: string) {
  const [u1, u2] = url.split(/:\/\//);
  const protocol = u2 ? u1 : "";
  const [u3, ...u4] = protocol ? u2.split("/") : u1.split("/");
  const host = protocol ? u3 : "";
  const u5 = protocol ? [...u4] : [u3, ...u4];
  const [hostname, port] = host ? host.split(":") : ["", ""];
  const [pathname, params] = u5.join("/").split("?");
  const [search, hash] = params ? params.split("#") : ["", ""];
  return {
    protocol: protocol || location.protocol.replace(/:$/, ""),
    hostname: hostname || location.hostname,
    port: port || location.port || "",
    pathname,
    query: new URLSearchParams(search || ""),
    hash: hash || "",
  };
}
