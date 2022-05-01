import {
  nameToUpperHumpCase,
  nameToLowerHumpCase,
  nameToKebabCase,
  nameToSnakeCase,
} from "../src/file-name";

test("new FileName():", async () => {
  const fileName = "ssAdd-See_bb";
  expect(nameToUpperHumpCase(fileName)).toBe("SsAddSeeBb");
  expect(nameToLowerHumpCase(fileName)).toBe("ssAddSeeBb");
  expect(nameToKebabCase(fileName)).toBe("ss-Add-See-bb");
  expect(nameToSnakeCase(fileName)).toBe("ss_Add_See_bb");
});
