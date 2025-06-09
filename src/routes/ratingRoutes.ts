import {Router} from "express"
import rating from "../controllers/rating"
import authMiddleware from "../middlewares/authMiddleware"
const router=Router()
router.route("/:eventId").post(authMiddleware.verifyToken,rating.rateEvent)
router.route("/:eventId").get(authMiddleware.verifyToken,rating.getRatingForEventByUser)
 
export default router