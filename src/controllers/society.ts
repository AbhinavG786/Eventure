import express from "express";
import { Society } from "../entities/Society";
import { AppDataSource } from "../data-source";

class SocietyController {
  createSociety = async (req: express.Request, res: express.Response) => {
    const { name, description } = req.body;
    try {
      const society = new Society();
      society.name = name;
      society.description = description;
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
      const societies = await AppDataSource.getRepository(Society).find();
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
    const { name, description } = req.body;
    try {
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
}

export default new SocietyController();
