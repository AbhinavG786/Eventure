import userRoutes from "./userRoutes"
import authRoutes from "./authRoutes"
import eventRoutes from "./eventRoutes"
import followerRoutes from "./followerRoutes"
// import announcementRoutes from "./announcementRoutes"
import registerRoutes from "./registerRoutes"
import searchRoutes from "./searchRoutes"
import oauthRoutes from "./oauthRoutes"
import notifyRoutes from "./notifyRoutes"
import societyRoutes from "./societyRoutes"
import { Router } from "express"
import authMiddleware from "../middlewares/authMiddleware"

const router=Router();

router.use("/",oauthRoutes)
router.use("/user",userRoutes)
router.use("/auth",authRoutes)
router.use("/society",societyRoutes)
router.use("/register",registerRoutes)
router.use("/follower",followerRoutes)
router.use("/event",eventRoutes)
// router.use("/announcement",announcementRoutes)
router.use("/announcement",notifyRoutes)
router.use("/search",searchRoutes)

export default router
