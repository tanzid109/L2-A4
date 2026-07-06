import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.route";


const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello RentNest API");
});

app.use("/api/auth",authRoutes)

export default app;
