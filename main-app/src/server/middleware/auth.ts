import { PrismaClient } from '@prisma/client';
import {
  defineEventHandler,
  H3Event,
  EventHandlerRequest,
  getSession,
  handleCors,
  createError,
  deleteCookie,
} from 'h3';

const prisma = new PrismaClient();
const { SESSION_COOKIE_NAME, SESSION_SECRET } = import.meta.env;

/**
 * Middleware to check if the user is authenticated
 * and if the session is still valid
 */

export default defineEventHandler(async (event): Promise<object | void> => {
  handleCors(event, {
    credentials: true,
  });

  const session = await getSession(event, {
    password: SESSION_SECRET,
    name: SESSION_COOKIE_NAME,
    cookie: {
      maxAge: 60 * 60 * 24 * import.meta.env.SESSION_EXPIRY_DAYS,
    },
  });

  const { id: session_token } = session;
  if (!session_token) {
    event.context['session'] = null;
    return;
  }

  await manageSession(event, session_token);
});

const manageSession = async (
  event: H3Event<EventHandlerRequest>,
  session_token: string,
) => {
  const session = await prisma.session.findUnique({
    where: {
      session_token,
    },
  });

  if (session && session.expires.toISOString() <= new Date().toISOString()) {
    deleteCookie(event, SESSION_COOKIE_NAME);
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });
    if (!event.path.endsWith('/signup') && !event.path.endsWith('/signin')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Session expired',
      });
    }
  }
  event.context['session'] = session;
};
