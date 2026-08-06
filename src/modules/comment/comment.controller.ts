import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { SendResponse } from "../../utils/sendRespons";
import { StatusCodes } from "http-status-codes";

const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const authorId = req.user?.id as string;
      const result = await commentService.createCommentDb(authorId, req.body);

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "Comment created successfully!",
            data: result,
        })
});

const getCommentByAuthorId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const authorId = req.user?.id as string;

      const result = await commentService.getCommentByAuthorIdDb(authorId as string);

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Comments fetched by author successfully!",
            data: result,
        })
});

const getCommentByPostId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
          const {postId} = req.params;

          const result = await commentService.getCommentByPostIdDb(postId as string);

          SendResponse(res, {
              success: true,
              statusCode: StatusCodes.OK,
              message: "Comment fetched by commentId successfully!",
              data: result,
          })
});

const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const authorId = req.user?.id as string;
      const payload = req.body;
      const {commentId} = req.params;

      const result = await commentService.updateCommentDb(commentId as string, payload, authorId);

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Comment Updated successfully!",
            data: result,
        })
});

const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const authorId = req.user?.id as string;
      const {commentId} = req.params;
     // const user = req.user;

      const result = await commentService.deleteCommentDb(commentId as string, authorId);

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Comment Deleted successfully!",
            data: result,
        })
});

const moderateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const {commentId} = req.params;
      const payload = req.body;

      const result = await commentService.moderateCommentDb(commentId as string, payload);

        SendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Comment Moderated successfully!",
            data: result,
        })
});

export const commentController = {
  createComment,
  getCommentByAuthorId,
  getCommentByPostId,
  updateComment,
  deleteComment,
  moderateComment,
}; 
