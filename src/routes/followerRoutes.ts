import { Router } from "express";
import follower from "../controllers/follower";
import authMiddleware from "../middlewares/authMiddleware";
const router = Router();

router.route("/follow").post(authMiddleware.verifyToken,follower.followSociety);
router.route("/unfollow").post(authMiddleware.verifyToken,follower.unfollowSociety);

export default router;