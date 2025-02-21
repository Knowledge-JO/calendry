import express from "express";
import { login, redirect } from "../controllers/login";

const router = express.Router();

router.get("/login", login);

router.get("/redirect", redirect);

export default router;
