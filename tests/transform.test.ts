import { transformFileSize } from "../src/transform";

test("transformFileSize():", async () => {
  expect(transformFileSize(1)).toBe(1);
  expect(transformFileSize("100")).toBe(100);
  expect(transformFileSize("1Kb")).toBe(1000);
  expect(transformFileSize("1mb")).toBe(1000000);
  expect(transformFileSize("1GB")).toBe(1000000000);
});
