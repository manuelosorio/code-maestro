import { defineEventHandler, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
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
          return {
            statusCode: 400,
            body: {
              message: 'Mail list already exists',
            },
          };
        }
        return {
          statusCode: 500,
          body: error,
        };
      });
  }
});
