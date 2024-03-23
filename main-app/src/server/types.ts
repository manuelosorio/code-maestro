export type CourseModel = {
  title: string;
  description: string;
  preview_video: string;
  video_thumbnail: string;
  launch_date: string | Date;
  user_id: string;
  slug: string;
};

export type MailListModel = {
  name: string;
  description: string;
  user_id: string;
  slug: string;
};

export type SessionModel = {
  session_token: string;
  user_id: string;
};

export type CourseEnrollmentModel = {
  course_id: string;
  user_id: string;
};

export type LessonEnrollmentModel = {
  lesson_id: string;
  user_id: string;
};

export type LessonModel = {
  title: string;
  description: string;
  video: string;
  course_id: string;
  slug: string;
};

export type LaunchDateModel = {
  launch_date: string;
};

export type SubscriberModel = {
  email: string;
  mail_list_id: string;
};
