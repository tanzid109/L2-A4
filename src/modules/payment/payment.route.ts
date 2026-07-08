import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create/:rentalRequestId",
  auth(Role.TENANT),
  paymentController.createPaymentSession,
);

router.get(
  "/success",
  auth(Role.TENANT),
  paymentController.completePaymentSuccess,
);

router.get("/", auth(Role.TENANT), paymentController.getMyPayments);

router.get("/:id", auth(Role.TENANT), paymentController.getPaymentById);

export const paymentRoutes = router;
