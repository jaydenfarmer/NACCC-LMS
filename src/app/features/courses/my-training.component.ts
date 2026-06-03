import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../shared/services/course.service';
import { AuthService } from '../../shared/services/auth.service';
import { Course, Enrollment } from '../../shared/models/course.model';

type StatusFilter = 'all' | 'enrolled' | 'in_progress' | 'completed' | 'expired' | 'not_passed';

interface EnrolledCourse {
  course: Course;
  enrollment: Enrollment;
  progress: number;
}

@Component({
  selector: 'app-my-training',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-training.component.html',
  styleUrl: './my-training.component.css'
})
export class MyTrainingComponent {
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  statusFilter = signal<StatusFilter>('all');
  sortByDate = signal(false);

  hasAnyEnrollments = computed(() => {
    const user = this.authService.user();
    if (!user) return false;
    return this.courseService.getUserEnrollments(user.id).length > 0;
  });

  filteredCourses = computed((): EnrolledCourse[] => {
    const user = this.authService.user();
    if (!user) return [];

    const enrollments = this.courseService.getUserEnrollments(user.id);
    const allCourses = this.courseService.getCourses();

    let result: EnrolledCourse[] = enrollments
      .map(enrollment => {
        const course = allCourses.find(c => c.id === enrollment.courseId);
        if (!course) return null;
        const contentLessons = course.lessons.filter(l => l.type !== 'section');
        const completedCount = contentLessons.filter(l => l.isCompleted).length;
        const progress = contentLessons.length > 0
          ? Math.round((completedCount / contentLessons.length) * 100)
          : 0;
        return { course, enrollment, progress };
      })
      .filter((x): x is EnrolledCourse => x !== null);

    const status = this.statusFilter();
    if (status !== 'all') {
      result = result.filter(item => item.enrollment.status === status);
    }

    if (this.sortByDate()) {
      result = [...result].sort((a, b) =>
        new Date(b.enrollment.enrollment_date).getTime() -
        new Date(a.enrollment.enrollment_date).getTime()
      );
    }

    return result;
  });

  setStatusFilter(value: StatusFilter): void {
    this.statusFilter.set(value);
  }

  toggleSortByDate(): void {
    this.sortByDate.update(v => !v);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      enrolled: 'Enrolled',
      in_progress: 'In Progress',
      completed: 'Completed',
      expired: 'Expired',
      not_passed: 'Not Passed'
    };
    return labels[status] ?? status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      enrolled: 'status-enrolled',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      expired: 'status-expired',
      not_passed: 'status-not-passed'
    };
    return classes[status] ?? '';
  }
}
