import express from "express";
import { sendBroadcastNotification } from "../utils/firebaseCloudMessaging";
import { Announcement } from "../entities/Announcement";
import { EventEntity } from "../entities/EventEntity";
import { Society } from "../entities/Society";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

class NotificationController {
  notifyUser = async (req: express.Request, res: express.Response) => {
    const { title, body, data, eventId, societyId } = req.body;
    const userId = req.user?.id;
    if (!title || !body || !eventId || !societyId || !userId) {
      res.status(400).json({ msg: "Missing fields" });
      return;
    }

    try {
      const event = await AppDataSource.getRepository(EventEntity).findOne({
        where: { id: eventId },
      });
      const society = await AppDataSource.getRepository(Society).findOne({
        where: { id: societyId },
      });
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });
      if (event && society && user) {
        const response = await sendBroadcastNotification(
          "all",
          title,
          body,
          data
        );
        const announcement = new Announcement();
        announcement.title = title;
        announcement.content = body;
        announcement.event = event;
        announcement.society = society;
        announcement.user = user;
        const savedAnnouncement = await AppDataSource.getRepository(
          Announcement
        ).save(announcement);
        res
          .status(200)
          .json({
            msg: "Broadcast Notification sent",
            response,
            savedAnnouncement,
          });
      } else {
        res.status(404).json({ msg: "Event or Society not found" });
        return;
      }
    } catch (err) {
      res
        .status(500)
        .json({ msg: "Failed to send broadcast notification", error: err });
    }
  };

  getAllNotifications = async (req: express.Request, res: express.Response) => {
    try {
      const announcements = await AppDataSource.getRepository(
        Announcement
      ).find({ order: { createdAt: "DESC" } });
      if (!announcements || announcements.length === 0) {
        res
          .status(200)
          .json({ msg: "No notifications yet", announcements: [] });
        return;
      }
      res
        .status(200)
        .json({ msg: "All notifications fetched successfully", announcements });
    } catch (err) {
      res
        .status(500)
        .json({ msg: "Failed to fetch notifications", error: err });
    }
  };
}

export default new NotificationController();
