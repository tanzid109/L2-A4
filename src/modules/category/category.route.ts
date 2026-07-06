import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.LANDLORD),
  categoryController.createCategory,
);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getSingleCategory);
router.put(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  categoryController.deleteCategory,
);

export const categoryRoutes = router;
