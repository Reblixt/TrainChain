import { test, expect } from "vitest";
import { sum } from "../utilities/sum.mjs";

test("sum", () => {
  const a = 2;
  const b = 3;

  const sumFunc = sum(a, b);

  expect(sumFunc).toBe(5);
});
