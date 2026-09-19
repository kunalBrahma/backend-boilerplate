import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateBody = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
};
