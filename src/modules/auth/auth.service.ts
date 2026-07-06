import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./auth.interface";

const registerUserInDB = async (payload: IRegisterUser) => {
  const { name, email, password, phone, activeStatus, role } = payload;

  // check if user already exists
  const isExistingUser = await prisma.user.findUnique({ where: { email } });
  if (isExistingUser) {
    throw new Error("User with this email already exists");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      phone,
      activeStatus,
      role,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

export const authService = {
  registerUserInDB,
};
