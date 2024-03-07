import { defineEventHandler, getRouterParam, createError } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @api {get} api/v1/mail-list/:id
 * @apiDescription Get a mail list by id
 * @apiParam {String} id - Mail list id
 * @apiSuccess {Object} mailList - Mail list object
 * @apiSuccess {Object} mailListOwner - Mail list owner object
 * @apiError {String} message - Mail list not found
 * @apiError {String} message - Invalid mail list id
 * @apiError {String} message - Internal server error
 **/
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid mail list id',
    });
  }
  const mailList = await prisma.mailList.findUnique({
    where: {
      id: id,
    },
  });
  const mailListOwner = await prisma.mailList
    .findUnique({
      where: {
        id: id,
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
