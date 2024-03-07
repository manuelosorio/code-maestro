import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: await hash(body.password, 10),
    },
  });
  return {
    statusCode: 201,
    body: { message: 'User created' },
  };
});
