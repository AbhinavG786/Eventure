import { Router } from "express";
import register from "../controllers/register";
import authMiddleware from "../middlewares/authMiddleware";
const router = Router();

router.route("/").post(authMiddleware.verifyToken,register.registerUserForEvent);
router.route("/:registrationId").delete(register.deleteRegistration);
router.route("/:registrationId").patch(register.changeRegistrationStatus)

export default router;