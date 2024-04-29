import { PrismaClient } from '@prisma/client';
import {
  createError,
  defineEventHandler,
  useSession,
  getRequestIP,
  readValidatedBody,
} from 'h3';
import { compare } from 'bcrypt';
import { z } from 'zod';

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
  const _ip = getRequestIP(event, {
    xForwardedFor: true,
  });

  const { SESSION_SECRET, SESSION_COOKIE_NAME, SESSION_EXPIRY_DAYS } =
    import.meta.env;

  const body = readValidatedBody(event, (reqBody) => {
    const schema = z.object({
      email: z.string().trim().email().toLowerCase(),
      password: z.string(),
    });
    return schema.safeParse(reqBody);
  });
  const { email, password } = await body.then((result) => {
    if (result.success) {
      return result.data;
    } else {
      const missing_fields = result.error.issues.map((issue) => {
        return issue.path.join('.');
      });
      throw createError({
        statusCode: 400,
        message: `Missing required fields: ${missing_fields.join(', ')}`,
        stack: undefined,
      });
    }
  });

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      password: true,
    },
  });
  const passwordMatch = user && (await compare(password, user.password));

  if (!passwordMatch) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password',
    });
  }

  // deleteCookie(event, SESSION_COOKIE_NAME);

  const session = await useSession(event, {
    password: SESSION_SECRET,
    name: SESSION_COOKIE_NAME,
    cookie: {
      maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS,
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      domain: import.meta.env.VITE_ANALOG_PUBLIC_BASE_URL,
    },
  });
  await session.update({
    user_id: user.id,
  });
  if (!session.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

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
