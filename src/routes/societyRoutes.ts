import { Router } from "express";
import society from "../controllers/society";
const router = Router();

router.route("/").post(society.createSociety);
router.route("/all").get(society.getAllSocieties);
router.route("/:id").get(society.getSocietyById);
router.route("/:id").patch(society.updateSocietyById);
router.route("/:id").delete(society.deleteSocietyById);
