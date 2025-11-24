import { Component, computed, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { SidebarService } from '../../core/services/sidebar.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: string[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  logoPath = 'images/logos/NACCC_LOGO.png';
  searchQuery = signal('');
  notificationCount = signal(3); // Mock notification count
  messageCount = signal(5); // Mock message count
  
  constructor(
    private authService: AuthService,
    private router: Router,
    public sidebar: SidebarService
  ) {}

  get user() {
    return this.authService.user;
  }
  userMenuOpen = false;

  toggleUserMenu(ev?: Event) {
    if (ev) ev.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(_ev?: Event) {
    // close when clicking outside
    this.userMenuOpen = false;
  }

  onSearch() {
    const query = this.searchQuery();
    if (query.trim()) {
      this.router.navigate(['/courses'], { queryParams: { search: query } });
    }
  }

  openNotifications() {
    // TODO: Implement notifications panel
    console.log('Open notifications');
  }

  openMessages() {
    // TODO: Implement messages panel
    console.log('Open messages');
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
