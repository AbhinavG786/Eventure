import { Router } from "express";
import announcement from "../controllers/announcement"

const router=Router();

router.route("/subscribe").post(announcement.subscribeUser)
router.route("/send").post(announcement.sendAnnouncement)
router.route("/all").post(announcement.getAnnouncements)

export default router;