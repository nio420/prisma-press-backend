import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import {catchAsync} from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendRespons";
import {StatusCodes}  from "http-status-codes";

const regiserUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;

  const user = await userService.registerUserIntoDB(payload);

SendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "User registered successfully!",
    data: user,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

     const profile = await userService.getMyProfileFromDB(req.user?.id as string)

     SendResponse(res, {
         success: true,
         statusCode: StatusCodes.OK,
         message: "User Profile fetched successfully!",
         data: profile,
     })
});

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const payload = req.body;

    const updatedUser = await userService.updateMyProfileDB(userId, payload);

    SendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User Profile updated successfully!",
        data: updatedUser,
    })
})

export const userController = {
  regiserUser,
  getMyProfile,
  updateMyProfile
}