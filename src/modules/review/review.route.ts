import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/:propertyId", auth(Role.TENANT), reviewController.createReview);
router.get("/", reviewController.getAllReviews);

export const reviewRoutes = router;
