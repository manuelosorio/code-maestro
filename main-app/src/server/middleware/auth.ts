import { PrismaClient } from '@prisma/client';
import { defineEventHandler, deleteCookie, getSession } from 'h3';

const prisma = new PrismaClient();
const { SESSION_COOKIE_NAME, SESSION_SECRET } = import.meta.env;
export default defineEventHandler(async (event): Promise<object | void> => {
  const { id: session_token, data } = await getSession(event, {
    password: SESSION_SECRET,
    name: SESSION_COOKIE_NAME,
  });
  const { user_id } = data;
  if (session_token) {
    console.log('session_token', session_token);
    const session = await prisma.session.findUnique({
      where: {
        session_token,
        user_id,
      },
    });
    console.log('session', session);
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
          return {
            statusCode: 401,
            body: { message: 'Session expired' },
          };
        }
      } else {
        event.context['session'] = session;
      }
    }
  } else {
    return {
      statusCode: 401,
      body: { message: 'Unauthorized' },
    };
  }
});
