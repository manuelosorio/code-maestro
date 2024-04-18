import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, readValidatedBody } from 'h3';
import { hash } from 'bcrypt';
import { z } from 'zod';

const prisma = new PrismaClient();
/**
 * @api {post} api/v1/signup
 * @apiDescription Create a new user
 * @apiParam {String} email User's email
 * @apiParam {String} name User's Name
 * @apiParam {String} password User's password
 * @apiSuccess {String} message User created
 * @apiError {String} message User already exists
 * @apiError {String} message Internal server error
 */
export default defineEventHandler(async (event) => {
  const body = readValidatedBody(event, (reqBody) => {
    const schema = z.object({
      name: z.string().trim().min(1),
      email: z
        .string()
        .email({
          message: 'Invalid Email',
        })
        .toLowerCase(),
      password: z.string().min(8),
    });
    return schema.safeParse(reqBody);
  });
  const { name, email, password } = await body.then((result) => {
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
  return await prisma.user
    .create({
      data: {
        email: email,
        name: name,
        password: await hash(password, 10),
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
