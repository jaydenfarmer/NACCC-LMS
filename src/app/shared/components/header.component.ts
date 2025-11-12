import { Component, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  logoPath = 'images/logos/NACCC_LOGO.png';
  constructor(private authService: AuthService,
    private router: Router,
  public sidebar: SidebarService) {}

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

  goToProfile() {
    this.userMenuOpen = false;
    this.router.navigate(['/profile']);
  }

  logout() {
    this.userMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.sidebar.toggle(); // central toggle, persisted
  }
}
