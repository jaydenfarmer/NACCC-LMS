import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // User signal
  user = signal<User | null>(null);

  private STORAGE_KEY = 'lms.user';

  private readonly MOCK_CREDENTIALS: { email: string; password: string; user: User }[] = [
    {
      email: 'learner@naccc.com',
      password: 'password',
      user: {
        id: '1',
        firstName: 'Alex',
        lastName: 'Learner',
        email: 'learner@naccc.com',
        role: 'learner',
        profile_photo_url:'https://api.dicebear.com/7.x/avataaars/svg?seed=learner',
        availableRoles: ['learner'],
      },
    },
    {
      email: 'instructor@naccc.com',
      password: 'password',
      user: {
        id: '2',
        firstName: 'Jane',
        lastName: 'Instructor',
        email: 'instructor@naccc.com',
        role: 'instructor',
        profile_photo_url:'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
        availableRoles: ['instructor', 'learner'],
      },
    },
    {
      email: 'admin@naccc.com',
      password: 'password',
      user: {
        id: '3',
        firstName: 'Jayden',
        lastName: 'Farmer',
        email: 'admin@naccc.com',
        role: 'admin',
        profile_photo_url:'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        availableRoles: ['admin', 'instructor', 'learner'],
      },
    },
  ];

  constructor() {
    // Restore user from localStorage if present
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as User;
        this.user.set(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }

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

  login(email: string, password: string): boolean {
    const match = this.MOCK_CREDENTIALS.find(
      (c) => c.email === email.trim().toLowerCase() && c.password === password
    );
    if (!match) return false;

    const user = this.setDefaultPermissions({ ...match.user });
    this.user.set(user);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch { /* ignore */ }
    return true;
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
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
    } catch { /* ignore */ }
  }

  updateProfile(updates: Partial<User>): void {
    const current = this.user();
    if (!current) return;
    const updated = { ...current, ...updates };
    this.user.set(updated);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch { /* ignore */ }
  }

  logout(): void {
    this.user.set(null);
    // Additional logout logic
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch { /* ignore */ }
  }
}
