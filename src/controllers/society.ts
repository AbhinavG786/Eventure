import express from "express";
import { Society } from "../entities/Society";
import { imagekit } from "../utils/imageKit";
import { AppDataSource } from "../data-source";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../utils/redis";
import { SocietyType } from "../entities/enum/societyType";

class SocietyController {
  createSociety = async (req: express.Request, res: express.Response) => {
    const { name, description, type } = req.body;
    try {
      const society = new Society();
      society.name = name;
      society.description = description;
      society.type = type;
      const newSociety = await AppDataSource.getRepository(Society).save(
        society
      );
      res.status(201).json({
        message: "Society created successfully",
        society: newSociety,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating society",
        error,
      });
    }
  };

  getSocietyById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      const society = await AppDataSource.getRepository(Society).findOne({
        where: { id },
        relations: ["admin"],
      });
      if (!society) {
        res.status(404).json({
          message: "Society not found",
        });
      }
      res.status(200).json({
        message: "Society found",
        society,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error getting society",
        error,
      });
    }
  };

  getAllSocieties = async (req: express.Request, res: express.Response) => {
    try {
      const societies = await AppDataSource.getRepository(Society).find({relations:[
        "admin","followers", "events", "announcements"
      ]});
      res.status(200).json({
        message: "Societies found",
        societies,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error getting societies",
        error,
      });
    }
  };

  updateSocietyById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { name, description, societyType } = req.body;
    try {
      if (societyType && !Object.values(SocietyType).includes(societyType)) {
        res.status(400).json({ message: "Invalid society type" });
        return;
      }
      const society = await AppDataSource.getRepository(Society).findOne({
        where: { id },
      });
      if (!society) {
        res.status(404).json({
          message: "Society not found",
        });
      } else {
        society.name = name;
        society.description = description;
        society.type = societyType;
        const updatedSociety = await AppDataSource.getRepository(Society).save(
          society
        );
        res.status(200).json({
          message: "Society updated successfully",
          society: updatedSociety,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating society",
        error,
      });
    }
  };

  deleteSocietyById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      const society = await AppDataSource.getRepository(Society).findOne({
        where: { id },
      });
      if (!society) {
        res.status(404).json({
          message: "Society not found",
        });
        return
      } else {
        await AppDataSource.getRepository(Society).remove(society);
        res.status(200).json({
          message: "Society deleted successfully",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting society",
        error,
      });
    }
  };

  uploadSocietyLogoBeforeSignUp = async (
    req: express.Request,
    res: express.Response
  ) => {
    const sessionId = uuidv4();
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "No file uploaded" });
      } else {
        const uploadedSocietyLogo = await imagekit.upload({
          file: file.buffer,
          fileName: `society-${sessionId}.jpg`,
          folder: "/society-pics",
        });
        await redisClient.set(
          `signup:logo:${sessionId}`,
          uploadedSocietyLogo.url,
          {
            EX: 600, // Expiry time in seconds
          }
        );
        res.status(200).json({
          message: "Society logo uploaded successfully",
          sessionId,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error uploading society logo",
        error,
      });
    }
  };
}

export default new SocietyController();
