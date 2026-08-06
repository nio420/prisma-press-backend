import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendRespons";
import { StatusCodes } from "http-status-codes";
import { premiumService } from "./premium.service";

const getPremiumContent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await premiumService.getPremiumContent(query)

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Premium Content fetched successfully!",
            data: result.data,
            meta: result.meta
        })
})  


export const premiumController = {
    getPremiumContent
}