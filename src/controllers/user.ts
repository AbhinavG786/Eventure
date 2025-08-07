import express from "express";
import { User } from "../entities/User";
import { Society } from "../entities/Society";
import { AppDataSource } from "../data-source";
import { imagekit } from "../utils/imageKit";
import {v4 as uuidv4} from "uuid";
import redisClient from "../utils/redis";
import { UserRole } from "../entities/enum/userRole";

class UserController {
  getUserById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id },
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  };
  getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
      const users = await AppDataSource.getRepository(User).find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  };
  updateUser = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { name, email, admissionNumber, aboutMe } = req.body;
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id },
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        user.name = name || user.name;
        user.email = email || user.email;
        user.admissionNumber = admissionNumber || user.admissionNumber;
        user.aboutMe = aboutMe || user.aboutMe;

        const updatedUser = await AppDataSource.getRepository(User).save(user);
        res.status(200).json(updatedUser);
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  };

   updateOrganiser = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const {
      name,
      email,
      societyName,
      societyDescription,
      societyType,
      admissionNumber,
      sessionId
    } = req.body;
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id },
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        user.name = name || user.name;
        user.email = email || user.email;
        user.admissionNumber = admissionNumber || user.admissionNumber;
        user.role = UserRole.SOCIETY_ADMIN;

        const updatedUser = await AppDataSource.getRepository(User).save(user);

      const society = new Society();
      society.name = societyName;
      society.description = societyDescription;
      society.type = societyType;
      society.admin = updatedUser;
      if (sessionId) {
        const uploadedUrl = await redisClient.get(`signup:logo:${sessionId}`);
        if (uploadedUrl) {
          society.logo = uploadedUrl;
          updatedUser.profilePic = uploadedUrl;
        }
      }
      const newSociety = await AppDataSource.getRepository(Society).save(
        society
      );
      res.status(201).json({
        message: "Society admin created successfully",
        society: {
          id: newSociety.id,
          name: newSociety.name,
          description: newSociety.description,
          type: newSociety.type,
        },
      });
    }
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  };

  deleteUser = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id },
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        await AppDataSource.getRepository(User).remove(user);
      res.status(200).json({ message: "User deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  };

  getAllRegisteredEventsForUser = async (
    req: express.Request,
    res: express.Response
  ) => {
    const userId=req.user?.id
    if (!userId) res.status(401).json({ message: "UserId not found" });
    try {
      const userWithRegistrations = await AppDataSource.getRepository(
        User
      ).findOne({
        where: { id: userId },
        relations: {
          registrations: {
            event: true,
          },
        },
      });
      const registeredEvents = userWithRegistrations?.registrations.map(
        (registration) => registration.event
      );
      res.status(200).json({
        message: "Registered Events fetched successfully",
        registeredEvents,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching registered events", error });
    }
  };

  uploadProfilePicBeforeSignUp=async (req: express.Request, res: express.Response) => {
    // const {sessionId}=req.body; //either generate it on frontend and send it to backend or let me generate it here
    const sessionId=uuidv4();
  try{
    const fileBuffer=req.file?.buffer;
    if(fileBuffer){
    const uploadedImage=await imagekit.upload({
      file:fileBuffer,
      fileName: `profile_${sessionId}.jpg`,
      folder:"/temp"
    })
    await redisClient.set(`signup:image:${sessionId}`, uploadedImage.url, {
      EX: 600 // Expiry time in seconds
    });
    res.status(200).json({
      message:"Image uploaded successfully",sessionId})
  }
  }
  catch(error){
    res.status(500).json({message:"Error uploading image",error})
  }
}
}

export default new UserController();
