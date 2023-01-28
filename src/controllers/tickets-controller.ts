import { Request, Response } from "express";

import ticketsServices from "@/services/tickets-service";

export async function ticketsPost(req: Request, res: Response) {
  try {
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function getTicketTypes(req: Request, res: Response) {
  try {
    const data = await ticketsServices.findTicketTypes();

    res.send(data);
  } catch (error) {
    res.sendStatus(500);
  }
}
