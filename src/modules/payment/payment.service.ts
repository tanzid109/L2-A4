import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";

const createPaymentSessionInDB = async (
  rentalRequestId: string,
  userId: string,
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      tenant: true,
      property: true,
      payment: true,
    },
  });

  if (!rental) {
    throw new Error("Rental request not found");
  }

  if (rental.tenantId !== userId) {
    throw new Error("Unauthorized");
  }

  if (rental.status !== "APPROVED") {
    throw new Error("Rental request is not approved yet");
  }

  if (rental.payment) {
    throw new Error("Payment already exists");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    customer_email: rental.tenant.email,

    payment_method_types: ["card", "amazon_pay", "pay_by_bank", "paypal"],

    line_items: [
      {
        quantity: 1,

        price_data: {
          currency: "usd",

          product_data: {
            name: rental.property.title,
          },

          unit_amount: Number(rental.property.price) * 100,
        },
      },
    ],

    metadata: {
      rentalRequestId: rental.id,
    },

    client_reference_id: rental.id,

    success_url: `${config.app_url}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment-cancel`,
  });

  await prisma.payment.create({
    data: {
      rentalRequestId: rental.id,
      transactionId: session.id,
      amount: Number(rental.property.price),
      provider: "STRIPE",
      status: "PENDING",
    },
  });

  return {
    checkoutUrl: session.url,
  };
};

const completePaymentInDB = async (
  rentalRequestId: string,
  paymentData: {
    transactionId: string;
    amount?: number | null;
    paymentIntent?: string | null;
  },
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: true,
    },
  });

  if (!rental) {
    throw new Error("Rental request not found");
  }

  if (rental.status === "ACTIVE") {
    return;
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);
  const normalizedAmount = Number(paymentData.amount ?? 0) / 100;

  await prisma.$transaction(async (tx) => {
    await tx.payment.upsert({
      where: {
        rentalRequestId,
      },
      create: {
        rentalRequestId,
        transactionId: paymentData.paymentIntent || paymentData.transactionId,
        amount: normalizedAmount,
        provider: "STRIPE",
        status: "SUCCESS",
        paidAt: new Date(),
      },
      update: {
        transactionId: paymentData.paymentIntent || paymentData.transactionId,
        amount: normalizedAmount,
        provider: "STRIPE",
        status: "SUCCESS",
        paidAt: new Date(),
      },
    });

    await tx.rentalRequest.update({
      where: {
        id: rentalRequestId,
      },
      data: {
        status: "ACTIVE",
        startDate,
        endDate,
        totalPrice: normalizedAmount,
      },
    });

    await tx.property.update({
      where: {
        id: rental.propertyId,
      },
      data: {
        status: "RENTED",
      },
    });

    await tx.rentalRequest.updateMany({
      where: {
        propertyId: rental.propertyId,
        status: "PENDING",
        NOT: {
          id: rentalRequestId,
        },
      },
      data: {
        status: "REJECTED",
      },
    });
  });
};

const handleWebhookInDB = async (session: Stripe.Checkout.Session) => {
  let rentalRequestId =
    session.metadata?.rentalRequestId ?? session.client_reference_id;

  if (!rentalRequestId) {
    const payment = await prisma.payment.findFirst({
      where: {
        transactionId: session.id,
      },
      select: {
        rentalRequestId: true,
      },
    });

    rentalRequestId = payment?.rentalRequestId ?? null;
  }

  if (!rentalRequestId) {
    throw new Error("Rental id missing");
  }

  await completePaymentInDB(rentalRequestId, {
    transactionId: session.id,
    amount: Number(session.amount_total ?? 0),
    paymentIntent:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : null,
  });
};

const getMyPaymentsFromDB = async (userId: string) => {
  return prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId: userId,
      },
    },

    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPaymentByIdFromDB = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,

      rentalRequest: {
        tenantId: userId,
      },
    },

    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

export const paymentService = {
  createPaymentSessionInDB,
  handleWebhookInDB,
  completePaymentInDB,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB,
};
