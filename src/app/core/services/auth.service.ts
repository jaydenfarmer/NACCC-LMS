import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  readonly user = this.currentUser.asReadonly();

  // Mock users for demo
  private mockUsers: { email: string; password: string; user: User }[] = [
    {
      email: 'learner@example.com',
      password: 'password',
      user: {
        id: '1',
        email: 'learner@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'learner',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      }
    },
    {
      email: 'instructor@example.com',
      password: 'password',
      user: {
        id: '2',
        email: 'instructor@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'instructor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
      }
    },
    {
      email: 'admin@example.com',
      password: 'password',
      user: {
        id: '3',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      }
    }
  ];

  constructor(private router: Router) {
    // Check if user was stored in session
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  login(email: string, password: string): boolean {
    const match = this.mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (match) {
      this.currentUser.set(match.user);
      sessionStorage.setItem('currentUser', JSON.stringify(match.user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.currentUser()?.role;
    return userRole ? roles.includes(userRole) : false;
  }
}
