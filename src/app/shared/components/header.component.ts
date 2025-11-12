import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  logoPath = 'images/logos/NACCC_LOGO.png';
  constructor(private authService: AuthService) {}

  get user() {
    return this.authService.user;
  }

  logout(): void {
    this.authService.logout();
  }
}
