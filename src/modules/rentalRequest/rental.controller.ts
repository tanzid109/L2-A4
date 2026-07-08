import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const role = req.user?.role;
  const { id } = req.params;

  const result = await rentalService.createRentalRequestInDB(
    userId as string,
    role as string,
    id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental request submitted successfully",
    data: result,
  });
});

const getMyRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const result = await rentalService.getMyRentalRequestFromDB(id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request retrived successfully",
      data: result,
    });
  },
);
const getAllLandlordRequest = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.user?.id;

    const result = await rentalService.getAllLandlordRequestFromDB(
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      data: result,
    });
  },
);

const rentalRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req.user?.id;
  const role = req.user?.role;

  const { id } = req.params;
  const { status } = req.body;

  const result = await rentalService.rentalRequestStatusFromDB(
    landlordId as string,
    role as string,
    id as string ,
    status,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Rental request ${status.toLowerCase()} successfully`,
    data: result,
  });
});

export const rentalController = {
  createRentalRequest,
  getMyRentalRequest,
  getAllLandlordRequest,
  rentalRequestStatus,
};
