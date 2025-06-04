import { Router } from "express";
import search from "../controllers/search";
import paginationMiddleware from "../middlewares/paginationMiddleware";
const router = Router();

router.route("/event").get(paginationMiddleware(10, 50),search.searchEvents);
router.route("/filter").get(paginationMiddleware(10, 50),search.filterBySocietyType);

export default router;
