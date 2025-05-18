import express from "express";
import { User } from "../entities/User";
import { UserRole } from "../entities/enum/userRole";
import { AppDataSource } from "../data-source";

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
    const { name, email, password, role } = req.body;
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id },
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;
        user.role = role || user.role;

        const updatedUser = await AppDataSource.getRepository(User).save(user);
        res.status(200).json(updatedUser);
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
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  };

  getAllRegisteredEventsForUser = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { userId } = req.body;
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
}

export default new UserController();
