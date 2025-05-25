import express from "express";
import { EventEntity } from "../entities/EventEntity";
import { Society } from "../entities/Society";
import { User } from "../entities/User";
import { Bookmark } from "../entities/bookmark";
import { In, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../data-source";
import { imagekit } from "../utils/imageKit";

class EventController {
  createEvent = async (req: express.Request, res: express.Response) => {
    const { name, description, venue, startTime, endTime, societyId, userId } =
      req.body;
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
        event.venue = venue;

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

  getEventsBySocietyId = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { societyId } = req.params;
    try {
      const society = await AppDataSource.getRepository(Society).findOne({
        where: { id: societyId },
        relations: ["events"],
      });
      if (!society) {
        res.status(404).json({
          message: "Society not found",
        });
      } else {
        const events = society.events;
        if (events.length === 0) {
          res.status(404).json({
            message: "No events found for this society",
          });
        }
        res.status(200).json({
          message: "Events found",
          events: society.events,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error getting events by society id",
        error,
      });
    }
  };

  getUpcomingEvents = async (req: express.Request, res: express.Response) => {
    const presentDate = new Date();
    try {
      const events = await AppDataSource.getRepository(EventEntity).find({
        where: {
          startTime: MoreThanOrEqual(presentDate),
        },
        order: {
          startTime: "ASC",
        },
        relations: ["society", "createdBy"],
      });
      res.status(200).json({
        message: "Upcoming events found",
        events,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error getting upcoming events",
        error,
      });
    }
  };

  updateEventById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { name, description, venue, startTime, endTime } = req.body;
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
        event.venue = venue;

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

  // toggleBookmarkEvent = async (req: express.Request, res: express.Response) => {
  //   const { id } = req.params;
  //   try {
  //     const event = await AppDataSource.getRepository(EventEntity).findOne({
  //       where: { id },
  //     });
  //     if (!event) {
  //       res.status(404).json({
  //         message: "Event not found",
  //       });
  //     } else {
  //       event.bookmark = !event.bookmark;
  //       const updatedEvent = await AppDataSource.getRepository(
  //         EventEntity
  //       ).save(event);
  //       res.status(200).json({
  //         message: "Event bookmark toggled successfully",
  //         event: updatedEvent,
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       message: "Error toggling bookmark",
  //       error,
  //     });
  //   }
  // };

  toggleBookmarkEvent = async (req: express.Request, res: express.Response) => {
    const { userId, eventId } = req.body;

    try {
      const user = await AppDataSource.getRepository(User).findOneBy({
        id: userId,
      });
      const event = await AppDataSource.getRepository(EventEntity).findOneBy({
        id: eventId,
      });

      if (!user || !event) {
        res.status(404).json({ message: "User or Event not found" });
        return;
      }

      const existingBookmark = await AppDataSource.getRepository(
        Bookmark
      ).findOne({
        where: {
          user: { id: userId },
          event: { id: eventId },
        },
      });

      if (existingBookmark) {
        await AppDataSource.getRepository(Bookmark).remove(existingBookmark);
        res.status(200).json({ message: "Bookmark removed" });
      } else {
        const newBookmark = AppDataSource.getRepository(Bookmark).create({
          user,
          event,
        });
        await AppDataSource.getRepository(Bookmark).save(newBookmark);
        res.status(200).json({ message: "Bookmark added" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error toggling bookmark", error });
    }
  };

  getBookmarkedEvents = async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;

    try {
      const bookmarks = await AppDataSource.getRepository(Bookmark).find({
        where: { user: { id: userId } },
        relations: ["event", "event.society", "event.createdBy"],
      });

      const events = bookmarks.map((b) => b.event);

      res.status(200).json({
        message: "Bookmarked events fetched successfully",
        events,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching bookmarked events",
        error,
      });
    }
  };

  rateEvent = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { rating } = req.body;
    try {
      const event = await AppDataSource.getRepository(EventEntity).findOne({
        where: { id },
      });
      if (!event) {
        res.status(404).json({
          message: "Event not found",
        });
      } else {
        if (new Date() > event.endTime) {
          event.rating = rating;
          const updatedEvent = await AppDataSource.getRepository(
            EventEntity
          ).save(event);
          res.status(200).json({
            message: "Event rated successfully",
            event: updatedEvent,
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Error rating event",
        error,
      });
    }
  };

  uploadEventPic = async (req: express.Request, res: express.Response) => {
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
        const file = req.file;
        if (!file) {
          res.status(400).json({ message: "No file uploaded" });
        } else {
          const uploadedEventPic = await imagekit.upload({
            file: file.buffer,
            fileName: `event-${event.id}-${event.name}.jpg`,
            folder: "/event-pics",
          });
          event.eventPic = uploadedEventPic.url;
          const updatedEvent = await AppDataSource.getRepository(
            EventEntity
          ).save(event);
          res.status(200).json({
            message: "Event picture uploaded successfully",
            event: updatedEvent,
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Error uploading event picture",
        error,
      });
    }
  };

  showPersonalizedEvents = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { userId } = req.params;

    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
        relations: ["following", "following.society"],
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        const followedSocieties = user.following
          .map((f) => f.society?.id)
          .filter(Boolean);

        if (followedSocieties.length === 0) {
          res
            .status(200)
            .json({ message: "No followed societies", events: [] });
        }

        const events = await AppDataSource.getRepository(EventEntity).find({
          where: {
            society: { id: In(followedSocieties) },
            startTime: MoreThanOrEqual(new Date()),
          },
          relations: ["society", "createdBy"],
          order: {
            startTime: "ASC",
          },
        });

        res.status(200).json({
          message: "Personalized events found",
          events,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error getting personalized events",
        error,
      });
    }
  };
}

export default new EventController();
