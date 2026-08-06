import { PostStatus } from "../../../generated/prisma/enums";
import { postWhereInput } from "../../../generated/prisma/models";

export interface IcreatePostPayload {
    title: string;
    content: string;
    thumbnail?: string;
    isFeatured?: boolean;
    isPremium?: boolean;
    status?: PostStatus;
    tags: string[];
}

export interface IUpdatePayload {
    title?: string;
    content?: string;
    thumbnail?: string;
    isFeatured?: boolean;
    status?: PostStatus;
    tags?: string[];
}

export interface IPostQuery extends postWhereInput {
    // title?: string;
    // content?: string;   // those are in out db

    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;

}