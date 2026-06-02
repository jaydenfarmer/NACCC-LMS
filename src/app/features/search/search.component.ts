import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService, SearchResults } from '../../shared/services/search.service';
import { HighlightPipe } from '../../shared/pipes/highlight.pipe';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, HighlightPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private searchService = inject(SearchService);
  private route = inject(ActivatedRoute);

  readonly PAGE_SIZE = 5;

  term = signal('');
  results = signal<SearchResults | null>(null);
  visibleUserCount = signal(this.PAGE_SIZE);
  visibleCourseCount = signal(this.PAGE_SIZE);

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      const q = (params['q'] as string | undefined) ?? '';
      this.term.set(q);
      this.visibleUserCount.set(this.PAGE_SIZE);
      this.visibleCourseCount.set(this.PAGE_SIZE);
      this.results.set(q.trim() ? this.searchService.search(q) : null);
    });
  }

  totalUsers = computed(() => this.results()?.users.length ?? 0);
  totalCourses = computed(() => this.results()?.courses.length ?? 0);
  totalResults = computed(() => this.totalUsers() + this.totalCourses());

  visibleUsers = computed(() =>
    this.results()?.users.slice(0, this.visibleUserCount()) ?? []
  );
  visibleCourses = computed(() =>
    this.results()?.courses.slice(0, this.visibleCourseCount()) ?? []
  );

  hasMoreUsers = computed(() => this.visibleUserCount() < this.totalUsers());
  hasMoreCourses = computed(() => this.visibleCourseCount() < this.totalCourses());

  loadMoreUsers(): void {
    this.visibleUserCount.update((n) => n + this.PAGE_SIZE);
  }

  loadMoreCourses(): void {
    this.visibleCourseCount.update((n) => n + this.PAGE_SIZE);
  }
}
