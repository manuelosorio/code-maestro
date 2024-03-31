import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, getRouterParam } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    select: {
      title: true,
      slug: true,
      description: true,
      short_description: true,
      preview_video: true,
      video_thumbnail: true,
      user_id: true,
      launch_date: {
        select: {
          date: true,
        },
      },
    },
  });
  prisma.$disconnect();
  if (!course) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Course not found',
    });
  }
  return course;
});
