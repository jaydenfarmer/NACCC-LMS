import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../shared/services/course.service';
import { AuthService } from '../../shared/services/auth.service';
import { Course, Lesson, ExamQuestion } from '../../shared/models/course.model';


@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  courseId = '';
  lessonId = '';

  loading = signal(true);
  locked = signal(true);
  enteredPassword = signal('');
  passwordError = signal('');
  started = signal(false);
  finished = signal(false);
  currentIndex = signal(0);

  course: Course | null = null;
  lesson: Lesson | null = null;
  questions: ExamQuestion[] = [];
  answers: Record<string, number | null> = {};
  timerSeconds = 0;
  private timerHandle: ReturnType<typeof setInterval> | null = null;
  score: number | null = null;

  constructor() {
    const params = this.route.snapshot.params;
    this.courseId = params['courseId'];
    this.lessonId = params['lessonId'];

    this.init();
  }

  init(): void {
    const c = this.courseService.getCourseById(this.courseId);
    this.course = c ?? null;
    if (c && c.lessons) {
      this.lesson = c.lessons.find(l => l.id === this.lessonId) ?? null;
    }

    // If no lesson or not a test, navigate back
    if (!this.lesson || this.lesson.type !== 'test') {
      this.router.navigate(['/courses', this.courseId]);
      return;
    }

    // If lesson has no password, unlock immediately
    if (!this.lesson.password) {
      this.locked.set(false);
    }

    // Load mock questions for this lesson
    try {
      this.questions = this.courseService.getQuestionsForLesson(this.courseId, this.lessonId) || [];
      // initialize answers map
      for (const q of this.questions) {
        this.answers[q.id] = null;
      }
    } catch {
      this.questions = [];
    }

    this.loading.set(false);
  }

  submitPassword(): void {
    this.passwordError.set('');
    const attempt = this.enteredPassword();
    // Mock password check: compare to lesson.password
    if (this.lesson?.password && attempt !== this.lesson.password) {
      this.passwordError.set('Incorrect password. Please try again.');
      return;
    }

    this.locked.set(false);
  }

  prevQuestion(): void {
    this.currentIndex.update(i => Math.max(0, i - 1));
  }

  nextQuestion(): void {
    this.currentIndex.update(i => Math.min(this.questions.length - 1, i + 1));
  }

  startExam(): void {
    if (this.locked()) return;
    this.currentIndex.set(0);
    this.started.set(true);
    this.finished.set(false);
    this.score = null;

    const minutes = this.lesson?.time_limit_minutes ?? 0;
    this.timerSeconds = minutes > 0 ? minutes * 60 : 0;

    if (this.timerHandle) clearInterval(this.timerHandle);
    if (this.timerSeconds > 0) {
      this.timerHandle = setInterval(() => {
        this.timerSeconds = Math.max(0, this.timerSeconds - 1);
        if (this.timerSeconds === 0) this.autoSubmit();
      }, 1000);
    }
  }

  private autoSubmit(): void {
    if (!this.started() || this.finished()) return;
    this.submitExam();
  }

  selectOption(questionId: string, optionIndex: number): void {
    this.answers[questionId] = optionIndex;
  }

  submitExam(): void {
    // stop timer
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }

    // grade
    const total = this.questions.length || 1;
    let correct = 0;
    for (const q of this.questions) {
      const sel = this.answers[q.id];
      if (typeof sel === 'number' && sel === q.correctIndex) correct++;
    }

    this.score = Math.round((correct / total) * 100);
    this.finished.set(true);
    this.started.set(false);

    // Mark lesson complete if passing threshold met (default 70)
    const passing = this.lesson?.passingScore ?? 70;
    if (this.score >= passing && this.lesson) {
      this.courseService.completeLesson(this.courseId, this.lesson.id);
    }

    // Update enrollment progress from the now-updated service signal
    const user = this.authService.user();
    if (user) {
      const enrollment = this.courseService.getEnrollment(user.id, this.courseId);
      const updatedCourse = this.courseService.getCourseById(this.courseId);
      if (enrollment && updatedCourse) {
        const nonSectionLessons = updatedCourse.lessons.filter((l: Lesson) => l.type !== 'section');
        const completedCount = nonSectionLessons.filter((l: Lesson) => !!l.isCompleted).length;
        const totalLessons = nonSectionLessons.length;
        const newProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
        this.courseService.updateProgress(enrollment.id, newProgress);
      }
    }
  }

  scheduleRetake(): void {
    alert('To schedule a retake, please contact your instructor or visit the exam scheduling page.');
  }

  cancel(): void {
    this.router.navigate(['/courses', this.courseId]);
  }
}
