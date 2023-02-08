import { AuthenticatedRequest, handleApplicationErrors } from "@/middlewares";
import { Response } from "express";

import bookingService from "@/services/booking-service";

export async function bookingPost(req: AuthenticatedRequest, res: Response) {
  const userId = Number(req.userId);
  const roomId = Number(req.body.roomId);

  try {
    if (isNaN(roomId)) return res.status(422).send({ message: "roomId is required" });

    const data = await bookingService.createOne(userId, roomId);

    res.status(200).send({ bookingId: data.id });
  } catch (error) {
    handleApplicationErrors(error, req, res);
  }
}
