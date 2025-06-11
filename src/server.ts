import "./config"
import { AppDataSource } from "./data-source";
import router from "./routes/index";
// import session from "express-session";
import express from "express";
// import dotenv from "dotenv";
// import passport from "./utils/passport";
import http from "http";

// dotenv.config();
const app = express();

// app.use(
//   session({
//     secret: "your-session-secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);
// app.post("/", (req, res) => {
//   res.send(
//     '<h1>Welcome to Eventure</h1><a href="/auth/google">Login with Google</a>',
//   );
// });
app.get("/healthz", (req, res) => {
  res.status(200).send("OK,deployment is healthy");
});


// console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

AppDataSource.initialize()
  .then(() => {
    console.log("Connected");
  })
  .catch((error) => {
    console.log(error);
  });

const server = http.createServer(app);
app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
