import { PrismaClient } from "@prisma/client";
import { hashPassword, sanitizeUserData } from "../utils/auth.utils.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const registerUser = async (body) => {
  let { username, email, password, isGuest, role } = body;
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
