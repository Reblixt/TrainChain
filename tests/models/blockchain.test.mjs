import { test, expect, describe, beforeEach } from "vitest";
import Blockchain from "../../models/Blockchain.mjs";
import { createAHash } from "../../utilities/crypto-lib.mjs";
import Block from "../../models/Block.mjs";
import { TEST_MINERATE } from "../../config/config.mjs";

// AAA
// Arrange, Act, Assert

// I cannot do any test of the Blockchain class because it have an json import that  Vitest cannot handle so ES6 module.

let blockchain_1, blockchain_2, blockchain_3;

beforeEach(() => {
  blockchain_1 = new Blockchain();
  blockchain_2 = new Blockchain();
  blockchain_3 = new Blockchain();
});

describe("Blockchain", () => {
  describe("Properties", () => {
    test("Should have a chain property", () => {
      expect(blockchain_1).toHaveProperty("chain");
    });
    test("Should have a nodeMembers property", () => {
      expect(blockchain_1).toHaveProperty("nodeMembers");
    });
    test("Should have a nodeUrl property", () => {
      expect(blockchain_1).toHaveProperty("nodeUrl");
    });

    test("Should contain a array ", () => {
      expect(blockchain_1.chain instanceof Array).toBe(true);
    });

    test("Should have a genesis Block", () => {
      expect(blockchain_1.chain[0].data).toStrictEqual({
        data: "Genesis block",
      });
    });

    describe("Methods", () => {
      const timestamp = Date.now();
      const lastHash = "0";
      const hash = "0";
      const data = { data: "Genesis block" };
      const nonce = 1;
      const difficulty = 1;

      const newBlock = new Block({
        timestamp,
        lastHash,
        hash,
        data,
        nonce,
        difficulty,
      });

      test("blockchain.createBlock()", () => {
        const block = blockchain_1.createBlock(
          timestamp,
          lastHash,
          hash,
          data,
          nonce,
          difficulty,
        );

        expect(block.timestamp).toBe(timestamp);
        expect(block.lastHash).toBe(lastHash);
        expect(block.currentHash).toBe(hash);
        expect(block.data).toBe(data);
        expect(block.nonce).toBe(nonce);
        expect(block.difficulty).toBe(difficulty);
      });

      test("blockchain.getLastBlock()", () => {
        const lastBlock = blockchain_1.getLastBlock();
        expect(lastBlock).toBe(blockchain_1.chain.at(-1));
      });

      test("blockchain.hashABlock()", () => {
        const hash = blockchain_1.hashABlock(
          timestamp,
          lastHash,
          data,
          nonce,
          difficulty,
        );
        const expectedHash = createAHash(
          timestamp.toString() +
            lastHash +
            JSON.stringify(data) +
            nonce +
            difficulty,
        );
        expect(hash).toBe(expectedHash);
      });

      test("blockchain.validateChain()", () => {
        blockchain_1.chain[0] = "Wrong and fake";
        expect(blockchain_2.validateChain(blockchain_1.chain)).toBe(false);
      });

      describe("change difficulty", () => {
        test("Should raise the difficulty", () => {
          expect(
            blockchain_1.adjustDifficulty(
              newBlock,
              newBlock.timestamp + TEST_MINERATE - 100,
            ),
          ).toEqual(newBlock.difficulty + 1);
        });
        test("Should lower the difficulty", () => {
          expect(
            blockchain_1.adjustDifficulty(
              newBlock,
              newBlock.timestamp + TEST_MINERATE + 100,
            ),
          ).toEqual(newBlock.difficulty + 1);
        });
      });
    });
  });
});
