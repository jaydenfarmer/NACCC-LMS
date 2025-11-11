import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private courseService: CourseService
  ) {}

  get user() {
    return this.authService.user;
  }

  userCourses = computed(() => {
    const currentUser = this.user();
    if (!currentUser) return [];
    return this.courseService.getUserCourses(currentUser.id);
  });

  userEnrollments = computed(() => {
    const currentUser = this.user();
    if (!currentUser) return [];
    return this.courseService.getUserEnrollments(currentUser.id);
  });

  stats = computed(() => {
    const enrollments = this.userEnrollments();
    const completed = enrollments.filter(e => e.status === 'completed').length;
    const inProgress = enrollments.filter(e => e.status === 'in-progress').length;
    const avgProgress = enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
      : 0;

    return {
      totalCourses: enrollments.length,
      completed,
      inProgress,
      avgProgress: Math.round(avgProgress)
    };
  });

  recentCourses = computed(() => {
    return this.userCourses().slice(0, 3);
  });

  getEnrollmentForCourse(courseId: string) {
    const currentUser = this.user();
    if (!currentUser) return null;
    return this.courseService.getEnrollment(currentUser.id, courseId);
  }
}
