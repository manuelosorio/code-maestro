import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, readBody } from 'h3';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();
/**
 * @api {post} api/v1/signup
 * @apiDescription Create a new user
 * @apiParam {String} email User email
 * @apiParam {String} name User name
 * @apiParam {String} password User password
 * @apiSuccess {String} message User created
 * @apiError {String} message User already exists
 * @apiError {String} message Internal server error
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await prisma.user
    .create({
      data: {
        email: body.email.toString().toLowerCase(),
        name: body.name,
        password: await hash(body.password, 10),
      },
    })
    .then(() => {
      return {
        statusCode: 201,
        body: { message: 'User created' },
      };
    })
    .catch((error) => {
      if (error.code === 'P2002') {
        throw createError({
          statusCode: 409,
          statusMessage: 'User already exists',
        });
      }
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
        cause: error,
      });
    });
});
