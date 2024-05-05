import Block from "./Block.mjs";
//import fs from "fs";
import chainFile from "../data/chain.json" with { type: "json" };
import { createAHash } from "../utilities/crypto-lib.mjs";

export default class Blockchain {
  constructor() {
    this.chain = chainFile || [];
    this.nodeMembers = chainFile.memberNodes || [];
    this.nodeUrl = process.argv[3];
    if (this.chain.length === 0) {
      this.createBlock(Date.now(), "0", "0", "Genesis block");
    }
  }

  createBlock(timestamp, lastHash, currentHash, data) {
    const block = new Block(
      timestamp,
      this.chain.length + 1,
      lastHash,
      currentHash,
      data,
    );
    this.chain.push(block);
    return block;
  }

  getLastBlock() {
    return this.chain.at(-1);
  }

  hashABlock(timestamp, lastHash, currentBlockData) {
    const stringToHash =
      timestamp.toString() + lastHash + JSON.stringify(currentBlockData);
    const hash = createAHash(stringToHash);
    return hash;
  }

  validateChain(blockchain) {
    let isValid = true;

    for (let i = 1; i < blockchain.length; i++) {
      const block = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const hash = this.hashABlock(
        block.timestamp,
        prevBlock.currentHash,
        block.data,
      );

      if (hash !== block.currentHash) isValid = false;
      if (block.lastHash !== prevBlock.currentHash) isValid = false;
    }
    return isValid;
  }
}

// Efter consesus har utförts efter fler blockkedjor. Då uppdateras json blockkedjan med den längsta blockkedjan.
// Så på detta sätt så ska inte json files updateras när en ny block skapas. Utan efter consesus.
