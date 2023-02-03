import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import { hotelServices } from "@/services/hotels-service";

export async function findAll(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const data = await hotelServices.findAll(Number(userId));
    res.send(data);
  } catch (error) {
    if (error.name === "NotFoundError") return res.sendStatus(404);
    if (isNaN(error)) return res.status(500).send(error);
    res.sendStatus(error);
  }
}

export async function findById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;
  try {
    const data = await hotelServices.findWithRoomsById(Number(userId), Number(hotelId));
    res.send(data);
  } catch (error) {
    if (error.name === "NotFoundError") return res.sendStatus(404);
    if (isNaN(error)) return res.status(500).send(error);
    res.sendStatus(error);
  }
}
