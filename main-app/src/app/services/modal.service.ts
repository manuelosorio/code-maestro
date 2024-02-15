import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private showModalSubject = new Subject<void>();
  showModal$ = this.showModalSubject.asObservable();
  constructor() {}

  triggerShowModal(): void {
    this.showModalSubject.next();
  }
}
