import { json } from "node:stream/consumers";
import { CommentStatus, PostStatus, SubcriptionStatus } from "../../../generated/prisma/enums";
import { postWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IcreatePostPayload, IPostQuery, IUpdatePayload } from "./post.interface";

// create post
const createPostDb = async (payload: IcreatePostPayload, userId: string) => {
  const postExists = await prisma.post.findFirst({
    where: {
      title: payload.title
    }
  })

  if(postExists){
    throw new Error("Post with same title already exists!")
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    },
    include: {
      subscription: true
    }
  })

  if(payload.isPremium && user.subscription?.status !== SubcriptionStatus.ACTIVE) {
    throw new Error("You need to subscribe to premium content to create post!")
  }
  
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

// get all posts
const getAllPostsDb = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "asc";
  const tag = query.tags ? JSON.parse(query.tags as string) : null
  const tagArray = Array.isArray(tag) ? tag : []

  const andConditions: postWhereInput[] = [];

  if(query.searchTerm){
    andConditions.push({
          OR: [
            {
              title : {
                contains: query.searchTerm,
                mode: "insensitive"
              },              
            },
            {
            content : {
                contains: query.searchTerm,
                mode: "insensitive"
              }              
            }
          ]    
    })
  }

  if(query.title){
    andConditions.push({title: query.title})
  }

  if(query.content){
    andConditions.push({content: query.content})
  }

  if(query.authorId){
    andConditions.push({authorId: query.authorId})
  }

  if(query.isFeatured){
    andConditions.push({isFeatured: Boolean(query.isFeatured)})
  }

  if(query.tags){
    andConditions.push({tags: {hasSome: tagArray}})
  }

  if(query.status){
    andConditions.push({status: query.status})
  }
  
  andConditions.push({isPremium: false})

  const posts = await prisma.post.findMany({
    // dyncamic filtering, searching
    // where: {
    //   AND: [
    //     // seraching using searchTerm
    //     query.searchTerm ? {
    //       OR: [
    //         {
    //           title : {
    //             contains: query.searchTerm,
    //             mode: "insensitive"
    //           },              
    //         },
    //         {
    //         content : {
    //             contains: query.searchTerm,
    //             mode: "insensitive"
    //           }              
    //         }
    //       ]
    //     } : {},

    //     // dynamic filterring
    //     query.title ? {title: query.title} : {},
    //     query.content ? {content: query.content} : {},
    //   ]
    // },

    where: {
      AND: andConditions
    },


    // dynacmic pagination and sorting
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      author: {
        omit: { password: true },
      },
      comments: true,
    },
  });

  const totalPostCount = await prisma.post.count({
    where: {
      AND: andConditions
    }
  })
  const totalPage = Math.ceil(totalPostCount / limit);

  return {
    data: posts,
    meta: {
      page: page,
      limit: limit,
      total: totalPostCount,
      totalPage: totalPage
    }
  };
};

// get post stats
const getPostStatsDb = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {

    const [
      totalPost,
      totalPublishedPost,
      totalDraftPost,
      totalAchivedPost,
      totalComments,
      totalApproveComments,
      totalRejectedComments,
      totalPostViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),
      tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPost,
      totalPublishedPost,
      totalDraftPost,
      totalAchivedPost,
      totalComments,
      totalApproveComments,
      totalRejectedComments,
      totalPostViews: totalPostViews._sum.views,
    };
  });
  return transactionResult;
};

// get my posts
const getMyPostsDb = async (authorId: string) => {
  const post = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        omit: { password: true },
      },
      comments: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return post;
};

// get post by id
const getPostByIdDb = async (postId: string) => {
  //   const post = await prisma.post.findUniqueOrThrow({
  //     where: {
  //       id: postId,
  //     },
  //   });

  //   const updatePost = await prisma.post.update({
  //     where: {
  //       id: postId,
  //     },
  //     data: {
  //       views: {
  //         increment: 1,
  //       },
  //     },
  //     include: {
  //       author: {
  //         omit: { password: true },
  //       },
  //       comments: true,
  //     },
  //   });

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id: postId,
        isPremium: false
      },
      include: {
        author: {
          omit: { password: true },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });
  return transactionResult;
};

// update post
const updatePostDb = async (
  postId: string,
  payload: IUpdatePayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("you are not owner of this post!");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: { password: true },
      },
      comments: true,
    },
  });

  return result;
};

// delete post
const deletePostDb = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("you are not owner of this post!");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const postService = {
  getAllPostsDb,
  createPostDb,
  getPostStatsDb,
  getMyPostsDb,
  getPostByIdDb,
  updatePostDb,
  deletePostDb,
};
