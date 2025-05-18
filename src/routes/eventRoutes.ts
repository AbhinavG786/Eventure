import { Router } from "express";
import event from "../controllers/event";
const router = Router();

router.route("/").post(event.createEvent);
router.route("/all").get(event.getAllEvents);
router.route("/:id").get(event.getEventById);
router.route("/:id").patch(event.updateEventById);
router.route("/:id").delete(event.deleteEventById);
