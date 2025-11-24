import { Component, computed, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { AnnouncementBannerComponent, Announcement } from '../../shared/components/announcement-banner/announcement-banner.component';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AnnouncementBannerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild('portalActivityChart') portalActivityChartRef?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  announcement = signal<Announcement>({
    id: '1',
    message: 'Join us for our monthly Instructor Chat on November 17th at 5PM EST! Current students can join directly through their course or by using this link:',
    link: 'https://us06web.zoom.us/j/86162263892',
    linkText: 'https://us06web.zoom.us/j/86162263892',
    type: 'info',
    dismissible: true
  });

  constructor(
    private authService: AuthService,
    private courseService: CourseService
  ) {}

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
