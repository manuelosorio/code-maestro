import { defineEventHandler, getRouterParam, createError } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @api {get} api/v1/mail-list/:slug
 * @apiDescription Get a mail list by slug
 * @apiParam {String} id - Mail list id
 * @apiSuccess {Object} mailList - Mail list object
 * @apiSuccess {Object} mailListOwner - Mail list owner object
 * @apiError {String} message - Mail list not found
 * @apiError {String} message - Invalid mail list id
 * @apiError {String} message - Internal server error
 **/
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid mail list id',
    });
  }
  const mailList = await prisma.mailList.findUnique({
    where: {
      slug,
    },
  });
  const mailListOwner = await prisma.mailList
    .findUnique({
      where: {
        slug,
      },
    })
    .mail_list_owner()
    .then((user) => {
      if (!user) {
        return {};
      }
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    });
  prisma.$disconnect();

  if (!mailList) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Mail list not found',
    });
  }
  return { mailList, mailListOwner };
});
