import { Component, computed, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  private sanitizer = inject(DomSanitizer);
  private destroyRef = inject(DestroyRef);

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

  courseComplete = computed(() =>
    this.isEnrolled() &&
    this.totalLessons() > 0 &&
    this.completedLessonsCount() === this.totalLessons()
  );

  completionDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  selectedLesson = signal<Lesson | null>(null);

  // Completion question state — reset on every lesson change
  selectedAnswerIndex = signal<number | null>(null);
  answerSubmitted = signal(false);
  answerCorrect = signal(false);

  // Enrollment modal state
  modalOpen = signal(false);
  couponCode = signal('');
  couponApplied = signal(false);
  paymentPending = signal(false);
  enrollToast = signal<string | null>(null);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

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
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
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
    this.selectedAnswerIndex.set(null);
    this.answerSubmitted.set(false);
    this.answerCorrect.set(false);
  }

  openModal(): void {
    this.couponCode.set('');
    this.couponApplied.set(false);
    this.paymentPending.set(false);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  applyCoupon(): void {
    if (this.couponCode().trim()) {
      this.couponApplied.set(true);
    }
  }

  checkout(): void {
    this.paymentPending.set(true);
    setTimeout(() => {
      this.doEnroll();
    }, 800);
  }

  enrollFree(): void {
    this.doEnroll();
  }

  private doEnroll(): void {
    const user = this.authService.user();
    const id = this.courseId();
    const courseName = this.course()?.title ?? 'this course';
    if (user && id) {
      this.courseService.enrollCourse(user.id, id);
    }
    this.modalOpen.set(false);
    this.paymentPending.set(false);
    this.showToast(`Success! You're now enrolled in ${courseName}`);
  }

  private showToast(message: string): void {
    if (this.toastTimer !== null) clearTimeout(this.toastTimer);
    this.enrollToast.set(message);
    this.toastTimer = setTimeout(() => {
      this.enrollToast.set(null);
      this.toastTimer = null;
    }, 4000);
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

  submitAnswer(): void {
    const lesson = this.selectedLesson();
    const q = lesson?.completion_question;
    if (!lesson || !q) return;
    const selected = this.selectedAnswerIndex();
    if (selected === null) return;

    this.answerSubmitted.set(true);

    if (selected === q.correctIndex) {
      this.answerCorrect.set(true);
      this.courseService.completeLesson(this.courseId(), lesson.id);
      const enrollmentData = this.enrollment();
      if (enrollmentData) {
        this.courseService.updateProgress(enrollmentData.id, this.progressPercentage());
      }
    }
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

  private readonly autoCompleteLessonTypes: LessonType[] = [
    'video', 'audio', 'iframe', 'presentation_document', 'web_content'
  ];

  private isAutoComplete(lesson: Lesson): boolean {
    return this.autoCompleteLessonTypes.includes(lesson.type) ||
      (lesson.type === 'content_page' && lesson.completion_method === 'button');
  }

  navigateNext(): void {
    const lesson = this.selectedLesson();
    if (!lesson) return;
    if (this.isAutoComplete(lesson) && !lesson.isCompleted) {
      this.courseService.completeLesson(this.courseId(), lesson.id);
      const enrollmentData = this.enrollment();
      if (enrollmentData) {
        this.courseService.updateProgress(enrollmentData.id, this.progressPercentage());
      }
    }
    const next = this.findNextLesson(lesson);
    if (next) this.selectLesson(next);
  }

  rightButtonLabel = computed(() => {
    const lesson = this.selectedLesson();
    if (!lesson) return 'Next →';
    const last = this.isLastLesson(lesson);
    const autoComplete = this.isAutoComplete(lesson);
    const done = lesson.isCompleted || this.answerCorrect() || autoComplete;
    if (done) return last ? 'Finish' : 'Next →';
    return last ? 'Skip to End' : 'Skip →';
  });

  statusMessage = computed(() => {
    const lesson = this.selectedLesson();
    if (!lesson) return '';
    if (lesson.isCompleted || this.answerCorrect()) return '';
    if (lesson.type === 'test') return 'Pass the test to continue';
    if (lesson.type === 'assignment') return 'Complete the assignment to continue';
    if (lesson.type === 'content_page' && lesson.completion_method === 'question') {
      return 'Answer the question to continue';
    }
    return '';
  });

  currentSectionTitle = computed<string>(() => {
    const lesson = this.selectedLesson();
    if (!lesson) return '';
    let section = '';
    for (const l of this.lessons()) {
      if (l.type === 'section') section = l.title;
      else if (l.id === lesson.id) return section;
    }
    return '';
  });

  getSafeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  }

  formatExpiryDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  downloadCertificate(): void { return; }

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
