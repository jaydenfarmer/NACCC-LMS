import { Component, computed, OnInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CourseService } from '../../shared/services/course.service';
import { CertificateService } from '../../shared/services/certificate.service';
import { AnnouncementService } from '../../shared/services/announcement.service';
import { AnnouncementBannerComponent } from '../../shared/components/announcement-banner/announcement-banner.component';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { WidgetConfig } from '../../shared/models/dashboard.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AnnouncementBannerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private certificateService = inject(CertificateService);
  private announcementService = inject(AnnouncementService);

  @ViewChild('portalActivityChart') portalActivityChartRef?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  readonly announcement = this.announcementService.activeAnnouncement;

  ngOnInit() {
    // Initialize chart after view is ready
    setTimeout(() => {
      if (this.shouldShowChart() && this.portalActivityChartRef) {
        this.initializeChart();
      }
    }, 100);
  }

  get user() {
    return this.authService.user;
  }

  shouldShowChart(): boolean {
    const role = this.user()?.role;
    return role === 'admin' || role === 'instructor';
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
    const total = enrollments.length;
    const completed = enrollments.filter(e => e.status === 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const passedTests = 0;
    const completedAssignments = 0;

    return {
      completedCourses: completed,
      passedTests,
      completedAssignments,
      completionRate
    };
  });

  recentCourses = computed(() => {
    return this.userCourses().slice(0, 3);
  });

  whatsNext = computed(() => {
    const enrollments = this.userEnrollments();
    if (enrollments.length === 0) return { state: 'none' as const };

    const active = enrollments.find(
      e => e.status === 'in_progress' || e.status === 'enrolled'
    );
    if (!active) return { state: 'all_done' as const };

    const course = this.courseService.getCourseById(active.courseId);
    if (!course) return { state: 'all_done' as const };

    return {
      state: 'active' as const,
      course,
      enrollment: active
    };
  });

  getEnrollmentForCourse(courseId: string) {
    const currentUser = this.user();
    if (!currentUser) return null;
    return this.courseService.getEnrollment(currentUser.id, courseId);
  }

  readonly todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  expiringCertificates = computed(() => {
    const user = this.user();
    if (!user) return [];
    const now = new Date();
    const cutoff = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    return this.certificateService.getUserCertificates(user.id).filter(
      c => c.expiresAt && c.expiresAt > now && c.expiresAt <= cutoff
    );
  });

  // Widget config drives layout order and visibility. Drag-and-drop reordering coming in Phase 1B.
  readonly widgetConfigs: WidgetConfig[] = [
    { id: 'whats-next',      type: 'whats-next',      order: 0, visible: true, column: 'full',    roles: ['learner'] },
    { id: 'stats',           type: 'stats',           order: 1, visible: true, column: 'main',    roles: ['learner'] },
    { id: 'recent-courses',  type: 'recent-courses',  order: 2, visible: true, column: 'main',    roles: ['learner'] },
    { id: 'today',           type: 'today',           order: 3, visible: true, column: 'sidebar', roles: ['learner'] },
    { id: 'dont-miss',       type: 'dont-miss',       order: 4, visible: true, column: 'sidebar', roles: ['learner'] },
    { id: 'portal-activity', type: 'portal-activity', order: 0, visible: true, column: 'grid',    roles: ['admin', 'instructor'] },
    { id: 'quick-actions',   type: 'quick-actions',   order: 1, visible: true, column: 'grid',    roles: ['admin', 'instructor'] },
    { id: 'overview-stats',  type: 'overview-stats',  order: 2, visible: true, column: 'full',    roles: ['admin'] },
  ];

  private widgetsForRole = computed((): WidgetConfig[] => {
    const role = this.user()?.role;
    if (!role) return [];
    return this.widgetConfigs
      .filter(w => w.visible && w.roles.includes(role))
      .sort((a, b) => a.order - b.order);
  });

  fullWidgets    = computed(() => this.widgetsForRole().filter(w => w.column === 'full'));
  mainWidgets    = computed(() => this.widgetsForRole().filter(w => w.column === 'main'));
  sidebarWidgets = computed(() => this.widgetsForRole().filter(w => w.column === 'sidebar'));
  gridWidgets    = computed(() => this.widgetsForRole().filter(w => w.column === 'grid'));

  daysUntil(date: Date): number {
    return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }

  getCourseProgress(courseId: string): number {
    const course = this.courseService.getCourseById(courseId);
    if (!course) return 0;
    const countable = course.lessons.filter(l => l.type !== 'section');
    if (countable.length === 0) return 0;
    const completed = countable.filter(l => l.isCompleted).length;
    return Math.round((completed / countable.length) * 100);
  }

  getContinueLabel(status: string): string {
    if (status === 'completed') return 'View Course';
    if (status === 'in_progress') return 'Continue';
    return 'Start';
  }

  formatExpiryDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Portal activity data (mock data for demo)
  portalActivityData = {
    labels: ['Tuesday\nNovember 11', 'Friday\nNovember 14', 'Monday\nNovember 17'],
    logins: [60, 65, 52],
    completions: [5, 3, 4]
  };

  private initializeChart() {
    const canvas = this.portalActivityChartRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.portalActivityData.labels,
        datasets: [
          {
            label: 'Logins',
            data: this.portalActivityData.logins,
            backgroundColor: '#3b82f6',
            borderRadius: 6,
            barThickness: 40,
          },
          {
            label: 'Course completions',
            data: this.portalActivityData.completions,
            backgroundColor: '#10b981',
            borderRadius: 6,
            barThickness: 40,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 6,
            titleFont: {
              size: 13
            },
            bodyFont: {
              size: 12
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                size: 11
              },
              stepSize: 20
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
