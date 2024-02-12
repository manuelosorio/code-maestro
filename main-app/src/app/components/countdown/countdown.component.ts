import {
  Component,
  signal,
  OnDestroy,
  computed,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.sass',
  standalone: true,
})
export class CountdownComponent implements OnDestroy {
  private _countdownDate: Date = new Date('2024-03-08T00:00:00.000Z');
  private timeRemaining = signal(this.getTimeRemaining);
  private readonly timer?: Subscription;
  private isBrowser: boolean = isPlatformBrowser(this.platformId);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (this.isBrowser) {
      this.timer = interval(1000).subscribe(() => {
        this.timeRemaining.set(this.getTimeRemaining);
      });
    }
  }
  private get getTimeRemaining(): number {
    return this._countdownDate.getTime() - new Date().getTime();
  }

  daysRemaining = computed(() =>
    Math.floor(this.timeRemaining() / (1000 * 60 * 60 * 24)),
  );
  hoursRemaining = computed(() =>
    Math.floor(
      (this.timeRemaining() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    ),
  );
  minutesRemaining = computed(() =>
    Math.floor((this.timeRemaining() % (1000 * 60 * 60)) / (1000 * 60)),
  );
  secondsRemaining = computed(() =>
    Math.floor((this.timeRemaining() % (1000 * 60)) / 1000),
  );

  ngOnDestroy() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }
}
