import express from "express";
import { Follower } from "../entities/Follower";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Society } from "../entities/Society";

class FollowerController {
  followSociety = async (req: express.Request, res: express.Response) => {
    const { societyId } = req.body;
    const userId=req.user?.id
    if (!userId || !societyId)
      res.status(400).json({ message: "User ID and Society ID are required" });
    else {
      try {
        const follower = await AppDataSource.getRepository(Follower).findOne({
      where: {
        user: { id: userId },
        society: { id: societyId },
      },
      relations: ["user", "society"],
    });
    if(follower){
        res.status(400).json({ message: "Already following this society" });
    }
        const user = await AppDataSource.getRepository(User).findOneBy({
          id: userId,
        });
        const society = await AppDataSource.getRepository(Society).findOneBy({
          id: societyId,
        });
        if (user && society) {
          const follower = new Follower();
          follower.user = user;
          follower.society = society;
          await AppDataSource.getRepository(Follower).save(follower);
          res
            .status(200)
            .json({ message: "Successfully followed the society", follower });
        } else {
          res.status(404).json({ message: "User or Society not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Error following society", error });
      }
    }
  };

  unfollowSociety = async (req: express.Request, res: express.Response) => {
    const { societyId } = req.body;
    const userId=req.user?.id

    try {
      const follower = await AppDataSource.getRepository(Follower).findOne({
        where: {
          user: { id: userId },
          society: { id: societyId },
        },
        relations: ["user", "society"],
      });

      if (!follower) {
        res.status(404).json({ message: "Follow relationship not found" });
      } else {
        await AppDataSource.getRepository(Follower).remove(follower);
        res
          .status(200)
          .json({ message: "Successfully unfollowed the society" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error unfollowing society", error });
    }
  };
}

export default new FollowerController();
