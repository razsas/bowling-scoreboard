import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { ScoreboardDisplayComponent } from '../scoreboard-display/scoreboard-display.component';
import { RollInputComponent } from '../roll-input/roll-input.component';

@Component({
  selector: 'app-game',
  imports: [CommonModule, ScoreboardDisplayComponent, RollInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  readonly playerName = this.gameService.playerName;
  readonly frames = this.gameService.frames;
  readonly currentFrameRolls = this.gameService.currentFrameRolls;

  readonly isGameComplete = computed(() => {
    return this.gameService.currentGame()?.isGameOver || false;
  });
  readonly totalScore = computed(() => {
    return this.frames().reduce((acc, frame) => acc + frame.score, 0);
  });

  handleRoll(pins: number): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.gameService.processRoll(pins).subscribe({
      next: (_) => {
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.message || 'Failed to add throw. Please try again.'
        );
        this.isLoading.set(false);
        console.error('Error adding throw:', error);
      },
    });
  }

  navigateToHighscores(): void {
    this.router.navigate(['/highscores']);
  }

  handleClearError(): void {
    this.errorMessage.set('');
  }
}
