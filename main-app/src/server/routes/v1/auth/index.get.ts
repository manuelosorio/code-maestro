import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const session = event.context['session'];
  if (session && session.user_id) {
    return {
      statusCode: 200,
      authenticated: true,
    };
  }
  return {
    statusCode: 200,
    authenticated: false,
  };
});
