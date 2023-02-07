import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import { notFoundError } from "@/errors";

import bookingService from "@/services/booking-service";

export async function bookingPost(req: AuthenticatedRequest, res: Response) {
  const userId = Number(req.userId);
  const roomId = Number(req.body.roomId);

  if (!roomId) throw notFoundError();

  try {
    const data = await bookingService.createOne(userId, roomId);

    res.status(200).send(data.id);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(404).send(error);
    if (error.name === "RoomIsFullError") return res.status(403).send(error);

    return res.sendStatus(500);
  }
}
