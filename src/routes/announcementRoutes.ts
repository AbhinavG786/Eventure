import { Router } from "express";
import announcement from "../controllers/announcement"
import paginationMiddleware from "../middlewares/paginationMiddleware";

const router=Router();

router.route("/subscribe").post(announcement.subscribeUser)
router.route("/send").post(announcement.sendAnnouncement)
router.route("/all").post(paginationMiddleware(10, 50),announcement.getAnnouncements)

export default router;