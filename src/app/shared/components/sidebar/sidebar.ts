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
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      roles: ['admin', 'instructor', 'learner'],
    },
    {
      path: '/courses',
      label: 'Courses',
      icon: '📚',
      roles: ['admin', 'instructor', 'learner'],
    },
    {
      path: '/students',
      label: 'Students',
      icon: '👥',
      permissions: ['view_students', 'manage_students'],
    },
    {
      path: '/assignments',
      label: 'Assignments',
      icon: '📝',
      permissions: ['view_assignments'],
    },
    {
      path: '/grades',
      label: 'Grades',
      icon: '📋',
      permissions: ['view_grades'],
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: '📈',
      roles: ['admin'],
      permissions: ['generate_reports'],
      requireAll: true,
    },
    {
      path: '/user-management',
      label: 'User Management',
      icon: '👤',
      permissions: ['manage_users'],
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: '⚙️',
      roles: ['admin', 'instructor'],
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

  user = this.authService.user;
}
