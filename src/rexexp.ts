export function stringToRegExp(value: string): string {
  return value
    .replace(/\\|\$|\^|\*|\[|\]|\{|\}|\?|\.|\//, (s) => "\\" + s)
    .replace(/\(/, () => "\\(")
    .replace(/\)/, () => "\\(");
}
