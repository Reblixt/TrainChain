import { blockchain } from "../startup.mjs";
import { endpoint } from "../config/settings.mjs";
import ResponseModel from "../utilities/ResponseModel.mjs";

export const getMembers = (req, res, next) => {
  res
    .status(200)
    .json(new ResponseModel({ statusCode: 200, data: blockchain.nodeMembers }));
};

export const registerNode = (req, res, next) => {
  const node = req.body;

  if (
    blockchain.nodeMembers.indexOf(node.nodeUrl) === -1 &&
    blockchain.nodeUrl !== node.nodeUrl
  ) {
    blockchain.nodeMembers.push(node.nodeUrl);

    syncMembers(node.nodeUrl);
    res
      .status(201)
      .json(
        new ResponseModel({ statusCode: 201, data: blockchain.nodeMembers }),
      );
  } else {
    res.status(400).json(
      new ResponseModel({
        statusCode: 400,
        error: "Node already exists in the blockchain",
      }),
    );
  }
};

const syncMembers = (url) => {
  const members = [...blockchain.nodeMembers, blockchain.nodeUrl];
  console.log("members", members);

  try {
    members.forEach(async (member) => {
      const body = { nodeUrl: member };
      await fetch(`${url}${endpoint.registerNode}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
    });
  } catch (error) {
    console.log(error);
  }
};
