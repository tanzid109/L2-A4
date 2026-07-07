import  httpStatus  from 'http-status';
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
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getAllLandlordRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const rentalRequestStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const rentalController = {
  createRentalRequest,
  getMyRentalRequest,
  getAllLandlordRequest,
  rentalRequestStatus,
};
