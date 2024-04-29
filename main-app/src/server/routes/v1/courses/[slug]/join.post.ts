import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, getRouterParams } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = getRouterParams(event);
  const session = event.context['session'];
  const { slug } = body;

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      stack: undefined,
    });
  }
  const course = await prisma.course.findFirst({
    where: {
      slug: slug,
    },
  });
  if (!course) {
    throw createError({
      statusCode: 404,
      message: 'Course not found',
      stack: undefined,
    });
  }
  return prisma.courseEnrollment
    .create({
      data: {
        course_id: course.id,
        user_id: session.user_id,
      },
    })
    .then((_courseEnrollment) => {
      return {
        message: 'Course enrolled successfully',
      };
    })
    .catch((_error) => {
      throw createError({
        statusCode: 400,
        message: 'Course already enrolled',
        stack: undefined,
      });
    });
});
