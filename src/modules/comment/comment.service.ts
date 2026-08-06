import { prisma } from "../../lib/prisma"
import { ICreateCommentPayload, IMOderateCommentPayload, IUpdateCommentPayload } from "./comment.interface"

const createCommentDb = async (authorId: string, payload: ICreateCommentPayload) => {
        await prisma.post.findUniqueOrThrow({
            where: {
                id: payload.postId
            }
        })

        const comment = await prisma.comment.create({
            data: {
                ... payload,
                authorId
            }
        })

        return comment
}

const getCommentByAuthorIdDb = async (authorId: string) => {
        const comment = await prisma.comment.findMany({
            where: {
                authorId
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                post : {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        })

        return comment
}

const getCommentByPostIdDb = async (postId: string) => {
        const comment = await prisma.comment.findMany({
            where: {
                postId
            },
        })    
        return comment
}

const updateCommentDb = async (commentId: string, data: IUpdateCommentPayload, authorId: string) => {
            const commentData = await prisma.comment.findUnique({
                where: {
                    id: commentId,
                    authorId
                },
                select: {
                    id: true
                }
            })

            if(!commentData) {
                throw new Error("Your provided data is not valid!")
            }

            const comment = await prisma.comment.update({
                where: {
                    id: commentId,
                    authorId
                },
                data
            })

            return comment
}

const deleteCommentDb = async (commentId: string, authorId: string) => {    
        const commentData = await prisma.comment.findUniqueOrThrow({
            where: {
                id: commentId,
                authorId
            },
            select: {id: true}
        })

        const comment = await prisma.comment.delete({
            where: {
                id: commentData.id
            }
        })

        return comment
    }
const moderateCommentDb = async (commentId: string , data: IMOderateCommentPayload) => {
        const commentData = await prisma.comment.findUniqueOrThrow({
            where: {
                id: commentId
            },
            select: {id: true, status: true}
        })

        if(commentData.status === data.status) {
            throw new Error(`Your provided status (${data.status}) is the same as the current status`)
        }

        const comment = await prisma.comment.update({
                where: {
                    id: commentId
                },
                data
        })

        return comment
}

export const commentService = {
    createCommentDb,
    getCommentByAuthorIdDb,
    getCommentByPostIdDb,
    updateCommentDb,
    deleteCommentDb,
    moderateCommentDb
}