import { Router } from "express";
import register from "../controllers/register";
const router = Router();

router.route("/").post(register.registerUser);
router.route("/:registrationId").delete(register.deleteRegistration);
