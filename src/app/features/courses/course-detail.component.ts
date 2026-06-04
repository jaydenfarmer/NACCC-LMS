import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../shared/services/course.service';
import { AuthService } from '../../shared/services/auth.service';
import { Lesson, LessonType } from '../../shared/models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  courseId = signal<string>('');

  course = computed(() => {
    const id = this.courseId();
    return id ? this.courseService.getCourseById(id) : undefined;
  });

  lessons = computed(() => this.course()?.lessons ?? []);

  enrollment = computed(() => {
    const user = this.authService.user();
    const id = this.courseId();
    if (!user || !id) return null;
    return this.courseService.getEnrollment(user.id, id);
  });

  isEnrolled = computed(() => !!this.enrollment());

  totalLessons = computed(() =>
    this.lessons().filter(l => l.type !== 'section').length
  );

  completedLessonsCount = computed(() =>
    this.lessons().filter(l => l.type !== 'section' && !!l.isCompleted).length
  );

  progressPercentage = computed(() => {
    const total = this.totalLessons();
    const completed = this.completedLessonsCount();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  selectedLesson = signal<Lesson | null>(null);

  // Tracks which section IDs are collapsed; all expanded by default
  collapsedSections = signal<Set<string>>(new Set());

  // Lessons visible in the sidebar — hides content rows under collapsed sections
  visibleLessons = computed(() => {
    const allLessons = this.lessons();
    const collapsed = this.collapsedSections();
    let currentSectionId = '';
    return allLessons.filter(lesson => {
      if (lesson.type === 'section') {
        currentSectionId = lesson.id;
        return true;
      }
      return !collapsed.has(currentSectionId);
    });
  });

  constructor() {
    this.route.params.subscribe(params => {
      this.courseId.set(params['id']);
      setTimeout(() => {
        const firstIncomplete = this.findFirstIncompleteLesson();
        if (firstIncomplete) {
          this.selectLesson(firstIncomplete);
        } else {
          const first = this.lessons().find(l => l.type !== 'section');
          if (first) this.selectLesson(first);
        }
      }, 0);
    });
  }

  isSectionCollapsed(sectionId: string): boolean {
    return this.collapsedSections().has(sectionId);
  }

  toggleSection(sectionId: string): void {
    this.collapsedSections.update(set => {
      const next = new Set(set);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }

  findFirstIncompleteLesson(): Lesson | null {
    return this.lessons().find(l => l.type !== 'section' && !l.isCompleted) ?? null;
  }

  selectLesson(lesson: Lesson): void {
    this.selectedLesson.set(lesson);
  }

  enroll(): void {
    const user = this.authService.user();
    const id = this.courseId();
    if (user && id) {
      this.courseService.enrollCourse(user.id, id);
    }
  }

  completeLesson(): void {
    const lesson = this.selectedLesson();
    if (!lesson || lesson.isCompleted) return;

    this.courseService.completeLesson(this.courseId(), lesson.id);

    const enrollmentData = this.enrollment();
    if (enrollmentData) {
      this.courseService.updateProgress(
        enrollmentData.id,
        this.progressPercentage()
      );
    }

    const next = this.findNextLesson(lesson);
    if (next) this.selectLesson(next);
  }

  findNextLesson(currentLesson: Lesson): Lesson | null {
    const flat = this.lessons();
    const idx = flat.findIndex(l => l.id === currentLesson.id);
    if (idx === -1) return null;
    for (let i = idx + 1; i < flat.length; i++) {
      if (flat[i].type !== 'section') return flat[i];
    }
    return null;
  }

  findPrevLesson(currentLesson: Lesson): Lesson | null {
    const flat = this.lessons();
    const idx = flat.findIndex(l => l.id === currentLesson.id);
    if (idx === -1) return null;
    for (let i = idx - 1; i >= 0; i--) {
      if (flat[i].type !== 'section') return flat[i];
    }
    return null;
  }

  isFirstLesson(lesson: Lesson): boolean {
    const nonSection = this.lessons().filter(l => l.type !== 'section');
    return nonSection[0]?.id === lesson.id;
  }

  isLastLesson(lesson: Lesson): boolean {
    const nonSection = this.lessons().filter(l => l.type !== 'section');
    return nonSection[nonSection.length - 1]?.id === lesson.id;
  }

  navigatePrev(): void {
    const lesson = this.selectedLesson();
    if (!lesson) return;
    const prev = this.findPrevLesson(lesson);
    if (prev) this.selectLesson(prev);
  }

  navigateNext(): void {
    const lesson = this.selectedLesson();
    if (!lesson) return;
    const next = this.findNextLesson(lesson);
    if (next) this.selectLesson(next);
  }

  getRightButtonLabel(lesson: Lesson): string {
    const last = this.isLastLesson(lesson);
    if (lesson.isCompleted) return last ? 'Finish' : 'Next →';
    return last ? 'Skip to End' : 'Skip →';
  }

  getStatusMessage(lesson: Lesson): string {
    if (lesson.isCompleted) return '';
    if (lesson.type === 'test') return 'Pass the test to continue';
    if (lesson.type === 'assignment') return 'Complete the assignment to continue';
    if (lesson.type === 'content_page' && lesson.completion_method === 'question') {
      return 'Answer the question to continue';
    }
    return '';
  }

  navigateToExam(lesson: Lesson): void {
    const id = this.courseId();
    this.router.navigate(['/courses', id, 'lesson', lesson.id, 'exam']);
  }

  getLessonIcon(type: LessonType): string {
    const icons: Record<LessonType, string> = {
      section: '📂',
      content_page: '📄',
      web_content: '🌐',
      video: '🎥',
      audio: '🎵',
      presentation_document: '📊',
      iframe: '🔗',
      test: '✍️',
      survey: '📋',
      assignment: '📝',
      ilt: '🎓',
      scorm: '📦'
    };
    return icons[type] ?? '📚';
  }
}
