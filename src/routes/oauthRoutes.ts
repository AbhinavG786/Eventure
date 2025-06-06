import { Router } from "express";
// import passport from "../utils/passport";
import signInWithGoogle from "../utils/googleAndroidSdk";

const router = Router();

// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     successRedirect: "/", //frontend app route
//   })
// );

// router.get("/logout", (req, res) => {
//   req.logout(() => {
//     res.redirect("/");
//   });
// });

router.route("/auth/google").post(signInWithGoogle)

export default router;
