import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { SendResponse } from "../../utils/sendRespons";
import { StatusCodes } from "http-status-codes";

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const Id = req.user?.id
        const payload = req.body

        const result = await postService.createPostDb(payload, Id as string)

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "Post created successfully!",
            data: result,
        })
})

const getAllposts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const query = req.query
        const posts = await postService.getAllPostsDb(query)
        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Posts fetched successfully!",
            data: posts.data,
            meta: posts.meta
        })
})


const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            const result = await postService.getPostStatsDb()

            SendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Post Stats fetched successfully!",
                data: result,
            })
})

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const authorId = req.user?.id

        const result = await postService.getMyPostsDb(authorId as string)

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "My Posts fetched successfully!",
            data: result,
        })
})

const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.postId

        if (!postId) {
            throw new Error("Post ID is required!")
        }

        const result = await postService.getPostByIdDb(postId as string)

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Single Post fetched successfully!",
            data: result,
        })
})

const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.postId;
        const authorId = req.user?.id
        const isAdmin = req.user?.role === "ADMIN"
        const payload = req.body;

        const result = await postService.updatePostDb(postId as string, payload, authorId as string, isAdmin)

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Post Update successfully!",
            data: result
        })
})

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const authorId = req.user?.id
        const isAdmin = req.user?.role === "ADMIN"        
        const postId = req.params.postId;

        if(!postId){
            throw new Error("Post ID is required!")
        }

        await postService.deletePostDb(postId as string, authorId as string, isAdmin)

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Post Deleted successfully!",
            data: null
        })
})

export const postController = {
    getAllposts,
    createPost,
    getPostStats,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost
}