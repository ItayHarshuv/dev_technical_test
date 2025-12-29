import { Request, Response } from "express";

export const getHome = (_req: Request, res: Response): void => {
  res.render("pages/index", {
    title: "Home",
    message: "Welcome to the TypeScript Express MongoDB Application!",
  });
};
