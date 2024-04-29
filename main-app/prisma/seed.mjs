import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { getRandomValues } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const initialized = await prisma.dbStatus.findFirst();
  if (initialized?.initialized) {
    console.log('Database already initialized');
    return;
  }

  const data = {
    email: process.env['USERS_EMAIL'],
    name: 'Manuel Osorio',
    bio: `As a Full-Stack JavaScript Developer with a background in Interaction Design, I bring a unique blend of front-end and back-end expertise to my teaching. My experience ranges from UI design to work with back-end technologies. I've also worked as a Graphic Design Laboratory Aide, where I guided students in design principles and technical solutions. My professional journey includes extensive use of version control tools like Git, equipping me with practical insights and knowledge essential for delivering a comprehensive and engaging learning experience.`,
    password: generateSecureRandomString(process.env['USERS_PASSWORD_LENGTH']),
  };

  console.log(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      bio: data.bio,
      password: await hash(data.password, 10),
    },
  });
  const dummyUser = await prisma.user.create({
    data: {
      password: await hash(generateSecureRandomString(20), 10),
      email: 'dummy_user@example.com',
      name: 'Dummy User',
      bio: '',
    },
  });
  const course = await prisma.course.create({
    data: {
      video_thumbnail: 'assets/git&github-thumb.webp',
      title: 'Git & Github Simplified',
      slug: 'git-and-github-simplified',
      preview_video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      short_description:
        'Master the essentials of Git and GitHub with our simplified course designed for rapid learning. Elevate your coding with key version-control skills that streamline collaboration and project management.',
      description:
        "Comprehensive course designed to introduce beginners to the world of version control using Git and GitHub. Starting with the basics of version control systems, this course will guide you through the fundamentals of Git and GitHub, emphasizing practical skills and real-world applications. You'll begin with an intuitive GUI approach before delving into the powerful CLI commands, ensuring a solid foundation for all skill levels. By the end of this course, you will be equipped with the knowledge and skills to efficiently manage your coding projects, collaborate with others, and contribute to open-source projects.",
      user_id: user.id,
    },
  });
  const lesson = await prisma.lesson.createMany({
    data: [
      {
        title: 'Introduction to Version Control',
        description:
          'Understand the basics of version control and the benefits of using Git.',
        course_id: course.id,
      },
      {
        title: 'What is Git?',
        description:
          'Learn about the history of Git and its importance in modern software development.',
        course_id: course.id,
      },
      {
        title: 'Why use Version Control?',
        description:
          'Discover the advantages of using version control systems in your projects.',
        course_id: course.id,
      },
      {
        title: 'Introduction to GitHub',
        description:
          'Understand the basics of GitHub and how it complements Git.',
        course_id: course.id,
      },
      {
        title: 'Setup Git and GitHub',
        description:
          'Learn how to set up Git and GitHub on your local machine.',
        course_id: course.id,
      },
    ],
  });
  const mailList = await prisma.mailList.create({
    data: {
      name: 'Git & Github Simplified',
      description:
        'Stay up-to-date with the latest news and updates on our Git & Github Simplified course.',
      slug: 'git-and-github-simplified',
      user_id: user.id,
    },
  });

  const subscriber = await prisma.subscriber.create({
    data: {
      email: dummyUser.email,
      mail_list_id: mailList.id,
      user_id: dummyUser.id,
    },
  });

  const enrollment = await prisma.courseEnrollment.create({
    data: {
      user_id: dummyUser.id,
      course_id: course.id,
    },
  });

  const launchDate = await prisma.launchDate.create({
    data: {
      date: new Date('2024-05-09'),
      course_id: course.id,
    },
  });

  const dbStatus = await prisma.dbStatus.create({
    data: {
      initialized: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

function generateSecureRandomString(length) {
  const charset =
    '~!@#$%^&*()_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  const bytes = new Uint8Array(length);
  getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    result += charset[bytes[i] % charset.length];
  }
  return result;
}
