import { Component } from '@angular/core';
import { NavComponent } from '../components/nav/nav.component';
import { NgOptimizedImage } from '@angular/common';
import { JoinButtonComponent } from '../components/join-button/join-button.component';
import { CountdownComponent } from '../components/countdown/countdown.component';
import { LessonsComponent } from '../components/lessons/lessons.component';
import { ModalComponent } from '../components/modal/modal.component';
import { VideoPlayerComponent } from '../components/video-player/video-player.component';

@Component({
  selector: 'main-app-home',
  standalone: true,
  imports: [
    NavComponent,
    NgOptimizedImage,
    JoinButtonComponent,
    CountdownComponent,
    LessonsComponent,
    ModalComponent,
    VideoPlayerComponent,
  ],
  template: `
    <app-nav></app-nav>
    <app-modal></app-modal>
    <main class="container">
      <header class="grid">
        <div class="column__lg--5 order--3 order__lg--1">
          <h1>Git & Github Simplified</h1>
          <p>
            Master the essentials of Git and GitHub with our simplified course
            designed for rapid learning. Elevate your coding with key version
            control skills that streamline collaboration and project management.
          </p>
          <join-button></join-button>
        </div>
        <div class="column__lg--1 order--1"></div>
        <!--        <div class="column__md&#45;&#45;6 order&#45;&#45;2 order__md&#45;&#45;3 video ">-->
        <!--          <img-->
        <!--            ngSrc="https://placehold.co/585x317"-->
        <!--            alt="placeholder"-->
        <!--            width="585"-->
        <!--            height="317"-->
        <!--          />-->
        <!--        </div>-->
        <app-video-player
          posterImage="assets/git&github-thumb.webp"
          class="column__lg--6 order--2 order__lg--3 video"
        >
          <source
            src="https://media.w3.org/2010/05/sintel/trailer.mp4"
            type="video/mp4"
          />
          <source
            src="https://media.w3.org/2010/05/sintel/trailer.ogg"
            type="video/ogg"
          />
          Your browser does not support the video tag.
        </app-video-player>
      </header>
      <section>
        <!-- TODO: Remove this inline style             -->
        <h2 style="text-align: center">Course Launches in:</h2>
        <app-countdown></app-countdown>
      </section>
      <section class="grid">
        <div class="column__md--4">
          <img
            ngSrc="https://github.com/manuelosorio.png"
            alt="placeholder"
            width="290"
            height="290"
            priority="true"
          />
        </div>

        <div class="column__md--7">
          <h2>Meet the Instructor</h2>
          <h3>Manuel Osorio <span>(Full-stack Developer)</span></h3>
          <p>
            As a Full-Stack JavaScript Developer with a background in
            Interaction Design, I bring a unique blend of front-end and back-end
            expertise to my teaching. My experience ranges from UI design to
            work with back-end technologies. I've also worked as a Graphic
            Design Laboratory Aide, where I guided students in design principles
            and technical solutions. My professional journey includes extensive
            use of version control tools like Git, equipping me with practical
            insights and knowledge essential for delivering a comprehensive and
            engaging learning experience.
          </p>
        </div>
      </section>
      <section>
        <h2>Overview</h2>
        <p class="card">
          Comprehensive course designed to introduce beginners to the world of
          version control using Git and GitHub. Starting with the basics of
          version control systems, this course will guide you through the
          fundamentals of Git and GitHub, emphasizing practical skills and
          real-world applications. You'll begin with an intuitive GUI approach
          before delving into the powerful CLI commands, ensuring a solid
          foundation for all skill levels. By the end of this course, you will
          be equipped with the knowledge and skills to efficiently manage your
          coding projects, collaborate with others, and contribute to
          open-source projects.
        </p>
      </section>
      <section>
        <h2>Lessons</h2>
        <app-lessons></app-lessons>
      </section>
      <section class="fade">
        <h2>Interested in Learning Git?</h2>
        <join-button></join-button>
      </section>
    </main>
  `,
})
export default class HomeComponent {}
