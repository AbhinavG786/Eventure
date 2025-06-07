import { Router } from "express";
import auth from "../controllers/auth";
import authMiddleware from "../middlewares/authMiddleware";
const router = Router();

router.route("/register").post(auth.signUpAsStudent);
router.route("/organizer/register").post(auth.signUpAsSocietyAdmin);
router.route("/login").post(auth.login);
router.route("/token").post(auth.token);
router.route("/send-otp").post(auth.sendOtpToEmail)
router.route("/verify-otp").post(auth.verifyOtp)
router.route("/request-reset").post(auth.requestPasswordReset)
router.route("/verify/:token").post(authMiddleware.verifyToken,auth.verifyPasswordResetToken)
router.route("/reset").post(auth.resetPassword)

export default router;