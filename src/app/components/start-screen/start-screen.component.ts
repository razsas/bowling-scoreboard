import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

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

  readonly gameMode = signal<GameMode>(GAME_MODES['New']);
  readonly errorMessage = signal<string>('');
  readonly isLoading = signal<boolean>(false);

  readonly isNewGame = computed(() => this.gameMode() === GAME_MODES['New']);

  readonly subtitleText = computed(() =>
    this.isNewGame()
      ? 'Enter your name to start a new game'
      : 'Enter Game ID to continue'
  );

  readonly placeholderText = computed(() =>
    this.isNewGame() ? 'Enter your name' : 'Enter Game ID'
  );

  readonly submitButtonText = computed(() => {
    if (this.isLoading())
      return this.isNewGame() ? 'Starting...' : 'Loading...';
    return this.isNewGame() ? 'Start Game' : 'Continue Game';
  });

  readonly playerForm = this.fb.group({
    identifier: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)],
    ],
  });

  private readonly formValue = toSignal(this.playerForm.valueChanges, {
    initialValue: { identifier: '' } as Partial<{ identifier: string | null }>,
  });

  readonly validationMessage = computed(() => {
    const ctrl = this.identifierControl;
    this.formValue();
    if (!ctrl || (!ctrl.touched && !ctrl.dirty) || ctrl.valid)
      return this.errorMessage();

    if (ctrl.hasError('required')) {
      return this.isNewGame()
        ? 'Player name is required.'
        : 'Game ID is required.';
    }

    if (ctrl.hasError('pattern')) {
      return this.isNewGame()
        ? 'Letters and numbers only.'
        : 'Game ID must be a number.';
    }
    return this.errorMessage();
  });

  toggleGameMode(toNew: boolean): void {
    let newGamemode = toNew ? GAME_MODES['New'] : GAME_MODES['Continue'];
    this.gameMode.set(newGamemode);
    this.errorMessage.set('');

    const control = this.identifierControl;
    const pattern = toNew ? /^[a-zA-Z0-9 ]+$/ : /^[0-9]+$/;

    control?.setValidators([Validators.required, Validators.pattern(pattern)]);
    control?.updateValueAndValidity();
    control?.reset();
  }

  onSubmit(): void {
    if (this.playerForm.invalid) return;

    const value = this.identifierControl?.value?.trim() ?? '';
    this.isLoading.set(true);
    this.errorMessage.set('');

    const action$ = this.isNewGame()
      ? this.gameService.startNewGame(value)
      : this.gameService.loadGame(Number(value));

    action$.pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: () => this.router.navigate(['/scoreboard']),
      error: (err) =>
        this.errorMessage.set(err.message || 'An error occurred.'),
    });
  }

  onShowHighscores = () => this.router.navigate(['/highscores']);

  get identifierControl() {
    return this.playerForm.get('identifier');
  }
}

export type GameMode = 'New' | 'Continue';

export const GAME_MODES: Record<string, GameMode> = {
  New: 'New',
  Continue: 'Continue',
} as const;
