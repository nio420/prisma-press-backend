import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";

const registerUserIntoDB = async(payload: RegisterUserPayload) => {
    const { email, name, password, profile_photo } = payload;

    const isUserExist = await prisma.user.findUnique({where: {email}})

    if (isUserExist) {
    throw new Error("User already exists with this email!");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
    data: {
        name,
        email,
        password: hashedPassword,
        profile: {
            create: {
                profile_photo
            }
        }
    }
    })

    // await prisma.profile.create({
    // data: {
    //     userId: createdUser.id,
    //     profile_photo,
    // }
    // })

    const user = await prisma.user.findUnique({
    where: {
        id: createdUser.id,
        email: createdUser.email
    },
    omit: {password: true},
    include: {
        profile: true,
    }

    })

    return user;
    }


const getMyProfileFromDB = async(userid: string) => {
        const userProfile = await prisma.user.findUniqueOrThrow({
            where: {id: userid},
            omit: {password: true},
            include: {profile: true}
        })

        return userProfile;
 }

const updateMyProfileDB = async (userId: string, payload: any) => {
        const {name, email, profile_photo, bio} = payload;

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name,
                email,
                profile: {
                    update: {
                        profile_photo,
                        bio
                    }
                }
            },
            omit: {password: true},
            include: {profile: true}

        })

        return updatedUser;
} 

export const userService = {
    registerUserIntoDB,
    getMyProfileFromDB,
    updateMyProfileDB
}
