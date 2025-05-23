import webPush from "web-push";
import { saveSubscription, getSubscriptions } from "../utils/subscriptions";
import express from "express";
import { AppDataSource } from "../data-source";
import { Subscription } from "../entities/Subscriptions";
import { User } from "../entities/User";
import { Announcement } from "../entities/Announcement";

const VAPID_KEYS = {
  publicKey: process.env.VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webPush.setVapidDetails(
  `mailto:${process.env.ADMIN_EMAIL_ID}`,
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);
class AnnouncementController {
  subscribeUser = async (req: express.Request, res: express.Response) => {
    const { userId, subscription } = req.body;
    try {
      const subObj = await saveSubscription(userId, subscription);
      if (subObj) {
        res
          .status(200)
          .json({ message: "User subscribed successfully", subObj });
      } else {
        res.status(500).json({ message: "Error subscribing user" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error subscribing user", error });
    }
  };

  sendAnnouncement = async (req: express.Request, res: express.Response) => {
    const { content } = req.body;
    if (!content) {
       res.status(400).json({ message: "Content is required" });
    }
    const allUsers = await AppDataSource.getRepository(User).find({
      select: ["id"],
    });
    const targetUserIds = allUsers.map((user) => user.id);
    const payload = JSON.stringify({ content });

    const announcement = AppDataSource.getRepository(Announcement).create({
      content,
    });
    await AppDataSource.getRepository(Announcement).save(announcement);

    await Promise.all(
      targetUserIds.map(async (userId) => {
        try {
          const subscriptions = await getSubscriptions(userId);
          if (!subscriptions || subscriptions.length === 0) {
            return;
          }
          for (const sub of subscriptions) {
            if (!sub.auth || !sub.p256dh) continue;
            const pushSubscription = {
              endpoint: sub.endpoint,
              keys: {
                auth: sub.auth,
                p256dh: sub.p256dh,
              },
            };

            try {
              await webPush.sendNotification(pushSubscription, payload);
            } catch (error: any) {
              console.error("Push error:", error);
              if (error.statusCode === 410) {
                const subEntity = await AppDataSource.getRepository(
                  Subscription
                ).findOneBy({ endpoint: sub.endpoint });
                if (subEntity) {
                  await AppDataSource.getRepository(Subscription).remove(
                    subEntity
                  );
                }
              }
            }
          }
        } catch (error) {
          console.error(`Notification failed for user ${userId}:`, error);
        }
      })
    );
  };

  getAnnouncements = async (req: express.Request, res: express.Response) => {
    const announcements = await AppDataSource.getRepository(Announcement).find({
      order: { createdAt: "DESC" },
      relations:["event","society"]
    });
    if (!announcements || announcements.length === 0) {
       res.status(404).json({ message: "No announcements found" });
    }
    res.status(200).json({ announcements });
  };
}

export default new AnnouncementController();
