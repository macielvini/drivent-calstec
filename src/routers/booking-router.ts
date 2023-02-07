import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingPost } from "@/controllers/booking-controller";

const bookingRouter = Router();

bookingRouter.all("/*", authenticateToken).post("/", bookingPost);

export { bookingRouter };
