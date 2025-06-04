import { Router } from "express";
import event from "../controllers/event";
import { upload } from "../middlewares/multerUpload";
import paginationMiddleware from "../middlewares/paginationMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
const router = Router();

router.route("/").post(authMiddleware.verifyToken,event.createEvent);
router.route("/all").get(paginationMiddleware(10, 50),event.getAllEvents);
router.route("/upcoming").get(paginationMiddleware(10, 50),event.getUpcomingEvents);
router.route("/society/:societyId").get(event.getEventsBySocietyId);
router.route("/bookmarks").get(event.getBookmarkedEvents);
router.route("/trending").get(event.getTrendingEvents);
router.route("/personalized").get(authMiddleware.verifyToken,paginationMiddleware(10, 50),event.showPersonalizedEvents);
router.route("/:id").get(event.getEventById);
router.route("/bookmark/:eventId").patch(event.toggleBookmarkEvent);
router.route("/:id").patch(event.updateEventById);
router.route("/:id").delete(event.deleteEventById);
router.route("/rate/:id").patch(event.rateEvent);
router.route("/upload/:id").post(upload.single("eventpic"), event.uploadEventPic);



export default router;
