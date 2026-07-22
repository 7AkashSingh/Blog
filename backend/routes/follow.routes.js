import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkFollowStatus
} from "../controllers/follow.controller.js";

const router = Router();

router.post("/:userId", verifyJWT, followUser);
router.delete("/:userId", verifyJWT, unfollowUser);

router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);
router.get("/status/:userId",verifyJWT,checkFollowStatus
);
export default router;