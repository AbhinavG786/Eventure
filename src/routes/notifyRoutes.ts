import { Router } from "express";
import notification from "../controllers/notify";
import authMiddleware from "../middlewares/authMiddleware";

const router=Router();
router.route("/notify").post(authMiddleware.verifyToken,notification.notifyUser);
router.route("/all").get(notification.getAllNotifications);

export default router;