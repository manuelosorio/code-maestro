import { Component, computed } from '@angular/core';
import { NavComponent } from '../../components/nav/nav.component';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { JoinButtonComponent } from '../../components/join-button/join-button.component';
import { CountdownComponent } from '../../components/countdown/countdown.component';
import { LessonsComponent } from '../../components/lessons/lessons.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { load } from './[slug].server';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectLoad } from '@analogjs/router';

@Component({
  selector: 'main-app-course',
  standalone: true,
  imports: [
    NavComponent,
    NgOptimizedImage,
    JoinButtonComponent,
    CountdownComponent,
    LessonsComponent,
    ModalComponent,
    VideoPlayerComponent,
    AsyncPipe,
  ],
  template: `
    <app-nav></app-nav>
    <app-modal [slug]="slug()"></app-modal>
    <main class="container">
      <header class="grid">
        <div class="column__lg--5 order--3 order__lg--1">
          <h1>{{ data().course.title }}</h1>
          <p>
            {{ data().course.short_description }}
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
        <app-countdown [CountdownDate]="launchDate()"></app-countdown>
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
          <h3>
            {{ data().courseInstructor.name }}
            <span>(Full-stack Developer)</span>
          </h3>
          <p>
            {{ data().courseInstructor.bio }}
          </p>
        </div>
      </section>
      <section>
        <h2>Overview</h2>
        <p class="card">
          {{ data().course.description }}
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
export default class CoursePage {
  public data = toSignal(injectLoad<typeof load>(), { requireSync: true });
  public slug = computed(() => {
    return this.data().slug;
  });
  public launchDate = computed(() => {
    return this.data().course.launch_date[0].date;
  });
}
