import { createError, defineEventHandler, deleteCookie } from 'h3';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const session = event.context['session'];
  const prisma = new PrismaClient();

  deleteCookie(event, import.meta.env.SESSION_COOKIE_NAME);

  return await prisma.session
    .delete({
      where: {
        user_id: session.user_id as string,
        session_token: session.session_token as string,
      },
    })
    .then(() => {
      return {
        statusCode: 200,
        message: 'Session Deleted',
      };
    })
    .catch((err) => {
      console.error(err.message);
      throw createError({
        statusCode: 400,
        message: 'Unknown Error',
      });
    });
});
