# BAM UTILITY PLUGINS

各種通用函式。

## FileName (Browser | Nodejs)

### Arguments

- {string} constructorArg: 放入要格式化的字串。

### Description

處理關於 `名稱` 的字串處理。如果 path-browserify 無法滿足需求的時候，可以搭配該模組來進行大小駝峰的拆解轉換規則。

### Interface

```ts
class FileName {
  readonly data: string[]
  readonly ext: string
  readonly name: string
  constructor(name: string)
  transformUpperHump(): string
  transformLowerHump(): string
  transformKebabCase(): string
  transformSnakeCase(): string
}
```

### Example

```js
import { FileName } from 'bam-utility-plugins'

const filename1 = new FileName('bamboo.ex_str test.txt')

console.log(filename1.transformUpperHump())
// BambooExStrTest
console.log(filename1.transformLowerHump())
// bambooExStrTest
console.log(filename1.transformKebabCase())
// bamboo-ex-str-test
console.log(filename1.data)
// ['bamboo', 'ex' 'Ex', 'str', 'test']
console.log(filename1.ext)
// .txt

const filename2 = new FileName('bam booEx_str-Test.txt')

console.log(filename2.transformUpperHump())
// BambooExStrTest
console.log(filename2.transformLowerHump())
// bambooExStrTest
console.log(filename2.transformSnakeCase())
// bamboo_Ex_str_Test
console.log(filename2.data)
// ['bam', 'boo' 'Ex', 'str', 'Test']
console.log(filename2.ext)
// .txt
```
