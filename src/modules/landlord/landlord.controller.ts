import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landlordService } from "./landlord.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const registerProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const id = req.user?.id as string;
    const role = req.user?.role as string;
    const property = await landlordService.registerPropertyInDB(
      payload,
      id,
      role,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "property created successfully",
      data: { property },
    });
  },
);

const getPropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const property = await landlordService.getPropertyByIdFromDB(id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "property fetched successfully",
      data: { property },
    });
  },
);

const updatePropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const role = req.user?.role as string;
    const userId = req.user?.id as string;
    const payload = req.body;
    const property = await landlordService.updatePropertyByIdInDB(
      id as string,
      role as string,
      userId as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "property updated successfully",
      data: { property },
    });
  },
);

const deletePropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const role = req.user?.role as string;
    const userId = req.user?.id as string;
    await landlordService.deletePropertyByIdFromDB(
      id as string,
      role as string,
      userId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "property deleted successfully",
      data: null,
    });
  },
);

const myProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const properties = await landlordService.myPropertiesFromDB(
      userId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "my properties fetched successfully",
      data: { properties },
    });
  },
);

export const landlordController = {
  registerProperty,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
  myProperties,
};
