import { Injectable, signal } from '@angular/core';
import { Announcement } from '../components/announcement-banner/announcement-banner.component';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  readonly activeAnnouncement = signal<Announcement>({
    id: '1',
    message: 'Join us for our monthly Instructor Chat on November 17th at 5PM EST! Current students can join directly through their course or by using this link:',
    link: 'https://us06web.zoom.us/j/86162263892',
    linkText: 'https://us06web.zoom.us/j/86162263892',
    type: 'info',
    dismissible: true
  });
}
