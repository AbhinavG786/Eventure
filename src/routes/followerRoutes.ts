import { Router } from "express";
import follower from "../controllers/follower";

const router = Router();

router.route("/follow").post(follower.followSociety);
router.route("/unfollow").post(follower.unfollowSociety);
