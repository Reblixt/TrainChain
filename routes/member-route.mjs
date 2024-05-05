import express from "express";
import { getMembers, registerNode } from "../controllers/member-controller.mjs";

const router = express.Router();

router.route("/").get(getMembers);
router.route("/register-node").post(registerNode);

export default router;
