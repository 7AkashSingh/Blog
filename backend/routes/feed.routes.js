import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getFeed } from "../controllers/Feed.controller.js";

const router = Router();

router.get("/", verifyJWT, getFeed);

export default router;