import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // 'admin', 'instructor', 'learner'
  avatar?: string;
  permissions?: string[];
  availableRoles?: string[]; // Roles this user can switch between
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // User signal
  user = signal<User | null>(null);

  // Check if user has specific role
  hasRole(role: string): boolean {
    const currentUser = this.user();
    return currentUser?.role.toLowerCase() === role.toLowerCase();
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    const currentUser = this.user();
    if (!currentUser) return false;
    return roles.some((role) => role.toLowerCase() === currentUser.role.toLowerCase());
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    const currentUser = this.user();
    if (!currentUser) return false;

    // Admins have all permissions
    if (currentUser.role === 'admin') return true;

    // Check explicit permissions
    return currentUser.permissions?.includes(permission) || false;
  }

  // Set user permissions based on role (example implementation)
  private setDefaultPermissions(user: User): User {
    switch (user.role.toLowerCase()) {
      case 'admin':
        user.permissions = [
          'view_students',
          'manage_students',
          'view_assignments',
          'manage_assignments',
          'view_grades',
          'edit_grades',
          'generate_reports',
          'manage_users',
        ];
        break;
      case 'instructor':
        user.permissions = [
          'view_students',
          'view_assignments',
          'manage_assignments',
          'view_grades',
          'edit_grades',
        ];
        break;
      case 'learner':
        user.permissions = ['view_assignments', 'view_grades'];
        break;
    }
    return user;
  }

  isAuthenticated(): boolean {
    return this.user() !== null;
  }

  // Login method - MUST return boolean for compatibility with LoginComponent
  login(email: string, password: string): boolean {
    // Your login validation logic here
    // For demo purposes, accepting any credentials
    if (email && password) {
      // Default demo account with all roles (super user)
      const user = this.setDefaultPermissions({
        id: '1',
        firstName: 'Jayden',
        lastName: 'Farmer',
        email: email,
        role: 'admin', // Start as admin
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
        availableRoles: ['admin', 'instructor', 'learner'], // Can switch between all roles
      });

      this.user.set(user);
      return true; // Login successful
    }

    return false; // Login failed
  }

  switchRole(role: 'admin' | 'instructor' | 'learner'): void {
    const currentUser = this.user();
    if (!currentUser) return;

    // Check if user has permission to switch to this role
    if (!currentUser.availableRoles?.includes(role)) {
      console.warn(`User does not have permission to switch to ${role}`);
      return;
    }

    // Update user role and permissions without logging out
    const updatedUser = this.setDefaultPermissions({
      ...currentUser,
      role: role,
    });

    this.user.set(updatedUser);
  }

  logout(): void {
    this.user.set(null);
    // Additional logout logic
  }
}
