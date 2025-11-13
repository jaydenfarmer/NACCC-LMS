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

  get value() {
    return this._collapsed.value;
  }

  set(value: boolean) {
    this._collapsed.next(value);

    // Add/remove class on document body
    if (value) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {}
  }

  private readInitial(): boolean {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      const collapsed = v ? JSON.parse(v) : false;

      // Set initial body class
      if (collapsed) {
        document.body.classList.add('sidebar-collapsed');
      }

      return collapsed;
    } catch {
      return false;
    }
  }
}
