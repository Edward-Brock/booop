import { auth } from '~/lib/auth'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  // 判断当前是否有用户登录
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: '用户未登录',
    })
  }

  return await prisma.category.findMany({
    where: { userId: session.session.userId },
    include: { bookmarks: true },
  })
})
