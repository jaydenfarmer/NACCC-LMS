import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SidebarService } from '../services/sidebar.service';
import { SearchService, SearchResults } from '../services/search.service';
import { SearchDropdownComponent } from './search-dropdown/search-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchDropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private searchService = inject(SearchService);
  sidebar = inject(SidebarService);

  logoPath = 'images/logos/NACCC_LOGO.png';
  searchQuery = signal('');
  dropdownResults = signal<SearchResults | null>(null);
  notificationCount = signal(3);
  messageCount = signal(5);

  get user() {
    return this.authService.user;
  }
  userMenuOpen = false;

  toggleUserMenu(ev?: Event) {
    if (ev) ev.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.userMenuOpen = false;
    const target = event.target as HTMLElement;
    if (!target.closest('.search-bar')) {
      this.dropdownResults.set(null);
    }
  }

  onSearchInput(value: string): void {
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

  openNotifications() {
    // TODO: Implement notifications panel
  }

  openMessages() {
    // TODO: Implement messages panel
  }

  switchRole(role: 'admin' | 'instructor' | 'learner') {
    this.userMenuOpen = false;
    this.authService.switchRole(role);
    // Navigate to dashboard to refresh the view
    this.router.navigate(['/dashboard']);
  }

  goToProfile() {
    this.userMenuOpen = false;
    this.router.navigate(['/profile']);
  }

  goToProgress() {
    this.userMenuOpen = false;
    this.router.navigate(['/my-progress']);
  }

  goToGroups() {
    this.userMenuOpen = false;
    this.router.navigate(['/groups']);
  }

  logout() {
    this.userMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.sidebar.toggle();
  }
}
