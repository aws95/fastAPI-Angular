import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private payload = new Subject<any>();

  constructor() { }

  sendMessage(message: any) {
    this.payload.next(message)
  }

  clearMessage() {
    this.payload.next()
  }

  getMessage(): Observable<any> {
    return this.payload.asObservable();
  }
}
