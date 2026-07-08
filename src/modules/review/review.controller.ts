import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { rating, comment } = req.body;
    const { propertyId } = req.params;

    const review = await reviewService.createReviewInDB(
      userId,
      propertyId as string,
      rating,
      comment,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully",
      data: review,
    });
  },
);

const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await reviewService.getAllReviewsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  },
);

export const reviewController = {
  createReview,
  getAllReviews,
};
