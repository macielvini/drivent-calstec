import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { hotelServices } from "@/services/hotels-service";

export async function findAll(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const data = await hotelServices.findAll(Number(userId));
    res.send(data);
  } catch (error) {
    if (error.name === "CustomError") return res.status(error.status).send(error.message);
    return res.sendStatus(error) || res.sendStatus(500);
  }
}

export async function findById(eq: AuthenticatedRequest, res: Response) {
  try {
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    res.sendStatus(500);
  }
}
