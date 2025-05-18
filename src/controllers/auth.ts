import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { UserRole } from "../entities/enum/userRole";
import { AppDataSource } from "../data-source";

class AuthController {
  signUp = async (req: express.Request, res: express.Response) => {
    const { name, email, password, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User();
      user.name = name;
      user.email = email;
      user.password = hashedPassword;
      user.role = role || UserRole.STUDENT;

      const savedUser = await AppDataSource.getRepository(User).save(user);

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  };

  login = async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    if (!email) {
      res.status(401).json({ message: "Email is required" });
    }
    if (!password) {
      res.status(401).json({ message: "Password is required" });
    }
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { email },
      });
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
      } else {
        const checkPasswordValidation = await bcrypt.compare(
          password,
          user.password
        );
        if (!checkPasswordValidation) {
          res.status(401).json({ message: "Invalid email or password" });
        }
        const accessToken = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_ACCESS_SECRET as string,
          { expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRY || "3600", 10) }
        );
        res.status(200).json({
          message: "Login successful",
          accessToken,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  };

  token = async (req: express.Request, res: express.Response) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Token is required" });
    } else {
      jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string,
        (err: any, user: any) => {
          if (err) {
            res.status(403).json({ message: "Invalid token" });
          }
          (req as any).user = user;
          res.status(200).json({
            message: "Token is valid",
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
            },
          });
        }
      );
    }
  };
}

export default new AuthController();
