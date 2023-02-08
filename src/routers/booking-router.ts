import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingGet, bookingPost, bookingPut } from "@/controllers/booking-controller";

const bookingRouter = Router();

bookingRouter.all("/*", authenticateToken).post("/", bookingPost).get("/", bookingGet).put("/:bookingId", bookingPut);

export { bookingRouter };
