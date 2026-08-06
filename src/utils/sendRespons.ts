import { TResponsData } from "../modules/user/user.interface";
import { Response } from "express";

export const SendResponse = <T> (res: Response, data: TResponsData<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
}