import Block from "./Block.mjs";
import Transaction from "./Transaction.mjs";
import fs from "fs";
import { createAHash } from "../utilities/crypto-lib.mjs";
import { writeFile } from "../utilities/fileHandler.mjs";

const folder = "data";
const fileName = "chain.json";

let chainFile = null;
try {
  const data = fs.readFileSync("./data/chain.json", "utf-8");
  if (data) {
    chainFile = JSON.parse(data);
    console.log("Chain file loaded from chain.json");
  } else {
    console.log("Chain file is empty. Initializing a new blockchain.");
    chainFile = null;
  }
} catch (error) {
  if (error.code === "ENOENT") {
    console.log("No chain file found. Initializing a new blockchain.");
  } else {
    console.error("Error reading chain file:", error);
  }
  chainFile = null;
}

export default class Blockchain {
  constructor() {
    this.chain = (chainFile && chainFile) || [];
    this.nodeMembers = (chainFile && chainFile.memberNodes) || [];
    this.pendingTransactions = [];
    this.nodeUrl = process.argv[3];
    !chainFile &&
      this.createBlock(Date.now(), "0", "0", { data: "Genesis block" }, 1, 3);
  }

  createBlock(timestamp, lastHash, currentHash, data, nonce, difficulty) {
    const block = new Block(
      timestamp,
      this.chain.length + 1,
      lastHash,
      currentHash,
      data,
      nonce,
      difficulty,
    );
    this.pendingTransactions = [];
    this.chain.push(block);
    writeFile(folder, fileName, this.chain);
    return block;
  }

  createTransaction(amount, sender, recipient) {
    return new Transaction(amount, sender, recipient);
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
    return this.getLastBlock().blockNumber + 1;
  }

  getLastBlock() {
    const lastBlock = this.chain.at(-1);
    return lastBlock;
  }

  hashABlock(timestamp, lastHash, currentBlockData, nonce, difficulty) {
    const stringToHash =
      timestamp.toString() +
      lastHash +
      JSON.stringify(currentBlockData) +
      nonce +
      difficulty;
    const hash = createAHash(stringToHash);
    return hash;
  }

  proofOfWork(lastHash, data) {
    const lastBlock = this.getLastBlock();
    let difficulty, hash, timestamp;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.adjustDifficulty(lastBlock, timestamp);
      hash = this.hashABlock(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return { nonce, difficulty, timestamp };
  }

  adjustDifficulty(lastBlock, currentTimestamp) {
    const MINE_RATE = parseInt(process.env.MINE_RATE);
    let { difficulty, timestamp } = lastBlock;
    const timestampDifference = currentTimestamp - timestamp;

    if (timestampDifference > MINE_RATE) {
      return +difficulty - 1;
    } else {
      return +difficulty + 1;
    }
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
        block.nonce,
        block.difficulty,
      );
      console.log("Hash: ", hash, i);
      console.log("Block hash: ", block.currentHash, i);
      if (hash !== block.currentHash) isValid = false;
      if (block.lastHash !== prevBlock.currentHash) isValid = false;
    }
    return isValid;
  }
}
