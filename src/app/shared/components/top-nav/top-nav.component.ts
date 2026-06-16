import {
  Component,
  signal,
  computed,
  inject,
  HostListener,
  ElementRef,
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SearchService, SearchResults } from '../../services/search.service';
import { SearchDropdownComponent } from '../search-dropdown/search-dropdown.component';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles?: string[];
  children?: NavItem[];
}

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SearchDropdownComponent],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css',
})
export class TopNavComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);
  private readonly elementRef = inject(ElementRef);

  readonly logoPath = 'images/logos/NACCC_LOGO.png';
  readonly searchQuery = signal('');
  readonly dropdownResults = signal<SearchResults | null>(null);
  readonly notificationCount = signal(3);
  readonly messageCount = signal(5);
  readonly openDropdownPath = signal<string | null>(null);
  readonly userMenuOpen = signal(false);

  get user() {
    return this.authService.user;
  }

  private readonly allNavItems = signal<NavItem[]>([
    // Learner
    { path: '/dashboard', label: 'Home', icon: '🏠', roles: ['learner'] },
    { path: '/my-learning', label: 'My training', icon: '📖', roles: ['learner'] },
    { path: '/my-certificates', label: 'My Certificates', icon: '🏅', roles: ['learner'] },
    { path: '/courses', label: 'Catalog', icon: '📚', roles: ['learner'] },
    { path: '/calendar', label: 'Calendar', icon: '📅', roles: ['learner'] },
    { path: '/skills', label: 'Skills', icon: '🎯', roles: ['learner'] },

    // Instructor
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

    // Admin
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

  readonly navItems = computed<NavItem[]>(() => {
    const currentUser = this.authService.user();
    if (!currentUser) return [];
    return this.allNavItems().filter(
      (item) => !item.roles || item.roles.includes(currentUser.role.toLowerCase())
    );
  });

  isDropdownOpen(item: NavItem): boolean {
    return this.openDropdownPath() === item.path;
  }

  isParentActive(item: NavItem): boolean {
    const url = this.router.url;
    return (
      item.children?.some(
        (child) => url === child.path || url.startsWith(child.path + '/')
      ) ?? false
    );
  }

  toggleDropdown(item: NavItem, event: MouseEvent): void {
    event.stopPropagation();
    const current = this.openDropdownPath();
    this.openDropdownPath.set(current === item.path ? null : item.path);
    this.userMenuOpen.set(false);
  }

  closeDropdown(): void {
    this.openDropdownPath.set(null);
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen.update((v) => !v);
    this.openDropdownPath.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.openDropdownPath.set(null);
      this.userMenuOpen.set(false);
      this.dropdownResults.set(null);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.openDropdownPath.set(null);
    this.userMenuOpen.set(false);
    this.dropdownResults.set(null);
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    const trimmed = value.trim();
    if (trimmed) {
      const results = this.searchService.search(trimmed);
      this.dropdownResults.set(
        results.users.length > 0 || results.courses.length > 0 ? results : null
      );
    } else {
      this.dropdownResults.set(null);
    }
  }

  onSearch(): void {
    const term = this.searchQuery().trim();
    this.dropdownResults.set(null);
    if (term) {
      this.router.navigate(['/search'], { queryParams: { q: term } });
    }
  }

  onResultSelected(): void {
    this.dropdownResults.set(null);
    this.searchQuery.set('');
  }

  openNotifications(): void { return; }

  openMessages(): void { return; }

  switchRole(role: 'admin' | 'instructor' | 'learner'): void {
    this.userMenuOpen.set(false);
    this.authService.switchRole(role);
    const destinations: Record<'admin' | 'instructor' | 'learner', string> = {
      admin: '/dashboard',
      instructor: '/dashboard',
      learner: '/my-learning',
    };
    this.router.navigate([destinations[role]]);
  }

  goToProfile(): void {
    this.userMenuOpen.set(false);
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.userMenuOpen.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    const u = this.authService.user();
    if (!u) return '';
    return ((u.firstName?.[0] ?? '') + (u.lastName?.[0] ?? '')).toUpperCase();
  }
}
