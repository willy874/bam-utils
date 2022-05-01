import { cloneJson } from "../src/common";

const testJsonData = {
  a: true,
  b: 12,
  c: {
    1: false,
    2: -34,
    3: "c",
  },
  d: ["a", "b", "c", "d"],
};

test("cloneJson():", async () => {
  expect(cloneJson(testJsonData)).toEqual(testJsonData);
  expect(cloneJson(testJsonData)).not.toBe(testJsonData);
  expect(cloneJson(undefined)).toBeNull();
  expect(cloneJson(window)).toBeNull();
  expect(cloneJson(true)).toBe(true);
  expect(cloneJson(1)).toBe(1);
  expect(cloneJson('"1"')).toBe('"1"');
  expect(cloneJson(JSON)).toEqual({});
});
