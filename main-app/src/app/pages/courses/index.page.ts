import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectLoad, RouteMeta } from '@analogjs/router';
import { load } from './index.server';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'main-app-course',
  standalone: true,
  imports: [RouterLink, CommonModule],
  styles: `
    a {
      text-decoration: none;
      color: #008080;
    }
    a:hover {
      color: #003c3c;
    }
  `,
  template: `
    <div class="container">
      <h1>Courses</h1>
      <div class="grid">
        @if (courses()) {
          @for (course of courses(); track $index) {
            <article class="column--12 column__sm--6 column__md--4 card">
              <a routerLink="/courses/{{ course.slug }}"
                ><strong>{{ course.title }}</strong></a
              >
              @if (course.short_description) {
                <p>{{ course.short_description }}</p>
              }
            </article>
          }
        } @else {
          <p>no course found</p>
        }
      </div>
    </div>
  `,
})
export default class AllCourses {
  public data = toSignal(injectLoad<typeof load>(), { requireSync: true });
  public courses = computed(() => {
    return this.data().courses;
  });
  constructor() {
    console.log(this.courses);
  }
}
export const routeMeta: RouteMeta = {
  title: 'Code Maestro - All Courses',
};
