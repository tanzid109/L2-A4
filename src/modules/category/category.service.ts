import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";

const createCategoryInDB = async (payload: ICategory, id: string) => {
  const { name } = payload;

  const isExistingCategory = await prisma.category.findUnique({
    where: { name },
  });
  if (isExistingCategory) {
    throw new Error("Category with this name already exists");
  }
  const createdCategory = await prisma.category.create({
    data: {
      name,
      createdBy: id,
    },
  });
  return createdCategory;
};

const getAllCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

const getCategoryByIdFromDB = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  return category;
};

const updateCategoryInDB = async (
  id: string,
  payload: ICategory,
  userId: string,
  userRole: string,
) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  const isOwner = existingCategory.createdBy === userId;
  const isAdmin = userRole === Role.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new Error("You are not allowed to modify this category");
  }

  const category = await prisma.category.update({
    where: { id },
    data: payload,
  });
  return category;
};

const deleteCategoryFromDB = async (
  id: string,
  userId: string,
  userRole: string,
) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  const isOwner = existingCategory.createdBy === userId;
  const isAdmin = userRole === Role.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new Error("You are not allowed to modify this category");
  }

  const category = await prisma.category.delete({
    where: { id },
  });
  return category;
};

export const categoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getCategoryByIdFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
