import express from "express";
import { User } from "../entities/User";
import { Registration } from "../entities/Registration";
import { EventEntity } from "../entities/EventEntity";
import { AppDataSource } from "../data-source";
import { RegistrationStatus } from "../entities/enum/registrationStatus";
import redisClient from "../utils/redis";

class RegistrationController {
  registerUserForEvent = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { eventId, registrationStatus } = req.body;
    const userId = req.user?.id;
    try {
      if (
        !eventId ||
        !userId ||
        !Object.values(RegistrationStatus).includes(registrationStatus)
      ) {
        res.status(400).json({
          message:
            "Event ID, User ID and Proper Registration Status are required",
        });
        return;
      }
      const registration = new Registration();
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      }
      const event = await AppDataSource.getRepository(EventEntity).findOne({
        where: { id: eventId },
      });
      if (!event) {
        res.status(404).json({
          message: "Event not found",
        });
      }
      if (user && event) {
        registration.user = user;
        registration.event = event;
        registration.status = registrationStatus || RegistrationStatus.PENDING;

        const newRegistration = await AppDataSource.getRepository(
          Registration
        ).save(registration);
        await redisClient.del("trending_events");
        res.status(201).json({
          message: "User registered successfully",
          registration: newRegistration,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error registering user",
        error,
      });
    }
  };

  deleteRegistration = async (req: express.Request, res: express.Response) => {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!eventId || !userId) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }
    try {
      const registration = await AppDataSource.getRepository(
        Registration
      ).findOne({
        where: { user: { id: userId }, event: { id: eventId } },
      });
      if (!registration) {
        res.status(404).json({
          message: "Registration not found",
        });
      } else {
        await AppDataSource.getRepository(Registration).remove(registration);
        res.status(200).json({
          message: "Registration deleted successfully",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting registration",
        error,
      });
    }
  };

  changeRegistrationStatus = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { registrationId } = req.params;
    const { status } = req.body;
    if (!registrationId || !status) {
      res.status(400).json({
        message: "Registration ID and status are required",
      });
    }
    try {
      if (!Object.values(RegistrationStatus).includes(status)) {
        res.status(400).json({
          message: "Invalid registration status",
        });
      } else {
        const registration = await AppDataSource.getRepository(
          Registration
        ).findOne({
          where: { id: registrationId },
        });
        if (!registration) {
          res.status(404).json({
            message: "Registration not found",
          });
        } else {
          registration.status = status;
          const updatedRegistration = await AppDataSource.getRepository(
            Registration
          ).save(registration);
          res.status(200).json({
            message: "Registration status updated successfully",
            registration: updatedRegistration,
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Error changing registration status",
      });
    }
  };
}

export default new RegistrationController();
