import { Response } from "express";

import ticketsServices from "@/services/tickets-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function ticketsPost(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;
  try {
    const data = await ticketsServices.create(Number(userId), Number(ticketTypeId));

    res.status(201).send(data);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(404);
    }
    res.sendStatus(500);
  }
}

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const data = await ticketsServices.findTicketTypes();

    res.send(data);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function getTicketByUserId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const ticketData = await ticketsServices.findTicketByUserId(Number(userId));
    res.status(200).send(ticketData);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(404);
    }
    res.sendStatus(500);
  }
}
