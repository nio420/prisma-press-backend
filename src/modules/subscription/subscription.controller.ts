import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { SendResponse } from "../../utils/sendRespons";
import { StatusCodes } from "http-status-codes";

const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id
        const result = await subscriptionService.createCheckoutSessionDB(userId as string)

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "Checkout Session created successfully!",
            data: result,
        })
})

const webhookHandler = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
        const event = req.body as Buffer;
        const signature = req.headers['stripe-signature']!;

        console.log("Is Buffer:", Buffer.isBuffer(req.body));
        console.log("Body Type:", typeof req.body);
        console.log("Stripe Signature:", signature);

        const result = await subscriptionService.webhookHandlerDB(event, signature as string)

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Webhook Handler called successfully!",
            data: result,
        })
})

const getSubscriptionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    const result = await subscriptionService.getSubscriptionStatusDB(userId as string)

    SendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Subscription Status fetched successfully!",
        data: result,
    })
})

export const subscriptionController = {
    createCheckoutSession,
    webhookHandler,
    getSubscriptionStatus
}