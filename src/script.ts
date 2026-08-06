import { prisma } from "./lib/prisma";

async function main() {
  // Create a new user with a post
  // const user = await prisma.user.create({
  //   data: {
  //     name: "Alicea",
  //     email: "alice1@prisma.io",
  //     posts: {
  //       create: {
  //         title: "Hello World 1",
  //         content: "This is my first post as user 1!",
  //         published: true,
  //       },
  //     },
  //   },
  //   include: {
  //     posts: true,
  //   },
  // });
  // console.log("Created user:", user);

  const post = await prisma.post.create({
    data: {
      authorId: 2,
      title: "Hello beutiful people user 2",
      content: "This is my post for football world cup user 2!",
      published: true,
    },
    include: {
      author: true,
    },
  });
console.log("Created post:", post);

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });