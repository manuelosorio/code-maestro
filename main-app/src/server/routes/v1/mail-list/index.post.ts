import { defineEventHandler, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // TODO: Remove Hardcoded User
  const user = await prisma.user.findUnique({
    where: {
      id: '1',
    },
  });
  console.log({ body });

  await prisma.mailList.create({
    data: {
      name: body.name,
      description: body.description,
      user_id: user.id,
      slug: body.name.toLowerCase().replace(/ /g, '-'),
    },
  });
});
