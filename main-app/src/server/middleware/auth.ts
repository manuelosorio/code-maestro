import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, deleteCookie, getSession } from 'h3';

const prisma = new PrismaClient();
const { SESSION_COOKIE_NAME, SESSION_SECRET } = import.meta.env;

/**
 * Middleware to check if the user is authenticated
 * and if the session is still valid
 */
export default defineEventHandler(async (event): Promise<object | void> => {
  const { id: session_token, data } = await getSession(event, {
    password: SESSION_SECRET,
    name: SESSION_COOKIE_NAME,
  });
  const { user_id } = data;
  if (session_token) {
    const session = await prisma.session.findUnique({
      where: {
        session_token,
        user_id,
      },
    });
    if (session) {
      if (session.expires.toISOString() < new Date().toISOString()) {
        await prisma.session.delete({
          where: {
            id: session.id,
          },
        });
        deleteCookie(event, SESSION_COOKIE_NAME);
        if (
          !event.path.endsWith('/signup') &&
          !event.path.endsWith('/signin')
        ) {
          throw createError({
            statusCode: 401,
            statusMessage: 'Session expired',
          });
        }
      } else {
        event.context['session'] = session;
      }
    }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
});
