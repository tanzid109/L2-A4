import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const id = req.user?.id as string;
    const category = await categoryService.createCategoryInDB(payload, id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "category created successfully",
      data: { category },
    });
  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await categoryService.getAllCategoriesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "categories fetched successfully",
      data: { categories },
    });
  },
);

const getSingleCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await categoryService.getCategoryByIdFromDB(id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "category fetched successfully",
      data: { category },
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;
    const category = await categoryService.updateCategoryInDB(
      id as string,
      payload,
      req.user?.id as string,
      req.user?.role as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "category updated successfully",
      data: { category },
    });
  },
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await categoryService.deleteCategoryFromDB(
      id as string,
      req.user?.id as string,
      req.user?.role as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "category deleted successfully",
      data: { category },
    });
  },
);

export const categoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
