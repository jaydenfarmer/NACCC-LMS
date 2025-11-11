import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  searchTerm = signal('');
  selectedCategory = signal('all');
  selectedDifficulty = signal('all');

  categories = ['all', 'Fundamentals', 'Advanced', 'Professional Development', 'Compliance', 'Soft Skills', 'Technical Skills'];
  difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  filteredCourses = signal<Course[]>([]);

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {
    this.filterCourses();
  }

  get courses() {
    return this.courseService.allCourses;
  }

  filterCourses(): void {
    let result = this.courses();

    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(c =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.tags.some(t => t.toLowerCase().includes(search))
      );
    }

    if (this.selectedCategory() !== 'all') {
      result = result.filter(c => c.category === this.selectedCategory());
    }

    if (this.selectedDifficulty() !== 'all') {
      result = result.filter(c => c.difficulty === this.selectedDifficulty());
    }

    this.filteredCourses.set(result);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.filterCourses();
  }

  onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
    this.filterCourses();
  }

  onDifficultyChange(value: string): void {
    this.selectedDifficulty.set(value);
    this.filterCourses();
  }

  isEnrolled(courseId: string): boolean {
    const user = this.authService.user();
    if (!user) return false;
    return !!this.courseService.getEnrollment(user.id, courseId);
  }

  enroll(courseId: string): void {
    const user = this.authService.user();
    if (user) {
      this.courseService.enrollCourse(user.id, courseId);
    }
  }

  getDifficultyBadgeClass(difficulty: string): string {
    const classes: { [key: string]: string } = {
      'beginner': 'badge-green',
      'intermediate': 'badge-yellow',
      'advanced': 'badge-red'
    };
    return classes[difficulty] || 'badge-gray';
  }
}
