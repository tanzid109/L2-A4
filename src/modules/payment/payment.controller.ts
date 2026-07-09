import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import config from "../../config";

const createPaymentSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { rentalRequestId } = req.params;

    const result = await paymentService.createPaymentSessionInDB(
      rentalRequestId as string,
      userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Webhook hit");
    const signature = req.headers["stripe-signature"] as string;
    const payload = req.body as Buffer;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe_webhook_secret as string,
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await paymentService.handleWebhookInDB(session);
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Webhook handled successfully",
      data: null,
    });
  },
);

const completePaymentSuccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rentalRequestId, session_id } = req.query;
    const sessionId = typeof session_id === "string" ? session_id : undefined;

    if (!sessionId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Stripe session id is required",
        data: null,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Never trust the redirect alone — confirm Stripe actually recorded payment.
    if (session.payment_status !== "paid") {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Payment not completed",
        data: null,
      });
    }

    const resolvedRentalRequestId =
      (typeof rentalRequestId === "string" && rentalRequestId) ||
      session.client_reference_id ||
      session.metadata?.rentalRequestId;

    if (!resolvedRentalRequestId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Rental request id is required",
        data: null,
      });
    }

    await paymentService.completePaymentInDB(resolvedRentalRequestId, {
      transactionId: session.id,
      amount: Number(session.amount_total ?? 0),
      paymentIntent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment completed successfully",
      data: null,
    });
  },
);

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const result = await paymentService.getMyPaymentsFromDB(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payments retrieved successfully",
      data: result,
    });
  },
);

const getPaymentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.id as string;

    const result = await paymentService.getPaymentByIdFromDB(
      id as string,
      userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createPaymentSession,
  handleWebhook,
  completePaymentSuccess,
  getMyPayments,
  getPaymentById,
};
