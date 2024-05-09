import { test, expect, describe } from "vitest";
import Block from "../../models/Block.mjs";

// AAA

describe(" Block models test", () => {
  test("Block model should return values", () => {
    const timestamp = Date.now();
    const blockNumber = 1;
    const lastHash = "0000";
    const hash = "0000";
    const data = { data: "data" };
    const nonce = 1;
    const difficulty = 1;

    const block = new Block(
      timestamp,
      blockNumber,
      lastHash,
      hash,
      data,
      nonce,
      difficulty,
    );

    expect(block.timestamp).toBe(timestamp);
    expect(block.blockNumber).toBe(blockNumber);
    expect(block.lastHash).toBe(lastHash);
    expect(block.currentHash).toBe(hash);
    expect(block.data).toBe(data);
  });

  test("Block model should return empty values if wrong values are passed", () => {
    const wrongTimestamp = "wrong";
    const wrongBlockNumber = "wrong";
    const wrongLastHash = 1;
    const wrongHash = 1;
    const wrongData = 1;

    const block = new Block(
      wrongTimestamp,
      wrongBlockNumber,
      wrongLastHash,
      wrongHash,
      wrongData,
    );

    expect(block.timestamp).toBe(undefined);
    expect(block.blockNumber).toBe(undefined);
    expect(block.lastHash).toBe(undefined);
    expect(block.currentHash).toBe(undefined);
    expect(block.data).toBe(undefined);
  });
});
