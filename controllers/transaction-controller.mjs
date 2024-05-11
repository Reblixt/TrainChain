import { blockchain } from "../startup.mjs";
import { endpoint } from "../config/settings.mjs";

export const createTransaction = (req, res, next) => {
  const transaction = req.body;

  const blockId = blockchain.addTransaction(transaction);
  res.status(201).json(new Response({ statusCode: 201, data: blockId }));
};

export const broadcastTransaction = (req, res, next) => {
  const transaction = blockchain.createTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient,
  );

  const blockNumber = blockchain.addTransaction(transaction);

  blockchain.nodeMembers.forEach(async (url) => {
    await fetch(`${url}${endpoint.transaction}`, {
      method: "POST",
      body: JSON.stringify(transaction),
      headers: { "Content-Type": "application/json" },
    });
  });

  res.status(201).json(
    new Response({
      statusCode: 201,
      data: {
        message: "Trasaction created and distrubed",
        transaction,
        blockNumber,
      },
    }),
  );
};
