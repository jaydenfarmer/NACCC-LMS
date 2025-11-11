import { Component, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  returnUrl = signal('/dashboard');

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl.set(this.route.snapshot.queryParams['returnUrl'] || '/dashboard');
  }

  onSubmit(): void {
    this.errorMessage.set('');
    
    if (this.authService.login(this.email(), this.password())) {
      this.router.navigate([this.returnUrl()]);
    } else {
      this.errorMessage.set('Invalid email or password');
    }
  }

  setDemoUser(email: string, password: string): void {
    this.email.set(email);
    this.password.set(password);
  }
}
