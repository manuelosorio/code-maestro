import { createError, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const session = event.context['session'];
  if (session) {
    if (!session.user_id) {
      return {
        statusCode: 200,
        authenticated: false,
      };
    }
    return {
      statusCode: 200,
      authenticated: true,
    };
  }
  throw createError({
    statusCode: 400,
    message: 'Unknown error!',
  });
});
