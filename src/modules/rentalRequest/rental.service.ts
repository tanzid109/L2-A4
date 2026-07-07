import { prisma } from "../../lib/prisma";

const createRentalRequestInDB = async (
  userId: string,
  role: string,
  propertyId: string,
) => {
  const userExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExist) {
    throw new Error("User not found");
  }

  if (role !== "TENANT") {
    throw new Error("Only tenants can apply for rent");
  }

  const propertyExist = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!propertyExist) {
    throw new Error("Property not found");
  }

  if (propertyExist.status !== "AVAILABLE") {
    throw new Error("Property is not available");
  }

  const alreadyRequested = await prisma.rentalRequest.findFirst({
    where: {
      tenantId: userId,
      propertyId,
      status: {
        in: ["PENDING", "APPROVED"],
      },
    },
  });

  if (alreadyRequested) {
    throw new Error("You have already requested this property");
  }

  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      tenantId: userId,
      propertyId,
      status: "PENDING",
    },
  });

  return rentalRequest;
};

const getMyRentalRequestFromDB = async () => {};

const getAllLandlordRequestFromDB = async () => {};

const rentalRequestStatusFromDB = async () => {};

export const rentalService = {
  createRentalRequestInDB,
  getMyRentalRequestFromDB,
  getAllLandlordRequestFromDB,
  rentalRequestStatusFromDB,
};
