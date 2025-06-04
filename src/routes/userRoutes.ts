import { Router } from "express";
import user from "../controllers/user";
import {upload} from "../middlewares/multerUpload";
import authMiddleware from "../middlewares/authMiddleware";
const router = Router();

router.route("/all").get(user.getAllUsers);
router.route("/:id").get(user.getUserById);
router.route("/:id").patch(user.updateUser);
router.route("/:id").delete(user.deleteUser);
router.route("/all-events/registered").get(authMiddleware.verifyToken,user.getAllRegisteredEventsForUser);
router.route("/upload").post(upload.single("image"),user.uploadProfilePicBeforeSignUp)

export default router;