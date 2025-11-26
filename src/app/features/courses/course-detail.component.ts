import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { Course, Module, Lesson } from '../../core/models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent {
  courseId = signal<string>('');
  
  course = computed(() => {
    const id = this.courseId();
    return id ? this.courseService.getCourseById(id) : undefined;
  });

  modules = computed(() => {
    return this.course()?.modules || [];
  });

  enrollment = computed(() => {
    const user = this.authService.user();
    const id = this.courseId();
    if (!user || !id) return null;
    return this.courseService.getEnrollment(user.id, id);
  });

  isEnrolled = computed(() => !!this.enrollment());

  totalLessons = computed(() => {
    return this.modules().reduce((sum, mod) => sum + mod.lessons.length, 0);
  });

  completedLessonsCount = computed(() => {
    return this.modules().reduce((sum, mod) => 
      sum + mod.lessons.filter(l => l.isCompleted).length, 0
    );
  });

  progressPercentage = computed(() => {
    const total = this.totalLessons();
    const completed = this.completedLessonsCount();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  selectedLesson = signal<Lesson | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService
  ) {
    this.route.params.subscribe(params => {
      this.courseId.set(params['id']);
      
      // Auto-select first incomplete lesson when course loads
      setTimeout(() => {
        const firstIncomplete = this.findFirstIncompleteLesson();
        if (firstIncomplete) {
          this.selectLesson(firstIncomplete);
        } else if (this.modules().length > 0 && this.modules()[0].lessons.length > 0) {
          this.selectLesson(this.modules()[0].lessons[0]);
        }
      }, 0);
    });
  }

  findFirstIncompleteLesson(): Lesson | null {
    for (const module of this.modules()) {
      const incompleteLesson = module.lessons.find(l => !l.isCompleted);
      if (incompleteLesson) {
        return incompleteLesson;
      }
    }
    return null;
  }

  toggleModule(moduleId: string): void {
    const course = this.course();
    if (!course || !course.modules) return;

    course.modules = course.modules.map(mod => 
      mod.id === moduleId ? { ...mod, isExpanded: !mod.isExpanded } : mod
    );
  }

  enroll(): void {
    const user = this.authService.user();
    const id = this.courseId();
    if (user && id) {
      this.courseService.enrollCourse(user.id, id);
    }
  }

  selectLesson(lesson: Lesson): void {
    this.selectedLesson.set(lesson);
  }

  completeLesson(): void {
    const lesson = this.selectedLesson();
    if (!lesson || lesson.isCompleted) return;

    const course = this.course();
    if (!course || !course.modules) return;

    // Mark lesson as completed
    course.modules = course.modules.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(l => 
        l.id === lesson.id ? { ...l, isCompleted: true } : l
      )
    }));

    // Update enrollment progress
    const enrollmentData = this.enrollment();
    if (enrollmentData) {
      const newProgress = this.progressPercentage();
      const newCompletedCount = this.completedLessonsCount();
      this.courseService.updateProgress(enrollmentData.id, newProgress, newCompletedCount);
    }

    // Auto-advance to next lesson
    const nextLesson = this.findNextLesson(lesson);
    if (nextLesson) {
      this.selectLesson(nextLesson);
    }
  }

  findNextLesson(currentLesson: Lesson): Lesson | null {
    const modules = this.modules();
    for (let i = 0; i < modules.length; i++) {
      const lessons = modules[i].lessons;
      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
      
      if (currentIndex !== -1) {
        // Check if there's a next lesson in current module
        if (currentIndex + 1 < lessons.length) {
          return lessons[currentIndex + 1];
        }
        // Check if there's a next module
        if (i + 1 < modules.length && modules[i + 1].lessons.length > 0) {
          return modules[i + 1].lessons[0];
        }
      }
    }
    return null;
  }

  getLessonIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'video': '🎥',
      'pdf': '📄',
      'quiz': '✍️',
      'exam': '📝',
      'assignment': '📋'
    };
    return icons[type] || '📚';
  }

  getModuleProgress(module: Module): number {
    const completed = module.lessons.filter(l => l.isCompleted).length;
    const total = module.lessons.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}
