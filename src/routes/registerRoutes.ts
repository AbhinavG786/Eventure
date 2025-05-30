import { Router } from "express";
import register from "../controllers/register";
const router = Router();

router.route("/").post(register.registerUserForEvent);
router.route("/:registrationId").delete(register.deleteRegistration);
router.route("/:registrationId").patch(register.changeRegistrationStatus)

export default router;