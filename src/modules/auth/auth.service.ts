import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";

const registerUserInDB = async (payload: IRegisterUser) => {
  const { name, email, password, phone, role } = payload;
  if (role !== "TENANT" && role !== "LANDLORD") {
    throw new Error("Invalid role. Must be TENANT or LANDLORD");
  }

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

const loginUserFromDB = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });
  if (user.activeStatus === "BANNED") {
    throw new Error("User is banned");
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiration as SignOptions,
  );
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expiration as SignOptions,
  );
  return { accessToken, refreshToken };
};

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new Error(verifiedRefreshToken.error || "Invalid refresh token");
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  if (!id) {
    throw new Error("Invalid refresh token payload");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  if (user.activeStatus === "BANNED") {
    throw new Error("user is banned");
  }
  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiration as SignOptions,
  );
  return { accessToken };
};

const getUserFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
    include: {
      properties:true
    },
  });
  return user;
};

export const authService = {
  registerUserInDB,
  loginUserFromDB,
  refreshToken,
  getUserFromDB,
};
