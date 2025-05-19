import { Router } from "express";
import auth from "../controllers/auth";
const router = Router();

router.route("/register").post(auth.signUpAsStudent);
router.route("/organizer/register").post(auth.signUpAsSocietyAdmin);
router.route("/login").post(auth.login);
router.route("/token").post(auth.token);
router.route("/send-otp").post(auth.sendOtpToEmail)
router.route("/verify-otp").post(auth.verifyOtp)
