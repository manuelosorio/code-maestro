import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, readValidatedBody } from 'h3';
import { SafeParseError, SafeParseSuccess, z } from 'zod';

import { CourseModel } from '../../../types';

const prisma = new PrismaClient();

/**
 * @api {post} api/v1/courses Create a new course
 * @apiDescription Create a new course
 * @apiParam {String} title Course name
 * @apiParam {String} description Brief course description
 * @apiParam {String} preview_video Preview video URL
 * @apiParam {String} video_thumbnail Video thumbnail URL
 * @apiParam {String} launch_date Course launch date
 * @apiSuccess {Object} course - Course object
 * @apiError {String} message - Course already exists
 * @apiError {String} message - Internal server error
 *
 * @apiParamExample {json} Request example:
 * {
 *  "title": "Course title",
 *  "description": "Course description",
 *  "preview_video": "https://www.youtube.com/watch?v=video_id",
 *  "video_thumbnail": "https://www.example.com/video_thumbnail.jpg",
 *  "launch_date": "2022-12-31"
 *  }
 *  @apiSuccessExample {json} Success response:
 */
export default defineEventHandler(async (event) => {
  const body = readValidatedBody(event, (reqBody) => {
    //fully validate the request body and make sure nothing is missing else throw an error
    const schema = z.object({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      preview_video: z.string().trim().min(1),
      video_thumbnail: z.string().trim().min(1),
      launch_date: z.string().trim().min(1),
    });
    return schema.safeParse(reqBody) as SafeParseSuccess<CourseModel>;
  });

  const { title, description, preview_video, video_thumbnail, launch_date } =
    await body.then(
      (result: SafeParseError<unknown> | SafeParseSuccess<CourseModel>) => {
        if (result.success) {
          return result.data;
        } else {
          const missing_fields = result.error.issues.map((issue) => {
            return issue.path.join('.');
          });
          throw createError({
            statusCode: 400,
            message: `Missing required fields: ${missing_fields.join(', ')}`,
            stack: undefined,
          });
        }
      },
    );
  const session = event.context['session'];
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
  return prisma.course
    .create({
      data: {
        title: title,
        description,
        preview_video,
        video_thumbnail,
        user_id: session.user_id,
        slug: title.toLowerCase().replace(/ /g, '-'),
      },
    })
    .then(async (course) => {
      return prisma.launchDate
        .create({
          data: {
            date: new Date(launch_date),
            course_id: course.id,
          },
        })
        .then((launchDate) => {
          const { date } = launchDate;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...courseData } = course;

          return {
            statusCode: 201,
            body: {
              message: 'Course created',
              course: {
                title: courseData.title,
                description: courseData.description,
                slug: courseData.slug,
                preview_video: courseData.preview_video,
                video_thumbnail: courseData.video_thumbnail,
                date,
              },
            },
          };
        })
        .catch((error) => {
          console.error(error);
          throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
          });
        })
        .catch((error) => {
          if (error.code === 'P2002') {
            throw createError({
              statusCode: 400,
              message: 'Course already exists',
            });
          }
          console.error(error);
          throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
          });
        });
    });
});
