import express from "express";
import { webhook } from "../controllers/telex";

const router = express.Router();

router.post("/webhook", webhook);

export default router;
