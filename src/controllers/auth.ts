import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { UserRole } from "../entities/enum/userRole";
import { AppDataSource } from "../data-source";
import { Society } from "../entities/Society";
import redisClient from "../utils/redis";
import sendMailer from "../utils/sendMailer";
import { imagekit } from "../utils/imageKit";

class AuthController {
  signUpAsStudent = async (req: express.Request, res: express.Response) => {
    const { name, email, password, admissionNumber, sessionId } =
      req.body;
    // store the backend generated sessionId in memory/localstorage which will be sent in the response in the upload api and then give it in request body
    try {
      const existingUser=await AppDataSource.getRepository(User).findOne({
        where:{email}
      })
      if(existingUser){
        res.status(400).json({ message: "User with this email already exists" });
        return;
      }
      const existingAdmissionNumber=await AppDataSource.getRepository(User).findOne({
        where:{admissionNumber}
      })
      if(existingAdmissionNumber){
        res.status(400).json({ message: "User with this admission number already exists" });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User();
      user.name = name;
      user.email = email;
      user.password = hashedPassword;
      user.admissionNumber = admissionNumber;
      // user.aboutMe = aboutMe;
      user.role = UserRole.STUDENT;
      if (sessionId) {
        const uploadedUrl = await redisClient.get(`signup:image:${sessionId}`);
        if (uploadedUrl) {
          user.profilePic = uploadedUrl;
        }
      }

      const savedUser = await AppDataSource.getRepository(User).save(user);
      // await imagekit.moveFile({
      //   sourceFilePath: `/temp/profile_${sessionId}.jpg`,
      //   destinationPath: `/users/${user.id}/profile.jpg`,
      // });
      // const cleanUserId = savedUser.id.replace(/[^a-zA-Z0-9-]/g, "");
      //       const cleanUserId = savedUser.id.replace(/[^a-zA-Z0-9\-\p{L}]/gu, '');
      // console.log('Cleaned user ID:', cleanUserId);
      // console.log("Moving file to:", `users/${cleanUserId}/profile.jpg`);

      //       await imagekit.moveFile({
      //         sourceFilePath: `/temp/profile_${sessionId}.jpg`,
      //         destinationPath: `/users/${cleanUserId}/profile.jpg`,
      //       });

      // const folderSafeUserId = savedUser.id.replace(/[^a-zA-Z0-9]/g, '');
      // await imagekit.moveFile({
      //   sourceFilePath: `/temp/profile_${sessionId}.jpg`,
      //   // destinationPath: `users_profile_${folderSafeUserId}.jpg`,
      //   destinationPath: `users/test123.jpg`,
      // });

      const expiryInDays=parseInt(process.env.JWT_TOKEN_EXPIRY || "3",10);
        const accessToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_ACCESS_SECRET as string,
          { expiresIn: `${expiryInDays}d` }
        );

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          admissionNumber: savedUser.admissionNumber,
          aboutMe: savedUser.aboutMe,
          role: savedUser.role,
        },
        accessToken,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  };

