import express from "express";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

declare module "express" {
  interface Request {
    pagination?: PaginationParams;
  }
}

const paginationMiddleware = (defaultLimit = 10, maxLimit = 50) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit as string) || defaultLimit, maxLimit);

    req.pagination = {
      page,
      limit,
      skip: (page - 1) * limit,
      take: limit,
    };

    next();
  };
};

export default paginationMiddleware;