//import chain from "../data/chain.json" with { type: "json" };
import { writeFile } from "../utilities/fileHandler.mjs";
import ResponseModel from "../utilities/ResponseModel.mjs";
import { blockchain } from "../startup.mjs";
import { endpoint } from "../config/settings.mjs";

const folder = "data";
const fileName = "chain.json";

export const getBlockchain = (req, res, next) => {
  res
    .status(200)
    .json(new ResponseModel({ statusCode: 200, data: blockchain }));
};

export const createBlock = async (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();
  const data = blockchain.pendingTransactions;
  const { nonce, difficulty, timestamp } = blockchain.proofOfWork(
    lastBlock.currentHash,
    data,
  );
  //  const timestamp = Date.now();

  const currentBlockHash = blockchain.hashABlock(
    timestamp,
    lastBlock.currentHash,
    data,
    nonce,
    difficulty,
  );

  const block = blockchain.createBlock(
    timestamp,
    lastBlock.currentHash,
    currentBlockHash,
    data,
    nonce,
    difficulty,
  );

  blockchain.nodeMembers.forEach(async (url) => {
    const body = block;
    await fetch(`${url}${endpoint.blockchain}/block/updateChain`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  const reward = { amount: 3, sender: "0000", recipient: blockchain.nodeUrl };

  await fetch(`${blockchain.nodeUrl}${endpoint.transaction}/broadcast`, {
    method: "POST",
    body: JSON.stringify(reward),
    headers: {
      "Content-Type": "application/json",
    },
  });

  res.status(201).json(new ResponseModel({ statusCode: 201, data: block }));
};

export const updateChain = (req, res, next) => {
  const block = req.body;
  const lastBlock = blockchain.getLastBlock();
  const hash = lastBlock.currentHash === block.lastHash;
  const blockNr = lastBlock.blockNumber + 1 === block.blockNumber;

  if (hash && blockNr) {
    blockchain.chain.push(block);
    console.log("Block added to chain", blockchain.chain);
    res.status(201).json(
      new ResponseModel({
        statusCode: 201,
        data: { message: "Block is now added and distributed" },
      }),
    );
  } else {
    res.status(400).json(
      new ResponseModel({
        statusCode: 400,
        data: { message: "Invalid block" },
      }),
    );
  }
};

export const synchronizeChain = (req, res, next) => {
  const currentLength = blockchain.chain.length;
  let maxLength = currentLength;
  let longestChain = null;

  blockchain.nodeMembers.forEach(async (member) => {
    const response = await fetch(`${member}${endpoint.blockchain}`);
    if (response.ok) {
      const result = await response.json();

      console.log("result form fetch", result.data);
      if (result.data.chain.length > maxLength) {
        maxLength = result.data.chain.length;
        console.log("New max length found", maxLength);
        longestChain = result.data.chain;
        console.log("Longest chain found", longestChain);
      }

      if (
        !longestChain ||
        (longestChain && !blockchain.validateChain(longestChain))
      ) {
        console.log("Current chain is already the longest chain");
        writeFile(folder, fileName, blockchain.chain);
      } else {
        blockchain.chain = longestChain;
        console.log("Chain updated", blockchain.chain);
        writeFile(folder, fileName, blockchain.chain);
      }
    }
  });

  res.status(200).json(
    new ResponseModel({
      statusCode: 200,
      data: { message: "Chain synchronized" },
    }),
  );
};
