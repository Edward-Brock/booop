import { z } from 'zod'
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

  const result = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    url: z.string().url(),
    faviconUrl: z.string().optional(),
    categoryId: z.string().optional(),
  }).safeParse(await readBody(event))

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少必填字段',
    })
  }

  try {
    // 添加新网站
    return await prisma.bookmark.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        url: result.data.url,
        faviconUrl: result.data.faviconUrl,
        userId: session.session.userId,
        categoryId: result.data.categoryId,
      },
    })
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: '网站添加失败',
    })
  }
})
