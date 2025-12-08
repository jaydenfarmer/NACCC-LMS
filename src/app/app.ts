

import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService, SidebarFlyoutState } from './core/services/sidebar.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('credit-counseling-lms');

  flyoutState: SidebarFlyoutState = { open: false, item: null, position: { top: 0, left: 0 } };

  constructor(public sidebarService: SidebarService) {
    this.sidebarService.flyout$.subscribe(state => {
      this.flyoutState = state;
    });
  }

  // Called from overlay or sidebar mouseleave
  closeFlyout() {
    setTimeout(() => {
      if (!this.sidebarService.flyoutHover) {
        this.sidebarService.closeFlyout();
      }
    }, 80);
  }

  setSidebarHover(val: boolean) {
    this.sidebarService.setFlyoutHover(val);
    if (!val) {
      this.closeFlyout();
    }
  }

  setFlyoutHover(val: boolean) {
    this.sidebarService.setFlyoutHover(val);
    if (!val) {
      this.closeFlyout();
    }
  }

  trackByPath(_: number, item: any) {
    return item.path;
  }
}
