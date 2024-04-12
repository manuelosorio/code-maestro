import {
  defineEventHandler,
} from 'h3';


export default defineEventHandler(async (event) => {
  if (event.context['session']) {
    return {
      //TODO: Send Short-live JWT
      statusCode: 200,
      body: {
        authenticated: true
      }
    }
  } else {
    return {
      statusCode: 200,
      body: {
        authenticated: false
      }
    }
  }
});
