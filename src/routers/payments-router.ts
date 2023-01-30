import { getInfo, postPayment } from "@/controllers/payments-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { paymentSchema } from "@/schemas/payments-schema";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken).get("/", getInfo).post("/process", postPayment);

export { paymentsRouter };
