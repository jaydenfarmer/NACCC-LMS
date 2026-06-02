import { Injectable, inject } from '@angular/core';
import { CourseService } from './course.service';

export interface UserSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
}

export interface CourseSearchResult {
  id: string;
  title: string;
  thumbnailUrl: string;
}

export interface SearchResults {
  users: UserSearchResult[];
  courses: CourseSearchResult[];
  term: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private courseService = inject(CourseService);

  private readonly MOCK_USERS: UserSearchResult[] = [
    {
      id: '1',
      firstName: 'Alex',
      lastName: 'Learner',
      email: 'learner@naccc.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=learner',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Instructor',
      email: 'instructor@naccc.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
    },
    {
      id: '3',
      firstName: 'Jayden',
      lastName: 'Farmer',
      email: 'admin@naccc.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  ];

  search(term: string): SearchResults {
    const t = term.trim().toLowerCase();
    if (!t) {
      return { users: [], courses: [], term };
    }

    const users = this.MOCK_USERS.filter(
      (u) =>
        u.firstName.toLowerCase().includes(t) ||
        u.lastName.toLowerCase().includes(t) ||
        u.email.toLowerCase().includes(t)
    );

    const courses = this.courseService
      .getCourses()
      .filter((c) => c.title.toLowerCase().includes(t))
      .map(
        (c): CourseSearchResult => ({
          id: c.id,
          title: c.title,
          thumbnailUrl: c.thumbnail_url ?? '',
        })
      );

    return { users, courses, term };
  }
}
