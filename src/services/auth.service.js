import { PrismaClient } from "@prisma/client";
import { hashPassword, sanitizeUserData } from "../utils/auth.utils.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const registerUser = async (body) => {
  let { username, email, password, isGuest, role } = body;
  console.log(
    "process.env.DATABASE_URL",
    process.env.DATABASE_URL,
    "process.env.DIRECT_URL",
    process.env.DIRECT_URL,
    process.env.jwtSecret
  );

  if (!username || !email || !password || !role) {
    throw new Error("All fields are required");
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }
  password = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: { username, email, password, isGuest, role },
  });
  const sanitizedUser = sanitizeUserData(newUser);

  return sanitizedUser;
};

export const loginUser = async (body) => {
  let { email, password } = body;
  if (!email || !password) {
    throw new Error("All fields are required");
  }
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User nit fond");
  }
  let isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.jwtSecret,
    { expiresIn: "7d" }
  );
  return token;
};

export const getAllUser = async () => {
  const users = prisma.user.findMany();
  if (!users) {
    throw new Error("User not fond");
  }
  const sanitizedUser = sanitizeUserData(users);

  return sanitizedUser;
};

export const getUserId = async (query) => {
  const id = parseInt(query.id);
  const user = await prisma.user.findUnique({ where: { id: id } });
  if (!user) {
    throw new Error("User not fond");
  }
  const sanitizedUser = sanitizeUserData(user);

  return user;
};

export const editUser = async (body) => {
  const { ...updatedFields } = body;
  const id = parseInt(body.id);

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not fond");
  }
  Object.keys(updatedFields).forEach((key) => {
    if (updatedFields[key] !== undefined) {
      user[key] = updatedFields[key];
    }
  });

  const useredit = await prisma.user.update({
    where: { id: body.id },
    data: user,
  });
  return useredit;
};

export const deleteUser = async (query) => {
  const id = parseInt(query.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not fond");
  }
  const userDeleted = prisma.user.delete({ where: { id: id } });

  return userDeleted ? true : false;
};
