import { prisma } from "../../lib/prisma";

const getAllPropertiesFromDB = async () => {
  const properties = await prisma.property.findMany();
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
