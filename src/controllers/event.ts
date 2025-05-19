import express from "express";
import { EventEntity } from "../entities/EventEntity";
import { Society } from "../entities/Society";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

class EventController {
  createEvent = async (req: express.Request, res: express.Response) => {
    const { name, description, startTime,endTime, societyId, userId } = req.body;
    try {
      const event = new EventEntity();
      const society = await AppDataSource.getRepository(Society).findOne({
        where: { id: societyId },
      });
      if (!society) {
        res.status(404).json({
          message: "Society not found",
        });
      }
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      }
      if (user && society) {
        event.name = name;
        event.description = description;
        event.startTime = startTime;
        event.endTime = endTime;
        event.society = society;
        event.createdBy = user;

        const newEvent = await AppDataSource.getRepository(EventEntity).save(
          event
        );
        res.status(201).json({
          message: "Event created successfully",
          event: newEvent,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error creating event",
        error,
      });
    }
  };

  getEventById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      const event = await AppDataSource.getRepository(EventEntity).findOne({
        where: { id },
        relations: ["society", "createdBy"],
      });
      if (!event) {
        res.status(404).json({
          message: "Event not found",
        });
      }
      res.status(200).json({
        message: "Event found",
        event,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error getting event",
        error,
      });
    }
  };

  getAllEvents = async (req: express.Request, res: express.Response) => {
    try {
      const events = await AppDataSource.getRepository(EventEntity).find({
        relations: ["society", "createdBy"],
      });
      res.status(200).json({
        message: "Events found",
        events,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error getting events",
        error,
      });
    }
  };

  updateEventById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { name, description, startTime,endTime } = req.body;
    try {
      const event = await AppDataSource.getRepository(EventEntity).findOne({
        where: { id },
      });
      if (!event) {
        res.status(404).json({
          message: "Event not found",
        });
      } else {
        event.name = name;
        event.description = description;
        event.startTime = startTime;
        event.endTime = endTime;

        const updatedEvent = await AppDataSource.getRepository(
          EventEntity
        ).save(event);
        res.status(200).json({
          message: "Event updated successfully",
          event: updatedEvent,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating event",
        error,
      });
    }
  };

  deleteEventById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      const event = await AppDataSource.getRepository(EventEntity).findOne({
        where: { id },
      });
      if (!event) {
        res.status(404).json({
          message: "Event not found",
        });
      } else {
        await AppDataSource.getRepository(EventEntity).remove(event);
        res.status(200).json({
          message: "Event deleted successfully",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting event",
        error,
      });
    }
  };
}

export default new EventController();
