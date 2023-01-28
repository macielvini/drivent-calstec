import { Request, Response } from "express";

export async function ticketsPost(req: Request, res: Response) {
  try {
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
