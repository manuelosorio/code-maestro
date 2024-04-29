import { createError, defineEventHandler, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
/**
 * @api {post} api/v1/mail-lists
 * @apiDescription Create a new mail list
 * @apiParam {String} name Mail list name
 * @apiParam {String} description Mail list description
 * @apiSuccess {Object} mailList - Mail list object
 * @apiError {String} message - Mail list already exists
 * @apiError {String} message - Internal server error
 * @apiError {String} message - Mail list not found
 * @apiError {String} message - Invalid mail list id
 */
export default defineEventHandler(async (event): Promise<object | void> => {
  const body = await readBody(event);
  const session = event.context['session'];

  if (session) {
    return await prisma.mailList
      .create({
        data: {
          name: body.name,
          description: body.description,
          user_id: session.user_id,
          slug: body.name.toLowerCase().replace(/ /g, '-'),
        },
      })
      .then((mailList) => {
        return {
          statusCode: 201,
          body: mailList,
        };
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw createError({
            statusCode: 400,
            message: 'Mail list already exists',
          });
        }
        console.error(error);
        throw createError({
          statusCode: 500,
          statusMessage: 'Internal server error',
        });
      });
  }
});
