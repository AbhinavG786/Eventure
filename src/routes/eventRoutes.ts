import { Router } from "express";
import event from "../controllers/event";
import { upload } from "../middlewares/multerUpload";
const router = Router();

router.route("/").post(event.createEvent);
router.route("/all").get(event.getAllEvents);
router.route("/upcoming").get(event.getUpcomingEvents);
router.route("/society/:societyId").get(event.getEventsBySocietyId)
router.route("/:id").get(event.getEventById);
router.route("/bookmark/:id").patch(event.toggleBookmarkEvent);
router.route("/:id").patch(event.updateEventById);
router.route("/:id").delete(event.deleteEventById);
router.route("/rate/:id").patch(event.rateEvent);
router.route("/upload/:id").post(upload.single("eventpic"),event.uploadEventPic)

export default router;