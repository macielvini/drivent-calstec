import { AuthenticatedRequest } from "@/middlewares";
import paymentsServices from "@/services/payments-service";
import { Response } from "express";

export async function getInfo(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query;
  const { userId } = req;

  try {
    if (!ticketId) return res.sendStatus(400);

    const data = await paymentsServices.getPaymentWithTicketId(Number(userId), Number(ticketId));

    res.send(data);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(404);
    }

    if (error.name === "UnauthorizedError") {
      return res.sendStatus(401);
    }

    res.sendStatus(500);
  }
}
