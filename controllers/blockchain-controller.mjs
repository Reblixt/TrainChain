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

export const createBlock = (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();
  const data = req.body;
  console.log(data);
  const timestamp = Date.now();

  const currentBlockHash = blockchain.hashABlock(
    timestamp,
    lastBlock.currentHash,
    data,
  );

  const block = blockchain.createBlock(
    timestamp,
    lastBlock.currentHash,
    currentBlockHash,
    data,
  );

  res.status(201).json(new ResponseModel({ statusCode: 201, data: block }));
};

export const synchronizeChain = (req, res, next) => {
  const currentLength = blockchain.chain.length;
  let maxLength = currentLength;
  let longestChain = null;

  blockchain.nodeMembers.forEach(async (member) => {
    const response = await fetch(`${member}${endpoint.blockchain}`);
    if (response.ok) {
      const result = await response.json();

      if (result.data.chain.length > maxLength) {
        maxLength = result.data.chain.length;
        longestChain = result.data.chain;
      }

      if (
        !longestChain ||
        (longestChain && !blockchain.validateChain(longestChain))
      ) {
        console.log("Current chain is already the longest chain");
        writeFile(folder, fileName, blockchain);
        console.log(blockchain.chain);
      } else {
        blockchain.chain = longestChain;
        writeFile(folder, fileName, blockchain);
        console.log(blockchain.chain);
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
