import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import { hotelServices } from "@/services/hotels-service";

export async function findAll(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const data = await hotelServices.findAll(Number(userId));
    res.send(data);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(404).send(error);
    if (error.name === "PaymentRequired") return res.status(402).send(error);

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
    if (error.name === "NotFoundError") return res.status(404).send(error);
    if (error.name === "PaymentRequired") return res.status(402).send(error);

    res.sendStatus(error);
  }
}
