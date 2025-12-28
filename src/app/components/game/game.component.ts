import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { ScoreboardDisplayComponent } from '../scoreboard-display/scoreboard-display.component';
import { RollInputComponent } from '../roll-input/roll-input.component';
import { ERROR_MESSAGES } from '../../constants/game.constants';

@Component({
  selector: 'app-game',
  imports: [ScoreboardDisplayComponent, RollInputComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  readonly errorMessage = signal<string>('');
  readonly isLoading = signal<boolean>(false);

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
      next: () => this.isLoading.set(false),
      error: (err) => {
        this.errorMessage.set(err.message || ERROR_MESSAGES.FAILED_TO_ROLL);
        this.isLoading.set(false);
      },
    });
  }

  navigateToHighscores = () => this.router.navigate(['/highscores']);
  handleClearError = () => this.errorMessage.set('');
}