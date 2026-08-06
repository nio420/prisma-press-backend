import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../lib/prisma";
import { SubcriptionStatus } from "../../generated/prisma/enums";

export const premiumGaurd = () => {
    return catchAsync ( async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    const subscription = await prisma.subscription.findUnique({
        where: {
            userId
        }
    })

    if(!subscription) {
        throw new Error('Please subscribe first to get access!');
    }

    if(subscription.status !== SubcriptionStatus.ACTIVE) {
        throw new Error('Please subscribe again to get access!');
    }

    next();
}
)}