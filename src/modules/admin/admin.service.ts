import { prisma } from "../../lib/prisma";

const getAllUsersFromDB = async () => {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleUserFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUserStatusFromDB = async (
  userId: string,
  status: "ACTIVE" | "BANNED",
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { activeStatus: status },
    omit: {
      password: true,
    },
  });
};

const getAllRentalsFromDB = async () => {
  return prisma.rentalRequest.findMany({
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
          price: true,
          status: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleRentalFromDB = async (rentalId: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
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
          price: true,
          status: true,
        },
      },
      payment: true,
    },
  });

  if (!rental) {
    throw new Error("Rental not found");
  }

  return rental;
};

const getAllPropertiesFromDB = async () => {
  return prisma.property.findMany({
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const adminService = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserStatusFromDB,
  getAllRentalsFromDB,
  getSingleRentalFromDB,
  getAllPropertiesFromDB,
};
