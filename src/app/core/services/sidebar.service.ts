import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'lms.sidebar.collapsed'; // localStorage key (change if desired)

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private _collapsed = new BehaviorSubject<boolean>(this.readInitial());
  collapsed$ = this._collapsed.asObservable();

  toggle() {
    this.set(!this._collapsed.value);
  }

  set(value: boolean) {
    this._collapsed.next(value);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch {}
  }

  get value() {
    return this._collapsed.value;
  }

  private readInitial(): boolean {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v ? JSON.parse(v) : false;
    } catch {
      return false;
    }
  }
}