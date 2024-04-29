import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
/**
 * @api {get} api/v1/users
 * @apiDescription Get all users
 * @apiSuccess {Object[]} users - List of users
 */
export default defineEventHandler(async () => {
  const users = await prisma.user.findMany().then((users) => {
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, email, ...userData } = user;
      return {
        userData,
      };
    });
  });
  return { users };
});
