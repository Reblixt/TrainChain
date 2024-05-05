import { test, expect, describe } from "vitest";
import Block from "../../models/Block.mjs";

// AAA
// Arrange, Act, Assert

describe(" Block models test", () => {
  test("Block model should return values", () => {
    const timestamp = Date.now();
    const blockNumber = 1;
    const lastHash = "0000";
    const hash = "0000";
    const data = { data: "data" };

    const block = new Block(timestamp, blockNumber, lastHash, hash, data);

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

// I cannot do any test of the Blockchain class because it have an json import that  Vitest cannot handle so ES6 module.

//describe("Blockchain Models Test", () => {
//test("Blockchain model creating a block", () => {
//const timestamp = new Date();
//const lastHash = "0";
//const hash = "0";
//const data = "Genesis block";
//
//const blockchain = new Blockchain();
//const block = blockchain.createBlock(timestamp, lastHash, hash, data);
//
//expect(block.timestamp).toBe(timestamp);
//expect(block.lastHash).toBe(lastHash);
//expect(block.currentHash).toBe(hash);
//expect(block.data).toBe(data);
//});
//});