  signUpAsSocietyAdmin = async (
    req: express.Request,
    res: express.Response
  ) => {
    const {
      name,
      email,
      password,
      societyName,
      societyDescription,
      societyType,
      admissionNumber,
      sessionId,
    } = req.body;
    try {
       const existingUser=await AppDataSource.getRepository(User).findOne({
        where:{email}
      })
      if(existingUser){
        res.status(400).json({ message: "User with this email already exists" });
        return;
      }
      const existingAdmissionNumber=await AppDataSource.getRepository(User).findOne({
        where:{admissionNumber}
      })
      if(existingAdmissionNumber){
        res.status(400).json({ message: "User with this admission number already exists" });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User();
      user.name = name;
      user.email = email;
      user.admissionNumber = admissionNumber;
      user.password = hashedPassword;
      user.role = UserRole.SOCIETY_ADMIN;

      const society = new Society();
      society.name = societyName;
      society.description = societyDescription;
      society.type = societyType;
      society.admin = user;
      if (sessionId) {
        const uploadedUrl = await redisClient.get(`signup:logo:${sessionId}`);
        if (uploadedUrl) {
          society.logo = uploadedUrl;
          user.profilePic = uploadedUrl;
        }
      }
      const societyAdmin = await AppDataSource.getRepository(Society).save(
        society
      );
      const expiryInDays=parseInt(process.env.JWT_TOKEN_EXPIRY || "3",10);
        const accessToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_ACCESS_SECRET as string,
          { expiresIn: `${expiryInDays}d` }
        );

      res.status(201).json({
        message: "Society admin created successfully",
        society: {
          id: societyAdmin.id,
          name: societyAdmin.name,
          description: societyAdmin.description,
          type: societyAdmin.type,
        },
        accessToken,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating society admin", error });
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
        relations: ["following","society","bookmarks","events","registrations","ratings","announcements"],
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
        const expiryInDays=parseInt(process.env.JWT_TOKEN_EXPIRY || "3",10);
        const accessToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_ACCESS_SECRET as string,
          { expiresIn: `${expiryInDays}d` }
        );
        res.status(200).json({
          message: "Login successful",
          accessToken,
          user
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
          // (req as any).user = user;
          req.user = user;
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

  sendOtpToEmail = async (req: express.Request, res: express.Response) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }
    const existingEmail = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });
    if (existingEmail) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; //10 mins
    await redisClient.set(`otp:${email}`, otp, { PX: otpExpiry }); // expiry time in milliseconds
    await sendMailer.sendVerificationEmail(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  };

  verifyOtp = async (req: express.Request, res: express.Response) => {
    const { email, otp } = req.body;
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp) {
      res.status(400).json({ message: "OTP expired or invalid" });
      return
    }
    if (storedOtp !== otp) {
      res.status(400).json({ message: "Invalid OTP" });
      return
    }
    await redisClient.del(`otp:${email}`);
    res.status(200).json({ message: "OTP verified successfully" });
  };

  requestPasswordReset = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { email } = req.body;
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { email },
      });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return
      } else {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_ACCESS_SECRET as string
        );
        await redisClient.set(`password-reset:${user.id}`, token, {
          EX: 5 * 60,
        });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${user.id}/${token}`;

        await sendMailer.sendPasswordResetMail(email, resetLink);
        res.status(200).json({ message: "Password reset link sent to email" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error requesting password reset", error });
    }
  };

  verifyPasswordResetToken = async (
    req: express.Request,
    res: express.Response
  ) => {
    // const { token, userId } = req.params;
    const {token}=req.params;
    const userId=req.user?.id;
    // const userId = (req.user as { id: string })?.id;
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return
      } else {
        const storedToken = await redisClient.get(`password-reset:${user.id}`);
        if (!storedToken) {
          res.status(400).json({ message: "Token expired or invalid" });
          return
        } else {
          jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string,
            async (err: any) => {
              if (err) {
                res.status(400).json({ message: "Invalid token" });
                return
              } else {
                res
                  .status(200)
                  .json({ message: "Token verified successfully" });
                await redisClient.del(`password-reset:${user.id}`);
              }
            }
          );
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Error verifying token", error });
    }
  };

  resetPassword = async (req: express.Request, res: express.Response) => {
    const { newPassword } = req.body;
    // const { userId } = req.params;
    const userId=req.user?.id
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return
      } else {
        // const checkPasswordValidation = await bcrypt.compare(
        //   oldPassword,
        //   user.password
        // );
        // if (!checkPasswordValidation) {
        //   res.status(400).json({ message: "Old password is incorrect" });
        // } else {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword;
          await AppDataSource.getRepository(User).save(user);
          res.status(200).json({ message: "Password reset successfully" });
        // }
      }
    } catch (error) {
      res.status(500).json({ message: "Error resetting password", error });
    }
  };
}

export default new AuthController();
