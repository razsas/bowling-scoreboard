import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { username, password } = this.loginForm.getRawValue();

    this.userService
      .login({
        username: username ?? '',
        password: password ?? '',
      })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.isSuccess) {
            this.router.navigate(['/']); // Redirect to home/start screen
          } else {
            this.errorMessage.set(response.message || 'Invalid credentials');
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.errorMessage.set('An unexpected error occurred.');
        },
      });
  }
}
