import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
export class SidebarComponent {
  private authService = inject(AuthService);

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
