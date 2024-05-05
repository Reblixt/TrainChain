import express from "express";
import {
  createBlock,
  getBlockchain,
  synchronizeChain,
} from "../controllers/blockchain-controller.mjs";

const router = express.Router();

router.route("/").get(getBlockchain);
router.route("/mine").post(createBlock);
router.route("/concensus").get(synchronizeChain);

export default router;
