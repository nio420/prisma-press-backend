import { postWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma"
import { IPostQuery } from "../post/post.interface";

const getPremiumContent = async (query: IPostQuery)=>{
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
  
  andConditions.push({isPremium: true})

        const posts = await prisma.post.findMany({
            where: {
                AND: andConditions
            }
        })

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
  
}


export const premiumService = {
    getPremiumContent
}