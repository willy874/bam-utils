export class FileName {
  readonly data: string[] = [];
  readonly ext: string;
  readonly name: string;

  constructor(name: string) {
    const last = name.lastIndexOf(".");
    this.ext = last >= 0 ? name.substring(last) : "";
    this.name = name.replace(this.ext, "");
    let index = this.data.push(this.name[0]);
    for (let i = 1; i < this.name.length; i++) {
      const str = this.name[i];
      switch (true) {
        case /\.|-|_|\s/.test(str):
          i++;
          index = this.data.push(this.name[i]);
          break;
        case /[A-Z]/.test(str):
          index = this.data.push(str);
          break;
        default:
          this.data[index - 1] += str;
      }
    }
  }

  transformUpperHumpCase(): string {
    return this.data
      .filter((s) => s)
      .map((s) => s[0].toUpperCase() + s.substring(1))
      .join("");
  }

  transformLowerHumpCase(): string {
    return this.data
      .filter((s) => s)
      .map((s, i) => {
        if (i === 0) {
          return s[0].toLowerCase() + s.substring(1);
        }
        return s[0].toUpperCase() + s.substring(1);
      })
      .join("");
  }

  transformKebabCase(): string {
    return this.data.join("-");
  }

  transformSnakeCase(): string {
    return this.data.join("_");
  }
}

export function nameToUpperHumpCase(name: string): string {
  return new FileName(name).transformUpperHumpCase();
}

export function nameToLowerHumpCase(name: string): string {
  return new FileName(name).transformLowerHumpCase();
}

export function nameToKebabCase(name: string): string {
  return new FileName(name).transformKebabCase();
}

export function nameToSnakeCase(name: string): string {
  return new FileName(name).transformSnakeCase();
}

export function createFileName(value: string): FileName {
  return new FileName(value);
}
