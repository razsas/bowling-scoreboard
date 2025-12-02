import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-start-screen',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  private readonly fb = inject(FormBuilder);
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  playerForm: FormGroup;
  readonly errorMessage = signal<string>('');
  readonly isLoading = signal<boolean>(false);

  constructor() {
    this.playerForm = this.fb.group({
      playerName: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    const playerName = this.playerForm.get('playerName')?.value?.trim() ?? '';
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.gameService
      .startNewGame(playerName)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/scoreboard']),
        error: (error) => {
          this.errorMessage.set('Failed to start game. Please try again.');
        },
      });
  }

  get playerNameControl() {
    return this.playerForm.get('playerName');
  }
}
