import express from "express";
import blockchainRouter from "./routes/blockchain-route.mjs";
import { endpoint } from "./config/settings.mjs";
import memberRouter from "./routes/member-route.mjs";
import { fileURLToPath } from "url";
import path from "path";
import ErrorResponse from "./utilities/ResponseModel.mjs";
import { errorHandler } from "./middleware/errorHandler.mjs";
import logger from "./middleware/logger.mjs";

const app = express();

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
global.__appdir = dirName;

if (process.env.NODE_ENV === "development") {
  app.use(logger);
  console.log("From env file: ", process.env.NODE_ENV);
}

//console.log(blockchain.chain);
app.use(express.json());
app.use(endpoint.blockchain, blockchainRouter);
app.use(endpoint.members, memberRouter);

app.all("*", (req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);
const PORT = process.argv[2] || process.env.PORT || 5010;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
