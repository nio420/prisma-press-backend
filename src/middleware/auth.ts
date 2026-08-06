import config from "../config"
import { catchAsync } from "../utils/catchAsync"
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { jwtUtils } from "../utils/jwt";
import { prisma } from "../lib/prisma";


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: Role;
            }
        }
    }
}

export const auth = (...requiredRole: Role[]) => {
    return catchAsync(async(req: Request, res: Response, next: NextFunction) => {

        const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;

        if (!token) {
            throw new Error ("Your are not logged in. Please login first!");
        }

         const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret)
         console.log(verifiedToken);
         
         if (!verifiedToken.success) {
            throw new Error(verifiedToken.error)
         } 

         const {name, email, id, role} = verifiedToken.data as JwtPayload;

         if (requiredRole.length && !requiredRole.includes(role)) {
           return res.status(403).send({
             success: false, 
             statusCode: 403,
             message: "Unauthorized Access!" });
         }         

         const user = await prisma.user.findUnique({
            where: {
                id,
                name,
                email,
                role
            }
         })

         if (!user) {
            throw new Error("User not found!");
         }

         if (user.active_status === "INACTIVE") {
            throw new Error("Your account is inactive. Please contact admin!");
         }

         req.user = {id, name, email, role}

         next()
    })
}