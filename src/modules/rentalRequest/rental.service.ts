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

const getMyRentalRequestFromDB = async (tenantId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
      property: {
        include: {
          category: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

const getAllLandlordRequestFromDB = async (landlordId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        include: {
          category: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

const rentalRequestStatusFromDB = async (
  landlordId: string,
  role: string,
  rentalRequestId: string,
  status: "APPROVED" | "REJECTED",
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  // Admin can manage everything
  if (role !== "ADMIN" && rentalRequest.property.landlordId !== landlordId) {
    throw new Error("Unauthorized");
  }

  if (rentalRequest.status !== "PENDING") {
    throw new Error("This request has already been processed");
  }

  const updatedRequest = await prisma.rentalRequest.update({
    where: {
      id: rentalRequestId,
    },
    data: {
      status,
    },
    include: {
      property: true,
    },
  });

  return updatedRequest;
};

export const rentalService = {
  createRentalRequestInDB,
  getMyRentalRequestFromDB,
  getAllLandlordRequestFromDB,
  rentalRequestStatusFromDB,
};
