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
        res.json(401).json({ message: "Token not found" });
      } else {
        const decodedToken = jwt.verify(
          token,
          process.env.JWT_ACCESS_SECRET as string
        );
        if (decodedToken) {
          req.user = decodedToken;
          return next();
        }
      }
    } catch (error) {
      res.status(401).json({ message: "Unauthorized access" });
    }
  };
}

export default new AuthMiddleware();
