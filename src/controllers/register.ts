import express from "express";
import { User } from "../entities/User";
import { Registration } from "../entities/Registration";
import { EventEntity } from "../entities/EventEntity";
import { AppDataSource } from "../data-source";
import { RegistrationStatus } from "../entities/enum/registrationStatus";

class RegistrationController {
  registerUser = async (req: express.Request, res: express.Response) => {
    const { userId, eventId, registrationStatus } = req.body;
    try {
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
    const { registrationId } = req.params;
    try {
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
}
export default new RegistrationController();
