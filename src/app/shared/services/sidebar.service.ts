import { Injectable, signal } from '@angular/core';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean;
  children?: NavItem[];
  expanded?: boolean;
}

export interface SidebarFlyoutState {
  open: boolean;
  item: NavItem | null;
  position: { top: number; left: number };
}

const STORAGE_KEY = 'lms.sidebar.collapsed';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  flyoutOpenItemPath: string | null = null;

  private readonly _collapsed = signal<boolean>(this.readInitial());
  readonly collapsed = this._collapsed.asReadonly();

  private readonly _flyoutHover = signal<boolean>(false);
  readonly flyoutHover = this._flyoutHover.asReadonly();
  setFlyoutHover(val: boolean): void { this._flyoutHover.set(val); }

  private readonly _flyout = signal<SidebarFlyoutState>({
    open: false,
    item: null,
    position: { top: 0, left: 0 }
  });
  readonly flyout = this._flyout.asReadonly();

  openFlyout(item: NavItem, position: { top: number; left: number }): void {
    this._flyout.set({ open: true, item, position });
  }

  closeFlyout(): void {
    this._flyout.set({ open: false, item: null, position: { top: 0, left: 0 } });
  }

  toggle(): void {
    this.set(!this._collapsed());
  }

  set(value: boolean): void {
    this._collapsed.set(value);
    if (value) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch { /* ignore */ }
  }

  private readInitial(): boolean {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      const collapsed = v ? JSON.parse(v) : false;
      if (collapsed) {
        document.body.classList.add('sidebar-collapsed');
      }
      return collapsed;
    } catch {
      return false;
    }
  }
}
