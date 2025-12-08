import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  item: any | null;
  position: { top: number; left: number };
}

const STORAGE_KEY = 'lms.sidebar.collapsed';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  navItems$ = new BehaviorSubject<NavItem[]>([
    // Learner Navigation
    { path: '/dashboard', label: 'Home', icon: '🏠', roles: ['learner'] },
    { path: '/my-training', label: 'My training', icon: '📖', roles: ['learner'] },
    { path: '/courses', label: 'Catalog', icon: '📚', roles: ['learner'] },
    { path: '/calendar', label: 'Calendar', icon: '📅', roles: ['learner'] },
    { path: '/skills', label: 'Skills', icon: '🎯', roles: ['learner'] },

    // Instructor Navigation
    { path: '/dashboard', label: 'Home', icon: '🏠', roles: ['instructor'] },
    { path: '/courses', label: 'Courses', icon: '📚', roles: ['instructor'] },
    { path: '/learning-paths', label: 'Learning paths', icon: '🛤️', roles: ['instructor'] },
    { path: '/groups', label: 'Groups', icon: '👥', roles: ['instructor'] },
    { path: '/grading-hub', label: 'Grading Hub', icon: '📝', roles: ['instructor'] },
    { path: '/conferences', label: 'Conferences', icon: '🎥', roles: ['instructor'] },
    { path: '/reports', label: 'Reports', icon: '📊', roles: ['instructor'], children: [
      { path: '/reports/overview', label: 'Overview', icon: '📈', roles: ['instructor'] },
      { path: '/reports/students', label: 'Student Progress', icon: '👤', roles: ['instructor'] },
      { path: '/reports/courses', label: 'Course Analytics', icon: '📚', roles: ['instructor'] }
    ] },
    { path: '/calendar', label: 'Calendar', icon: '📅', roles: ['instructor'] },
    { path: '/skills', label: 'Skills', icon: '🎯', roles: ['instructor'] },

    // Administrator Navigation
    { path: '/dashboard', label: 'Home', icon: '🏠', roles: ['admin'] },
    { path: '/users', label: 'Users', icon: '👤', roles: ['admin'] },
    { path: '/courses', label: 'Courses', icon: '📚', roles: ['admin'] },
    { path: '/learning-paths', label: 'Learning paths', icon: '🛤️', roles: ['admin'] },
    { path: '/course-store', label: 'Course store', icon: '🏪', roles: ['admin'], children: [
      { path: '/course-store/catalog', label: 'Browse Catalog', icon: '📖', roles: ['admin'] },
      { path: '/course-store/purchased', label: 'Purchased', icon: '✅', roles: ['admin'] }
    ] },
    { path: '/groups', label: 'Groups', icon: '👥', roles: ['admin'] },
    { path: '/branches', label: 'Branches', icon: '🌿', roles: ['admin'] },
    { path: '/automations', label: 'Automations', icon: '⚡', roles: ['admin'] },
    { path: '/notifications', label: 'Notifications', icon: '🔔', roles: ['admin'] },
    { path: '/reports', label: 'Reports', icon: '📊', roles: ['admin'], children: [
      { path: '/reports/overview', label: 'Overview', icon: '📈', roles: ['admin'] },
      { path: '/reports/users', label: 'User Reports', icon: '👤', roles: ['admin'] },
      { path: '/reports/courses', label: 'Course Analytics', icon: '📚', roles: ['admin'] },
      { path: '/reports/portal-activity', label: 'Portal Activity', icon: '📊', roles: ['admin'] }
    ] },
    { path: '/calendar', label: 'Calendar', icon: '📅', roles: ['admin'] },
    { path: '/skills', label: 'Skills', icon: '🎯', roles: ['admin'] },
    { path: '/settings', label: 'Account & Settings', icon: '⚙️', roles: ['admin'], children: [
      { path: '/settings/general', label: 'General', icon: '🔧', roles: ['admin'] },
      { path: '/settings/security', label: 'Security', icon: '🔒', roles: ['admin'] },
      { path: '/settings/integrations', label: 'Integrations', icon: '🔌', roles: ['admin'] }
    ] },
    { path: '/subscription', label: 'Subscription', icon: '💳', roles: ['admin'] }
  ]);

  flyoutOpenItemPath: string | null = null;

  private _flyoutHover = new BehaviorSubject<boolean>(false);
  flyoutHover$ = this._flyoutHover.asObservable();
  setFlyoutHover(val: boolean) { this._flyoutHover.next(val); }
  get flyoutHover() { return this._flyoutHover.value; }

  private _collapsed = new BehaviorSubject<boolean>(this.readInitial());
  collapsed$ = this._collapsed.asObservable();

  private _flyout = new BehaviorSubject<SidebarFlyoutState>({ open: false, item: null, position: { top: 0, left: 0 } });
  flyout$ = this._flyout.asObservable();

  public openFlyout(item: any, position: { top: number; left: number }) {
    this._flyout.next({ open: true, item, position });
  }

  public closeFlyout() {
    this._flyout.next({ open: false, item: null, position: { top: 0, left: 0 } });
  }

  toggle() {
    this.set(!this._collapsed.value);
  }

  get value(): boolean {
    return this._collapsed.value;
  }

  set(value: boolean): void {
    this._collapsed.next(value);
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
      if (collapsed) {
        document.body.classList.add('sidebar-collapsed');
      }
      return collapsed;
    } catch {
      return false;
    }
  }

  get navItems() {
    return this.navItems$.value;
  }
}
