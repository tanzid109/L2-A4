import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./properties.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const properties = await propertyService.getAllPropertiesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All properties fetched successfully",
      data: properties,
    });
  },
);

const getPropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const property = await propertyService.getPropertyByIdFromDB(id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property fetched successfully",
      data: property,
    });
  },
);

export const propertyController = {
  getAllProperties,
  getPropertyById,
};
