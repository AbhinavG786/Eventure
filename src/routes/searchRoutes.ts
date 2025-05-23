import { Router } from "express";
import search from "../controllers/search";
const router = Router();

router.route("/search").post(search.searchEvents);
router.route("/filter").post(search.filterBySocietyType);

export default router;
