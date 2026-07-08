import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.get("/users/:id", auth(Role.ADMIN), adminController.getSingleUser);
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
router.get("/rentals", auth(Role.ADMIN), adminController.getAllRentals);
router.get("/rentals/:id", auth(Role.ADMIN), adminController.getSingleRental);
router.get("/properties", auth(Role.ADMIN), adminController.getAllProperties);

export const adminRoutes = router;
