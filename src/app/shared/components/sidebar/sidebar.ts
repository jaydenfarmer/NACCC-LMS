import { Component, signal, computed, inject, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarService } from '../../../core/services/sidebar.service';
import { Subscription } from 'rxjs';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions, not just one
  children?: NavItem[]; // For expandable submenus
  expanded?: boolean; // For tracking expanded state
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private sub = new Subscription();
  private sidebarService = inject(SidebarService);
  private authService = inject(AuthService);

  collapsed = signal(false);

  @HostBinding('class.collapsed')
  get isCollapsed() {
    return this.collapsed();
  }

  ngOnInit(): void {
    // Initialize with current value from service
    this.collapsed.set(this.sidebarService.value);

    // Subscribe to service changes and update our signal
    this.sub.add(
      this.sidebarService.collapsed$.subscribe((value) => {
        console.log('Service collapsed changed to:', value); // Debug
        this.collapsed.set(value);
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private allNavItems = signal<NavItem[]>([
    // Learner Navigation
    {
      path: '/dashboard',
      label: 'Home',
      icon: '🏠',
      roles: ['learner'],
    },
    {
      path: '/my-training',
      label: 'My training',
      icon: '📖',
      roles: ['learner'],
    },
    {
      path: '/courses',
      label: 'Catalog',
      icon: '📚',
      roles: ['learner'],
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: '📅',
      roles: ['learner'],
    },
    {
      path: '/skills',
      label: 'Skills',
      icon: '🎯',
      roles: ['learner'],
    },

    // Instructor Navigation
    {
      path: '/dashboard',
      label: 'Home',
      icon: '🏠',
      roles: ['instructor'],
    },
    {
      path: '/courses',
      label: 'Courses',
      icon: '📚',
      roles: ['instructor'],
    },
    {
      path: '/learning-paths',
      label: 'Learning paths',
      icon: '🛤️',
      roles: ['instructor'],
    },
    {
      path: '/groups',
      label: 'Groups',
      icon: '👥',
      roles: ['instructor'],
    },
    {
      path: '/grading-hub',
      label: 'Grading Hub',
      icon: '📝',
      roles: ['instructor'],
    },
    {
      path: '/conferences',
      label: 'Conferences',
      icon: '🎥',
      roles: ['instructor'],
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: '📊',
      roles: ['instructor'],
      children: [
        {
          path: '/reports/overview',
          label: 'Overview',
          icon: '📈',
          roles: ['instructor'],
        },
        {
          path: '/reports/students',
          label: 'Student Progress',
          icon: '👤',
          roles: ['instructor'],
        },
        {
          path: '/reports/courses',
          label: 'Course Analytics',
          icon: '📚',
          roles: ['instructor'],
        },
      ],
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: '📅',
      roles: ['instructor'],
    },
    {
      path: '/skills',
      label: 'Skills',
      icon: '🎯',
      roles: ['instructor'],
    },

    // Administrator Navigation
    {
      path: '/dashboard',
      label: 'Home',
      icon: '🏠',
      roles: ['admin'],
    },
    {
      path: '/users',
      label: 'Users',
      icon: '👤',
      roles: ['admin'],
    },
    {
      path: '/courses',
      label: 'Courses',
      icon: '📚',
      roles: ['admin'],
    },
    {
      path: '/learning-paths',
      label: 'Learning paths',
      icon: '🛤️',
      roles: ['admin'],
    },
    {
      path: '/course-store',
      label: 'Course store',
      icon: '🏪',
      roles: ['admin'],
      children: [
        {
          path: '/course-store/catalog',
          label: 'Browse Catalog',
          icon: '📖',
          roles: ['admin'],
        },
        {
          path: '/course-store/purchased',
          label: 'Purchased',
          icon: '✅',
          roles: ['admin'],
        },
      ],
    },
    {
      path: '/groups',
      label: 'Groups',
      icon: '👥',
      roles: ['admin'],
    },
    {
      path: '/branches',
      label: 'Branches',
      icon: '🌿',
      roles: ['admin'],
    },
    {
      path: '/automations',
      label: 'Automations',
      icon: '⚡',
      roles: ['admin'],
    },
    {
      path: '/notifications',
      label: 'Notifications',
      icon: '🔔',
      roles: ['admin'],
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: '📊',
      roles: ['admin'],
      children: [
        {
          path: '/reports/overview',
          label: 'Overview',
          icon: '📈',
          roles: ['admin'],
        },
        {
          path: '/reports/users',
          label: 'User Reports',
          icon: '👤',
          roles: ['admin'],
        },
        {
          path: '/reports/courses',
          label: 'Course Analytics',
          icon: '📚',
          roles: ['admin'],
        },
        {
          path: '/reports/portal-activity',
          label: 'Portal Activity',
          icon: '📊',
          roles: ['admin'],
        },
      ],
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: '📅',
      roles: ['admin'],
    },
    {
      path: '/skills',
      label: 'Skills',
      icon: '🎯',
      roles: ['admin'],
    },
    {
      path: '/settings',
      label: 'Account & Settings',
      icon: '⚙️',
      roles: ['admin'],
      children: [
        {
          path: '/settings/general',
          label: 'General',
          icon: '🔧',
          roles: ['admin'],
        },
        {
          path: '/settings/security',
          label: 'Security',
          icon: '🔒',
          roles: ['admin'],
        },
        {
          path: '/settings/integrations',
          label: 'Integrations',
          icon: '🔌',
          roles: ['admin'],
        },
      ],
    },
    {
      path: '/subscription',
      label: 'Subscription',
      icon: '💳',
      roles: ['admin'],
    },
  ]);

  navItems = computed(() => {
    const currentUser = this.authService.user();
    if (!currentUser) {
      return [];
    }

    return this.allNavItems().filter((item) => {
      // Check roles
      const hasRole = !item.roles || item.roles.includes(currentUser.role.toLowerCase());

      // Check permissions
      let hasPermission = true;
      if (item.permissions && item.permissions.length > 0) {
        if (item.requireAll) {
          // User must have ALL permissions
          hasPermission = item.permissions.every((permission) =>
            this.authService.hasPermission(permission)
          );
        } else {
          // User must have at least ONE permission
          hasPermission = item.permissions.some((permission) =>
            this.authService.hasPermission(permission)
          );
        }
      }

      return hasRole && hasPermission;
    });
  });

  // Show submenu (flyout) on hover
  showSubmenu(item: NavItem): void {
    const updated = this.allNavItems().map(navItem => navItem.path === item.path ? { ...navItem, expanded: true } : navItem);
    this.allNavItems.set(updated);
  }

  // Hide the flyout when leaving
  hideSubmenu(item: NavItem): void {
    const updated = this.allNavItems().map(navItem => navItem.path === item.path ? { ...navItem, expanded: false } : navItem);
    this.allNavItems.set(updated);
  }

  // Keep toggle for keyboard/accessibility (click)
  toggleSubmenu(item: NavItem, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const updated = this.allNavItems().map(navItem => navItem.path === item.path ? { ...navItem, expanded: !navItem.expanded } : navItem);
    this.allNavItems.set(updated);
  }

  user = this.authService.user;
}
