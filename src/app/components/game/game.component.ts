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
import { ReactiveFormsModule } from '@angular/forms';
import { ScoreboardDisplayComponent } from '../scoreboard-display/scoreboard-display.component';
import { RollInputComponent } from '../roll-input/roll-input.component';
import { Frame } from '../../models/game.models';

@Component({
  selector: 'app-game',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ScoreboardDisplayComponent,
    RollInputComponent,
  ],
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

  getRollDisplay = (
    frame: Frame,
    throwNumber: 'roll1' | 'roll2' | 'roll3',
    index: number
  ): string => {
    let val = frame[throwNumber];
    if (val === null || val === undefined) return '';
    if (frame.isStrike && throwNumber === 'roll1') return 'X';
    if (val === 10 && throwNumber === 'roll3') return 'X';
    if (val === 10 && index === 9 && throwNumber === 'roll2') return 'X';
    if (frame.isSpare && throwNumber === 'roll2') return '/';
    return val.toString();
  };

  handleClearError(): void {
    this.errorMessage.set('');
  }
}
