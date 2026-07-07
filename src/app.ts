import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { propertyRoutes } from "./modules/properties/properties.route";
import { landlordRoutes } from "./modules/landlord/landlord.route";



const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello RentNest API");
});

app.use("/api/auth",authRoutes)
app.use("/api/category", categoryRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/landlord/properties", landlordRoutes);

export default app;
