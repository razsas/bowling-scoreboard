import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.scss', // Reusing or separate? I'll make a separate one but it will be similar.
})
export class SubscribeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly subscribeForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.subscribeForm.invalid) {
      this.subscribeForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { username, password } = this.subscribeForm.getRawValue();

    this.userService
      .register({
        username: username ?? '',
        password: password ?? '',
      })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.isSuccess) {
            this.router.navigate(['/']); // Redirect to home/start screen
          } else {
            this.errorMessage.set(response.message || 'Registration failed');
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.errorMessage.set('An unexpected error occurred.');
        },
      });
  }
}
