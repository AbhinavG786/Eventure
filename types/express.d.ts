import express from "express";

declare global {
  namespace Express {
    interface User {
      id: string;
    }

    interface Request {
      user?: User;
    }
  }
}
