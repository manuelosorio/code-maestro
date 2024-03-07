import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, readBody, useSession } from 'h3';
import { compare } from 'bcrypt';

const prisma = new PrismaClient();

/**
 * @api {post} api/v1/signin Sign in
 * @apiDescription Sign in with email and password
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 * @apiSuccess {String} message Logged in
 * @apiError {String} message Invalid email or password
 * @apiError {String} message Already logged in
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { SESSION_SECRET, SESSION_COOKIE_NAME, SESSION_EXPIRY_DAYS } =
    import.meta.env;

  if (event.context['session']) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Already logged in',
    });
  }
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  const passwordMatch = user && (await compare(body.password, user.password));
  if (!passwordMatch) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password',
    });
  }

  const session = await useSession(event, {
    password: SESSION_SECRET,
    name: SESSION_COOKIE_NAME,
  });
  await session.update({
    user_id: user.id,
  });

  await prisma.session.create({
    data: {
      user_id: user.id,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_EXPIRY_DAYS),
      session_token: session.id,
    },
  });
  return {
    statusCode: 201,
    body: {
      message: 'Logged in',
    },
  };
});
