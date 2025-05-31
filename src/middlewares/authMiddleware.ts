import { log } from "console";
import express from "express";
import jwt from "jsonwebtoken";

class AuthMiddleware {
  verifyToken = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (token == null) {
        res.status(401).json({ message: "Token not found" });
      } else {
        const decodedToken = jwt.verify(
          token,
          process.env.JWT_ACCESS_SECRET as string
        )as { id: string };
        console.log("Decoded Token:", decodedToken);
        
        if (decodedToken) {
          req.user = decodedToken;
          console.log(req.user);
          
          // req.user = { id: decodedToken.id };
          return next();
        }
      }
    } catch (error) {
      res.status(401).json({ message: "Unauthorized access",error });
    }
  };
}

export default new AuthMiddleware();
