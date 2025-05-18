import { AppDataSource } from "./data-source";
import session from "express-session";
import express from "express";
import dotenv from "dotenv";   
import passport from "./utils/passport";

dotenv.config();
const app = express();

app.use(session({
  secret: "your-session-secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

AppDataSource.initialize().then(()=>{
    console.log("Connected");    
}).catch((error)=>{
    console.log(error);
})