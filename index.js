const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { delay } = require('lodash')

const NON_EXIST_AUTHOR_ID = 3
const userList = [
  {
    email: 'test7@email.com',
    password: '123',
    gender: 'MALE'
  },
  {
    email: 'test8@email.com',
    password: '123',
    gender: 'MALE'
  },

]

const postList = []
for (let i = 1; i < 200; i++) {
  postList.push({
    title: `hi ${i}`,
    body: `hi ${i}`,
    author: {
      connect: {
        id: 2
      }
    }
  },
  )
}
// postList.splice(100, 0, { title: 'hello', body: 'hello', author: { connect: { id: 3 } } })
console.log('Post List:', postList.length);

const updatedPostList = []
for (let i = 14; i < 112; i++) {
  // this case fail
  if (i === 50) {
    updatedPostList.push({ id: i, authorId: NON_EXIST_AUTHOR_ID })
    continue
  }
  updatedPostList.push({
    id: i,
    authorId: 4
  })
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}



async function main() {
  return await prisma.$transaction(async prisma => {
    // const user = await prisma.user.create({
    //   data: {
    //     email: 'test@email.com',
    //     password: '123',
    //     gender: 'MALE'
    //   }
    // })
    // throw new Error('Cant create new user')
    // const post = await prisma.post.create({
    //   data: {
    //     title: 'new post',
    //     body: 'Hello',
    //     author: {
    //       connect: {
    //         id: user.id
    //       }
    //     }
    //   }
    // })


    // update author of each post
    // await Promise.all(updatedPostList.map(async ({ id, authorId }) => {
    //   // if ([34, 35, 36, 105].includes(id)) {
    //   if (id === 50) {
    //     await sleep(10)
    //     return prisma.post.update({ where: { id }, data: { authorId } })
    //     // return delay(() => prisma.post.update({ where: { id }, data: { authorId } }), 500)
    //   }
    //   return prisma.post.update({ where: { id }, data: { authorId } })
    // }))


    // await Promise.all(postList.map(post => prisma.post.create({ data: post })))

    const users = await prisma.user.findMany()
    users.splice(3, 0, { email: 'son@email.com', id: 3 })
    console.log('users count:', users.length);
    await Promise.all([users.map(user => {
      const posts = [
        {
          title: `Post created by ${user.email}`,
          body: 'hi',
          author: {
            connect: {
              id: user.id
            }
          }
        }
      ]
      return prisma.post.createMany({
        data: posts
      })
    })])

    // await Promise.all([
    //   // ...await Promise.all(postList.map(post => prisma.post.create({ data: post }))),
    //   (async () => {
    //     await sleep(500)
    //     return prisma.post.updateMany({ data: { authorId: 6 } })
    //   })(),
    //   prisma.post.updateMany({ where: { title: { contains: 'new post' } }, data: { authorId: NON_EXIST_AUTHOR_ID } })
    // ])

    // await Promise.all(userList.map(user => prisma.user.create({ data: user })))

  })
}


main()
  .then(() => {
    console.log(
      'created users successfully '
    );
  })
  .catch(e => {
    console.log('Rollback!');
    console.error(e);
  })
