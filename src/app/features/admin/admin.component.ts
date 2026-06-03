import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../shared/services/course.service';
import { AuthService } from '../../shared/services/auth.service';
import { Course } from '../../shared/models/course.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  activeTab = signal<'overview' | 'courses' | 'users'>('overview');
  
  showCourseForm = signal(false);
  editingCourse = signal<Course | null>(null);

  categories = ['Fundamentals', 'Advanced', 'Professional Development', 'Compliance', 'Soft Skills', 'Technical Skills'];

  // Form fields
  courseForm = signal({
    title: '',
    description: '',
    category: 'Fundamentals',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: 0,
    totalLessons: 0,
    thumbnail_url: '',
    tags: ''
  });


  get courses() {
    return this.courseService.allCourses;
  }
  
  stats = computed(() => this.courseService.getAdminStats());

  setTab(tab: 'overview' | 'courses' | 'users'): void {
    this.activeTab.set(tab);
  }

  openCourseForm(course?: Course): void {
    if (course) {
      this.editingCourse.set(course);
      this.courseForm.set({
        title: course.title,
        description: course.description,
        category: course.category ?? '',
        difficulty: course.difficulty ?? 'beginner',
        duration: course.duration ?? 0,
        totalLessons: course.totalLessons ?? 0,
        thumbnail_url: course.thumbnail_url ?? '',
        tags: (course.tags ?? []).join(', ')
      });
    } else {
      this.editingCourse.set(null);
      this.courseForm.set({
        title: '',
        description: '',
        category: 'Fundamentals',
        difficulty: 'beginner',
        duration: 0,
        totalLessons: 0,
        thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
        tags: ''
      });
    }
    this.showCourseForm.set(true);
  }

  closeCourseForm(): void {
    this.showCourseForm.set(false);
    this.editingCourse.set(null);
  }

  saveCourse(): void {
    const form = this.courseForm();
    const editingCourse = this.editingCourse();

    if (editingCourse) {
      // Update existing course
      this.courseService.updateCourse(editingCourse.id, {
        title: form.title,
        description: form.description,
        category: form.category,
        difficulty: form.difficulty,
        duration: form.duration,
        totalLessons: form.totalLessons,
        thumbnail_url: form.thumbnail_url,
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t)
      });
    } else {
      // Create new course
      const currentUser = this.authService.user();
      this.courseService.addCourse({
        title: form.title,
        description: form.description,
        category: form.category,
        difficulty: form.difficulty,
        duration: form.duration,
        totalLessons: form.totalLessons,
        thumbnail_url: form.thumbnail_url,
        instructor: currentUser
          ? {
              id: currentUser.id,
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              avatar: currentUser.profile_photo_url ?? ''
            }
          : { id: '', name: '', avatar: '' },
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
        lessons: []
      });
    }

    this.closeCourseForm();
  }

  deleteCourse(courseId: string): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId);
    }
  }

  updateFormField<K extends keyof ReturnType<typeof this.courseForm>>(
    field: K,
    value: ReturnType<typeof this.courseForm>[K]
  ): void {
    this.courseForm.update(form => ({ ...form, [field]: value }));
  }
}
