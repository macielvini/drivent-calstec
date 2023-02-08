import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingGet, bookingPost } from "@/controllers/booking-controller";

const bookingRouter = Router();

bookingRouter.all("/*", authenticateToken).post("/", bookingPost).get("/", bookingGet);

export { bookingRouter };
