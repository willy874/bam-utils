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

// multipart
// { ContentType, boundary }
// str.replace(/^(\n|\n\r|\s)*/, '').replace(/(\n|\n\r|\s)*$/, '').split(boundary).filter(Boolean).map(s => s.split(/\; /))
