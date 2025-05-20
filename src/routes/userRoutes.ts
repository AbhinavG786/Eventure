import { Router } from "express";
import user from "../controllers/user";
import {upload} from "../middlewares/multerUpload";
const router = Router();

router.route("/all").get(user.getAllUsers);
router.route("/:id").get(user.getUserById);
router.route("/:id").patch(user.updateUser);
router.route("/:id").delete(user.deleteUser);
router.route("/all-events/:userId").get(user.getAllRegisteredEventsForUser);
router.route("/upload").post(upload.single("image"),user.uploadProfilePicBeforeSignUp)
