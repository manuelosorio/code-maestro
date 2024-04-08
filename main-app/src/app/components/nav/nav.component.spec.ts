import { TestBed } from '@angular/core/testing';
import { NavComponent } from './nav.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
    }).compileComponents();
  });

  it('should create nav component', () => {
    const fixture = TestBed.createComponent(NavComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
