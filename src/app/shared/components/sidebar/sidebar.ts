import { Component, signal, computed, inject, HostBinding } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarService, NavItem } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent {
  private sidebarService = inject(SidebarService);
  private authService = inject(AuthService);

  @HostBinding('class.collapsed')
  get isCollapsed(): boolean {
    return this.sidebarService.collapsed();
  }

  private allNavItems = signal<NavItem[]>([
    // Learner Navigation
    { path: '/dashboard', label: 'Home', icon: '🏠', roles: ['learner'] },
    { path: '/my-learning', label: 'My training', icon: '📖', roles: ['learner'] },
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
    {
      path: '/reports',
      label: 'Reports',
      icon: '📊',
      roles: ['instructor'],
      children: [
        { path: '/reports/overview', label: 'Overview', icon: '📈', roles: ['instructor'] },
        { path: '/reports/students', label: 'Student Progress', icon: '👤', roles: ['instructor'] },
        { path: '/reports/courses', label: 'Course Analytics', icon: '📚', roles: ['instructor'] },
      ],
    },
    { path: '/calendar', label: 'Calendar', icon: '📅', roles: ['instructor'] },
    { path: '/skills', label: 'Skills', icon: '🎯', roles: ['instructor'] },

    // Administrator Navigation
    { path: '/dashboard', label: 'Home', icon: '🏠', roles: ['admin'] },
    { path: '/users', label: 'Users', icon: '👤', roles: ['admin'] },
    { path: '/courses', label: 'Courses', icon: '📚', roles: ['admin'] },
    { path: '/learning-paths', label: 'Learning paths', icon: '🛤️', roles: ['admin'] },
    {
      path: '/course-store',
      label: 'Course store',
      icon: '🏪',
      roles: ['admin'],
      children: [
        { path: '/course-store/catalog', label: 'Browse Catalog', icon: '📖', roles: ['admin'] },
        { path: '/course-store/purchased', label: 'Purchased', icon: '✅', roles: ['admin'] },
      ],
    },
    { path: '/groups', label: 'Groups', icon: '👥', roles: ['admin'] },
    { path: '/branches', label: 'Branches', icon: '🌿', roles: ['admin'] },
    { path: '/automations', label: 'Automations', icon: '⚡', roles: ['admin'] },
    { path: '/notifications', label: 'Notifications', icon: '🔔', roles: ['admin'] },
    {
      path: '/reports',
      label: 'Reports',
      icon: '📊',
      roles: ['admin'],
      children: [
        { path: '/reports/overview', label: 'Overview', icon: '📈', roles: ['admin'] },
        { path: '/reports/users', label: 'User Reports', icon: '👤', roles: ['admin'] },
        { path: '/reports/courses', label: 'Course Analytics', icon: '📚', roles: ['admin'] },
        { path: '/reports/portal-activity', label: 'Portal Activity', icon: '📊', roles: ['admin'] },
      ],
    },
    { path: '/calendar', label: 'Calendar', icon: '📅', roles: ['admin'] },
    { path: '/skills', label: 'Skills', icon: '🎯', roles: ['admin'] },
    {
      path: '/settings',
      label: 'Account & Settings',
      icon: '⚙️',
      roles: ['admin'],
      children: [
        { path: '/settings/general', label: 'General', icon: '🔧', roles: ['admin'] },
        { path: '/settings/security', label: 'Security', icon: '🔒', roles: ['admin'] },
        { path: '/settings/integrations', label: 'Integrations', icon: '🔌', roles: ['admin'] },
      ],
    },
    { path: '/subscription', label: 'Subscription', icon: '💳', roles: ['admin'] },
  ]);

  navItems = computed(() => {
    const currentUser = this.authService.user();
    if (!currentUser) return [];

    return this.allNavItems().filter((item) => {
      const hasRole = !item.roles || item.roles.includes(currentUser.role.toLowerCase());

      let hasPermission = true;
      if (item.permissions && item.permissions.length > 0) {
        if (item.requireAll) {
          hasPermission = item.permissions.every((permission) =>
            this.authService.hasPermission(permission)
          );
        } else {
          hasPermission = item.permissions.some((permission) =>
            this.authService.hasPermission(permission)
          );
        }
      }

      return hasRole && hasPermission;
    });
  });

  openFlyout(item: NavItem, event: MouseEvent): void {
    const sidebarRect = (event.target as HTMLElement).closest('.sidebar-item-group')?.getBoundingClientRect();
    const sidebarEl = document.querySelector('.sidebar');
    const sidebarBounds = sidebarEl ? sidebarEl.getBoundingClientRect() : { left: 0, top: 0, width: 260 };
    let position = { top: 0, left: 260 };
    if (sidebarRect) {
      position = {
        top: sidebarRect.top - sidebarBounds.top,
        left: sidebarBounds.width + 8
      };
    }
    this.sidebarService.flyoutOpenItemPath = item.path;
    this.sidebarService.setFlyoutHover(true);
    this.sidebarService.openFlyout(item, position);
  }

  closeFlyout(): void {
    setTimeout(() => {
      this.sidebarService.setFlyoutHover(false);
      this.sidebarService.flyoutOpenItemPath = null;
      this.sidebarService.closeFlyout();
    }, 80);
  }

  isFlyoutOpen(item: NavItem): boolean {
    return this.sidebarService.flyoutOpenItemPath === item.path;
  }

  toggleSubmenu(item: NavItem, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.sidebarService.closeFlyout();
  }

  user = this.authService.user;

  setSidebarHover(val: boolean): void {
    this.sidebarService.setFlyoutHover(val);
  }
}
