import { OAuth2Client } from "google-auth-library";
import { User } from "../entities/User";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import express from "express";
import { LoginProvider } from "../entities/enum/loginProvider";
import bcrypt from "bcrypt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signInWithGoogle = async (
  req: express.Request,
  res: express.Response
) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    const { email, name, picture, sub } = payload;

    const fakePassword = "GoogleLogin";
    const hashFakePassword = await bcrypt.hash(fakePassword, 10);

    let user = await AppDataSource.getRepository(User).findOneBy({ email });
    if (!user) {
      user = AppDataSource.getRepository(User).create({
        email,
        name,
        profilePic: picture,
        googleId: sub,
        provider: LoginProvider.GOOGLE,
        password: hashFakePassword,
        admissionNumber: Math.random().toString(36).substring(2, 15),
      });
      await AppDataSource.getRepository(User).save(user);
    } else if (user.provider !== LoginProvider.GOOGLE) {
      res
        .status(400)
        .json({ message: "User already exists with a different provider" });
        return;
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(401).json({ message: "Invalid Google ID token" ,error});
  }
};

export default signInWithGoogle;
