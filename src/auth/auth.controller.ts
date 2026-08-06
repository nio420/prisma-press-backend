import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { SendResponse } from "../utils/sendRespons";
import { authService } from "./auth.service";
import {StatusCodes}  from "http-status-codes";

const loginUser = catchAsync( async(req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const {accessToken, refreshToken} = await authService.loginUserDB(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 , // 1 days or 24 hours
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days or 1 week
    })

    SendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User logged in successfully!",
        data: {
            accessToken,
            refreshToken
        }
    })
})

const refreshToken = catchAsync( async(req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refreshToken;

        const accessToken = await authService.refreshTokenDB(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 , // 1 days or 24 hours
    })        

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Token refreshed successfully!",
            data: accessToken
        })
})

export const authController = {
  loginUser,
  refreshToken
}