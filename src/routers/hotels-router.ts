import { findAll, findById } from "@/controllers/hotels-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter.all("/*", authenticateToken).get("/", findAll).get("/:hotelId", findById);

export { hotelsRouter };
