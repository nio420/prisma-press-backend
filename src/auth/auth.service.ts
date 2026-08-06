import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { IloginUser } from "./auth.interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../config";
import { jwtUtils } from "../utils/jwt";

const loginUserDB = async (payload: IloginUser) => {
    const {email, password} = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {email}
    })
    
         if (user.active_status === "INACTIVE") {
            throw new Error("Your account is inactive. Please contact admin!");
         }
    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if(!isPasswordMatched){
        throw new Error("Invalid Credentials!")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, {expiresIn: config.jwt_access_expiry} as SignOptions)
    
    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret, {expiresIn: config.jwt_refresh_expiry} as SignOptions)

    return {
        accessToken,
        refreshToken,
        
    }
}

const refreshTokenDB = async (refreshToken: string) => {
        const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret)

        if(!verifiedRefreshToken.success){
            throw new Error(verifiedRefreshToken.error)
        }

        const {id} = verifiedRefreshToken.data as JwtPayload
        const user = await prisma.user.findUniqueOrThrow({
            where: {id}
        })

        if(user.active_status === "INACTIVE"){
            throw new Error("Your account is inactive. Please contact admin!")
        }

        const jwtPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        // const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expiry as SignOptions)
        const accessToken = jwtUtils.createToken(
            jwtPayload,
            config.jwt_access_secret,
            {
                expiresIn: config.jwt_access_expiry as SignOptions['expiresIn']
            }
            )


        return {accessToken}
        
}


export const authService = {
    loginUserDB,
    refreshTokenDB
}