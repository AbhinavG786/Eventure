import express from "express";
import { AppDataSource } from "../data-source";
import { Rating } from "../entities/Rating";
import { User } from "../entities/User";
import { EventEntity } from "../entities/EventEntity";

class RatingController {
  rateEvent = async (req: express.Request, res: express.Response) => {
    const { eventId } = req.params;
    const { rating } = req.body;
    const userId = req.user?.id;
    if (!eventId || !rating || !userId) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }
    try {
      const user = await AppDataSource.getRepository(User).findOneBy({
        id: userId,
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const event = await AppDataSource.getRepository(EventEntity).findOneBy({
        id: eventId,
      });
      if (!event) {
        res.status(404).json({ message: "Event not found" });
        return;
      }
      if (new Date() > event.endTime) {
        const newRating = new Rating();
        newRating.rating = rating;
        newRating.user = user;
        newRating.event = event;
        await AppDataSource.getRepository(Rating).save(newRating);
        res
          .status(201)
          .json({ message: "Event rated successfully", rating: newRating });
      } else {
        res.status(400).json({ message: "Event is not over yet" });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "Error while rating the event", error });
      return;
    }
  };

  getRatingForEventByUser = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!eventId || !userId) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }
    try {
      const event = await AppDataSource.getRepository(EventEntity).findOneBy({
        id: eventId,
      });
      if (!event) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      const rating = await AppDataSource.getRepository(Rating).findOne({
        where: {
          event: { id: eventId },
          user: { id: userId },
        },
      });
      if (!rating) {
        res.status(404).json({ message: "Not yet rated" });
        return;
      }
      res.status(200).json({ message: "Rating fetched successfully", rating });
    } catch (error) {
      res.status(500).json({ message: "Error while fetching rating", error });
      return;
    }
  };
}
export default new RatingController();
