import { ticketsPost } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { ticketSchema } from "@/schemas/tickets-schema";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter.all("/*", authenticateToken).post("/", validateBody(ticketSchema), ticketsPost);

export { ticketsRouter };
