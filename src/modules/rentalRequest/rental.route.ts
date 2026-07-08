import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/:id", auth(Role.TENANT), rentalController.createRentalRequest);

router.get(
  "/my-requests",
  auth(Role.TENANT),
  rentalController.getMyRentalRequest,
);

router.get(
  "/landlord",
  auth(Role.LANDLORD),
  rentalController.getAllLandlordRequest,
);
router.patch(
  "/landlord/:id",
  auth(Role.LANDLORD, Role.ADMIN),
  rentalController.rentalRequestStatus,
);

export const rentalRoutes = router;

// POST   /api/rentals              // Tenant Apply

// GET    /api/rentals/my-requests  // Tenant

// GET    /api/rentals/landlord     // Landlord

// PATCH  /api/rentals/:id          // Approve/Reject

// GET    /api/admin/rentals        // Admin
