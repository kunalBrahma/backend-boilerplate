import { Request, Response } from "express";
import prisma from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
  });
  res.json(users);
});
