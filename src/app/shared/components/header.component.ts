import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: string[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Courses', path: '/courses', icon: '📚' },
    { label: 'My Learning', path: '/my-learning', icon: '🎓', roles: ['learner'] },
    { label: 'Teaching', path: '/teaching', icon: '👨‍🏫', roles: ['instructor'] },
    { label: 'Admin', path: '/admin', icon: '⚙️', roles: ['admin'] }
  ];

  constructor(private authService: AuthService) {}

  get user() {
    return this.authService.user;
  }

  visibleNavItems = computed(() => {
    const currentUser = this.user();
    if (!currentUser) return [];

    return this.navItems.filter(item => 
      !item.roles || item.roles.includes(currentUser.role)
    );
  });

  logout(): void {
    this.authService.logout();
  }
}
