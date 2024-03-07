import { defineEventHandler, getRouterParam, createError } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @api {get} api/v1/mail-list/:id Given a mail-list
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    throw new createError({
      statusCode: 404,
      statusMessage: 'Mail list not found',
    });
  }
  return { mailList, mailListOwner };
});
