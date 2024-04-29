import {
  Component,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  CommonModule,
  isPlatformBrowser,
  NgOptimizedImage,
} from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule, RouterLinkActive, RouterLink],
  styleUrls: ['./nav.component.sass'],
  templateUrl: './nav.component.html',
  providers: [AuthService, HttpClientModule],
})
export class NavComponent implements OnDestroy {
  private readonly authSubscription: Subscription | undefined;
  public isAuth: WritableSignal<any>;
  private isBrowser: boolean = isPlatformBrowser(this.platformId);
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private authService: AuthService,
  ) {
    this.isAuth = signal('');

    if (this.isBrowser) {
      this.authService.isAuthenticated().subscribe((res) => {
        console.log(res);
        authService.setAuthStatus(res.authenticated);
      });

      this.authSubscription = this.authService.authenticated$.subscribe(
        (res) => {
          console.log(res);
          this.isAuth.set(res);
        },
      );
    }
  }
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  signOut() {
    this.authService.signOut();
  }
}
