import { prisma } from "../../lib/prisma";
import { IQuery } from "./properties.interface";

const getAllPropertiesFromDB = async (query: IQuery) => {
  const { city, category, minPrice, maxPrice, status } = query;

  const where: any = {};

  if (city) {
    where.city = {
      contains: city,
      mode: "insensitive",
    };
  }

  if (category) {
    where.category = {
      name: {
        equals: category,
        mode: "insensitive",
      },
    };
  }

  if (status) {
    where.status = status;
  }

  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) {
      where.price.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.price.lte = Number(maxPrice);
    }
  }

  const properties = await prisma.property.findMany({
    where,
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

const getPropertyByIdFromDB = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id: id,
    },
  });
  return property;
};

export const propertyService = {
  getAllPropertiesFromDB,
  getPropertyByIdFromDB,
};
