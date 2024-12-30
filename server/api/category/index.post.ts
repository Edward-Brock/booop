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
    name: z.string().min(1),
    description: z.string().optional(),
  }).safeParse(await readBody(event))

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少必填字段',
    })
  }

  try {
    // 创建新分类
    return await prisma.category.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        userId: session.session.userId,
      },
    })
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: '分类创建失败',
    })
  }
})
