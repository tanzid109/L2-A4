import { prisma } from "../../lib/prisma";
import { ILandlord } from "./landlord.interface";

const registerPropertyInDB = async (
  payload: ILandlord,
  id: string,
  role: string,
) => {
  const {
    categoryId,
    title,
    description,
    address,
    city,
    price,
    bedrooms,
    bathrooms,
    status,
  } = payload;
  if (role !== "LANDLORD") {
    throw new Error("Only landlords can register properties");
  }
  if (!id) {
    throw new Error("User ID is required");
  }

  const property = await prisma.property.create({
    data: {
      categoryId,
      title,
      description,
      address,
      city,
      price,
      bedrooms,
      bathrooms,
      status,
      landlordId: id,
    },
  });

  return property;
};

const getPropertyByIdFromDB = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });
  return property;
};

const updatePropertyByIdInDB = async (
  id: string,
  role: string,
  userId: string,
  payload: Partial<ILandlord>,
) => {
  if (role !== "LANDLORD") {
    throw new Error("Only landlords can update properties");
  }

  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.landlordId !== userId) {
    throw new Error("You are not the owner of this property");
  }

  const updatedProperty = await prisma.property.update({
    where: { id },
    data: payload,
  });

  return updatedProperty;
};

const deletePropertyByIdFromDB = async (
  id: string,
  role: string,
  userId: string,
) => {
  if (role !== "LANDLORD") {
    throw new Error("Only landlords can delete properties");
  }

  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.landlordId !== userId) {
    throw new Error("You are not the owner of this property");
  }

  await prisma.property.delete({
    where: { id },
  });
};

const myPropertiesFromDB = async (userId: string) => {
  const properties = await prisma.property.findMany({
    where: { landlordId: userId },
  });
  return properties;
};

export const landlordService = {
  registerPropertyInDB,
  getPropertyByIdFromDB,
  updatePropertyByIdInDB,
  deletePropertyByIdFromDB,
  myPropertiesFromDB,
};
