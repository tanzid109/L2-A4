import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { propertyRoutes } from "./modules/properties/properties.route";
import { landlordRoutes } from "./modules/landlord/landlord.route";
import { rentalRoutes } from "./modules/rentalRequest/rental.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { paymentController } from "./modules/payment/payment.controller";
import { reviewRoutes } from "./modules/review/review.route";
import path from "path";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { adminRoutes } from "./modules/admin/admin.route";

const app: Application = express();

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

app.use(
  cors({
    origin: ["http://localhost:5000", "https://rentnest-ecru.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/landlord/properties", landlordRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin",adminRoutes)

app.use(notFound);
app.use(globalErrorHandler);

export default app;
