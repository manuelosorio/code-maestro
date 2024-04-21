import { PageServerLoad } from '@analogjs/router';
import { CourseModel } from '../../../server/types';

export const load = async ({ fetch }: PageServerLoad) => {
  const courses: CourseModel[] = await fetch('/api/v1/courses');
  return {
    courses,
  };
};
