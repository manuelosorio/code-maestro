import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, getRouterParams, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event);
  const body = await readBody(event);
  const session = event.context['session'];

  // Find the mail list using the provided slug
  const mailList = await prisma.mailList.findFirst({
    where: {
      slug: slug,
    },
  });

  if (!mailList) {
    throw createError({
      statusCode: 404,
      message: 'Mail list not found',
    });
  }

  // Attempt to find an existing subscriber with the same email
  const existingSubscriber = await prisma.subscriber.findFirst({
    where: {
      email: body.email,
      mail_list_id: mailList.id,
    },
  });

  // If an existing subscriber is found and there's an authenticated session
  if (existingSubscriber && session) {
    // Update the existing subscriber with the user ID from the session
    await prisma.subscriber.update({
      where: {
        // Assuming id is the unique identifier for the subscriber
        id: existingSubscriber.id,
      },
      data: {
        user_id: session.user_id,
      },
    });
    return {
      message: 'Successfully linked to existing subscription',
    };
  } else if (!existingSubscriber) {
    // If no existing subscriber, create a new one
    const subscriberData = session
      ? {
          user_id: session.user_id,
          mail_list_id: mailList.id,
          email: body.email,
        }
      : { mail_list_id: mailList.id, email: body.email };

    return prisma.subscriber
      .create({
        data: subscriberData,
      })
      .then(() => {
        return {
          message: 'Successfully subscribed to mail list',
        };
      })
      .catch((error) => {
        console.error(error);
        throw createError({
          statusCode: 400,
          message: 'Error subscribing to mail list',
        });
      });
  } else {
    // Existing subscriber without session (already subscribed)
    throw createError({
      statusCode: 400,
      message: 'Already subscribed to mail list',
    });
  }
});
