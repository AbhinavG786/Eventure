import { Router } from "express";
import announcement from "../controllers/announcement"
import paginationMiddleware from "../middlewares/paginationMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

const router=Router();

router.route("/subscribe").post(authMiddleware.verifyToken,announcement.subscribeUser)
router.route("/send").post(announcement.sendAnnouncement)
router.route("/all").get(paginationMiddleware(10, 50),announcement.getAnnouncements)

export default router;