import { Router } from "express";
import auth from "../controllers/auth";
const router = Router();

router.route("/register").post(auth.signUp);
router.route("/login").post(auth.login);
router.route("/token").post(auth.token);
