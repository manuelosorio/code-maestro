import {
  Component,
  signal,
  OnDestroy,
  computed,
  Inject,
  PLATFORM_ID,
  input,
  effect,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.sass',
  standalone: true,
  imports: [CommonModule],
})
export class CountdownComponent implements OnDestroy {
  CountdownDate = input('');
  private _countdownDate?: Date;
  private timeRemaining = signal(this.getTimeRemaining);
  private readonly timer?: Subscription;
  private isBrowser: boolean = isPlatformBrowser(this.platformId);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    effect(() => {
      this._countdownDate = new Date(this.CountdownDate());
    });
    if (this.isBrowser) {
      this.timer = interval(1000).subscribe(() => {
        this.timeRemaining.set(this.getTimeRemaining);
      });
    }
  }
  private get getTimeRemaining(): number {
    if (!this._countdownDate) {
      return 0;
    }
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

  loaded = computed(() => this.timeRemaining());

  ngOnDestroy() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }
}
