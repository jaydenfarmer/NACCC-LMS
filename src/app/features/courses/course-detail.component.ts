import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { Course, Lesson } from '../../core/models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent {
  courseId = signal<string>('');
  
  course = computed(() => {
    const id = this.courseId();
    return id ? this.courseService.getCourseById(id) : undefined;
  });

  enrollment = computed(() => {
    const user = this.authService.user();
    const id = this.courseId();
    if (!user || !id) return null;
    return this.courseService.getEnrollment(user.id, id);
  });

  isEnrolled = computed(() => !!this.enrollment());

  // Mock lessons for demo
  lessons = signal<Lesson[]>([
    {
      id: 'lesson-1',
      courseId: this.courseId(),
      title: 'Introduction to Credit Counseling',
      description: 'Overview of credit counseling principles and best practices',
      order: 1,
      type: 'video',
      contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: 15,
      isCompleted: false
    },
    {
      id: 'lesson-2',
      courseId: this.courseId(),
      title: 'Understanding Credit Reports',
      description: 'How to read and interpret credit reports',
      order: 2,
      type: 'video',
      contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: 20,
      isCompleted: false
    },
    {
      id: 'lesson-3',
      courseId: this.courseId(),
      title: 'Client Assessment Techniques',
      description: 'Best practices for assessing client financial situations',
      order: 3,
      type: 'pdf',
      contentUrl: '/assets/sample.pdf',
      duration: 10,
      isCompleted: false
    },
    {
      id: 'lesson-4',
      courseId: this.courseId(),
      title: 'Knowledge Check',
      description: 'Test your understanding of the material',
      order: 4,
      type: 'quiz',
      duration: 5,
      isCompleted: false
    }
  ]);

  selectedLesson = signal<Lesson | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService
  ) {
    this.route.params.subscribe(params => {
      this.courseId.set(params['id']);
    });
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

  completeLesson(lessonId: string): void {
    const lessons = this.lessons();
    const index = lessons.findIndex(l => l.id === lessonId);
    if (index !== -1) {
      lessons[index].isCompleted = true;
      this.lessons.set([...lessons]);
      
      // Update progress
      const enrollment = this.enrollment();
      const course = this.course();
      if (enrollment && course) {
        const completedCount = lessons.filter(l => l.isCompleted).length;
        const progress = Math.round((completedCount / lessons.length) * 100);
        this.courseService.updateProgress(enrollment.id, progress, completedCount);
      }
    }
  }

  getLessonIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'video': '🎥',
      'pdf': '📄',
      'quiz': '✍️',
      'assignment': '📝'
    };
    return icons[type] || '📚';
  }
}
