import { NextFunction, Request, Response } from "express";
declare function deleteClass(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>;
export { deleteClass };
