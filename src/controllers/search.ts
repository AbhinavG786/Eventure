import { ILike, Between, MoreThan } from "typeorm";
import { EventEntity } from "../entities/EventEntity";
import { SocietyType } from "../entities/enum/societyType";
import { AppDataSource } from "../data-source";
import express from "express";

class SearchController {
  searchEvents = async (req: express.Request, res: express.Response) => {
    const { query, upcoming, type, startDate, endDate } = req.query;
    const { skip, take } = req.pagination!;
    try {
      const where: any = [];

      if (query) {
        where.push({
          name: ILike(`%${query}%`),
        });

        where.push({
          description: ILike(`%${query}%`),
        });

        where.push({
          society: {
            name: ILike(`%${query}%`),
          },
        });
      }

      const filters: any = {};

      if (upcoming === "true") {
        filters.startTime = MoreThan(new Date());
      }

      if (startDate && endDate) {
        filters.startTime = Between(
          new Date(startDate as string),
          new Date(endDate as string)
        );
      }

      if (type && Object.values(SocietyType).includes(type as SocietyType)) {
        filters.society = {
          ...(filters.society || {}),
          type: type as SocietyType,
        };
      }

      const [events, total] = await AppDataSource.getRepository(
        EventEntity
      ).findAndCount({
        where: where.length
          ? where.map((condition: any) => ({ ...filters, ...condition }))
          : filters,
        relations: ["society"],
        order: { startTime: "ASC" },
        skip,
        take,
      });
      const hasMore = skip + take < total;
      res.status(200).json({
        events,
        hasMore,
        currentPage: req.pagination!.page,
        totalPages: Math.ceil(total / take),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  };

  filterBySocietyType = async (req: express.Request, res: express.Response) => {
    const { type } = req.query;
    const { skip, take } = req.pagination!;
    try {
      let societyType: SocietyType | undefined;
      if (
        typeof type === "string" &&
        Object.values(SocietyType).includes(type as SocietyType)
      ) {
        societyType = type as SocietyType;
      }

      const [events, total] = await AppDataSource.getRepository(
        EventEntity
      ).findAndCount({
        where: societyType
          ? {
              society: {
                type: societyType,
              },
            }
          : {},
        relations: ["society"],
        order: { startTime: "ASC" },
        skip,
        take,
      });
      const hasMore = skip + take < total;
      res
        .status(200)
        .json({
          events,
          hasMore,
          currentPage: req.pagination!.page,
          totalPages: Math.ceil(total / take),
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  };
}

export default new SearchController();
