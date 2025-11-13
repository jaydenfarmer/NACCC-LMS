// ...existing code...
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <app-header></app-header>
    <div class="app-layout">
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        --sidebar-width: 260px; /* adjust to match SidebarComponent */
        --header-height: 64px; /* header height used across layout */
        display: block;
      }

      .app-layout {
        min-height: 100vh;
        background: #f7fafc;
      }

      /* Main content is pushed right of the sidebar and below the fixed header */
      .main-content {
        margin-left: var(--sidebar-width);
        min-height: calc(100vh - var(--header-height));
        display: flex;
        flex-direction: column;
      }

      .page-body {
        padding: 24px;
        box-sizing: border-box;
        flex: 1 1 auto;
        overflow: auto;
      }

      /* Responsive: sidebar overlays on small screens */
      @media (max-width: 920px) {
        .app-sidebar {
          transform: translateX(-100%);
          transition: transform 180ms ease;
          top: var(--header-height);
          height: calc(100vh - var(--header-height));
        }

        /* when toggled open, add 'sidebar-open' to <html> or <body> */
        .sidebar-open .app-sidebar {
          transform: translateX(0);
        }

        .main-content {
          margin-left: 0;
        }
      }
    `,
  ],
})
export class LayoutComponent {}
