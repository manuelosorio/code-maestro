import { PageServerLoad } from '@analogjs/router';
import { CourseModel, UserModel } from '../../../server/types';

export const load = async ({ params, fetch }: PageServerLoad) => {
  const slug = params?.['slug'];
  const course: CourseModel = await fetch(`/api/v1/courses/${slug}`);
  const { user_id } = course;
  const courseInstructor: UserModel = await fetch(`/api/v1/users/${user_id}`);
  return {
    course,
    courseInstructor,
  };
};
