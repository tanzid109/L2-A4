import { prisma } from "../../lib/prisma";

const createReviewInDB = async (
  userId: string,
  propertyId: string,
  rating: number,
  comment: string,
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId: userId,
      propertyId,
      status: "ACTIVE",
    },
  });

  if (!rentalRequest) {
    throw new Error("Only the tenant who rented this property can review it");
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      tenantId: userId,
      propertyId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this property");
  }

  const review = await prisma.review.create({
    data: {
      propertyId,
      tenantId: userId,
      rating,
      comment,
    },
  });

  return review;
};

const getAllReviewsFromDB = async () => {
  return prisma.review.findMany({
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const reviewService = {
  createReviewInDB,
  getAllReviewsFromDB,
};
