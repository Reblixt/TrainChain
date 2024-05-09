import express from "express";
import {
  createBlock,
  getBlockchain,
  synchronizeChain,
  updateChain,
} from "../controllers/blockchain-controller.mjs";

const router = express.Router();

router.route("/").get(getBlockchain);
router.route("/mine").post(createBlock);
router.route("/concensus").get(synchronizeChain);
router.route("/block/updateChain").post(updateChain);

export default router;
