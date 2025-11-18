import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Announcement {
  id: string;
  message: string;
  link?: string;
  linkText?: string;
  type?: 'info' | 'warning' | 'success';
  dismissible?: boolean;
}

@Component({
  selector: 'app-announcement-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcement-banner.component.html',
  styleUrl: './announcement-banner.component.css',
})
export class AnnouncementBannerComponent {
  @Input() announcement?: Announcement;
  
  dismissed = signal(false);

  dismiss() {
    this.dismissed.set(true);
  }
}
