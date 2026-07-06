import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try{
        await fn(req,res,next)
    } catch (error:any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: error.statusCode || 500,
          message: error.message,
          stack: error.stack,
          data: null,
        });
    }
  };
};
