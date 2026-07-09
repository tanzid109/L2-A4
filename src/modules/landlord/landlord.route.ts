import { Router } from "express";
import { landlordController } from "./landlord.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.LANDLORD), landlordController.registerProperty);
router.get(
  "/my-properties",
  auth(Role.LANDLORD),
  landlordController.myProperties,
);
router.get("/:id", landlordController.getPropertyById);
router.put("/:id", auth(Role.LANDLORD), landlordController.updatePropertyById);
router.delete(
  "/:id",
  auth(Role.LANDLORD, Role.ADMIN),
  landlordController.deletePropertyById,
);

export const landlordRoutes = router;
