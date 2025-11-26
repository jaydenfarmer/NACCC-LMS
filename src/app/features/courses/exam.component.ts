import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent {
  courseId = '';
  lessonId = '';

  loading = signal(true);
  locked = signal(true);
  enteredPassword = signal('');
  passwordError = signal('');
  started = signal(false);
  finished = signal(false);

  course: any = null;
  lesson: any = null;
  questions: any[] = [];
  answers: { [qId: string]: number | null } = {};
  timerSeconds = 0;
  private timerHandle: any = null;
  score: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService
  ) {
    const params = this.route.snapshot.params;
    this.courseId = params['courseId'];
    this.lessonId = params['lessonId'];

    this.init();
  }

  init(): void {
    const c = this.courseService.getCourseById(this.courseId);
    this.course = c;
    if (c && c.modules) {
      for (const mod of c.modules) {
        const found = mod.lessons.find((l: any) => l.id === this.lessonId);
        if (found) {
          this.lesson = found;
          break;
        }
      }
    }

    // If no lesson or not an exam, navigate back
    if (!this.lesson || this.lesson.type !== 'exam') {
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
    } catch (e) {
      this.questions = [];
    }

    this.loading.set(false);
  }

  submitPassword(): void {
    this.passwordError.set('');
    const attempt = this.enteredPassword();
    // Mock password check: compare to lesson.password
    if (this.lesson.password && attempt !== this.lesson.password) {
      this.passwordError.set('Incorrect password. Please try again.');
      return;
    }

    this.locked.set(false);
  }

  startExam(): void {
    if (this.locked()) return;
    this.started.set(true);
    this.finished.set(false);
    this.score = null;

    // Start timer (lesson.duration is minutes)
    const minutes = this.lesson?.duration || 0;
    this.timerSeconds = Math.max(0, Math.floor(minutes * 60));

    // Start countdown
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
    }
    this.timerHandle = setInterval(() => {
      this.timerSeconds = Math.max(0, this.timerSeconds - 1);
      if (this.timerSeconds <= 0) {
        this.autoSubmit();
      }
    }, 1000);
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
    if (this.score >= passing) {
      // mark completed in course structure
      if (this.course && this.course.modules) {
        this.course.modules = this.course.modules.map((mod: any) => ({
          ...mod,
          lessons: mod.lessons.map((l: any) => (l.id === this.lesson.id ? { ...l, isCompleted: true } : l))
        }));
      }
    }

    // Optionally: update enrollment progress if present
    const user = this.authService.user();
    if (user) {
      const enrollment = this.courseService.getEnrollment(user.id, this.courseId);
      if (enrollment) {
        const completedCount = this.course.modules.reduce((s: number, m: any) => s + m.lessons.filter((ll: any) => ll.isCompleted).length, 0);
        const totalLessons = this.course.modules.reduce((s: number, m: any) => s + m.lessons.length, 0);
        const newProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
        this.courseService.updateProgress(enrollment.id, newProgress, completedCount);
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/courses', this.courseId]);
  }
}
