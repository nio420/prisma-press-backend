import { CommentStatus } from "../../../generated/prisma/client";

export interface ICreateCommentPayload {
    postId: string,
    authorId: string,
    content: string,
}

export interface IUpdateCommentPayload {
    content?: string,
    status?: CommentStatus,
}

export interface IMOderateCommentPayload {
    status: CommentStatus,
}