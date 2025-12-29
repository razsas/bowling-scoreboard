import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Frame, Game, RollInput, RollResult } from '../models/game.models';
import { environment } from '../../environments/environments';
import { GAME_CONSTANTS, ERROR_MESSAGES } from '../constants/game.constants';
import { BowlingGameLogic } from '../utils/bowling-game.logic';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly http = inject(HttpClient);

  // --- State ---
  private readonly _currentGame = signal<Game | null>(null);
  private readonly _currentFrameRolls = signal<number[]>([]);

  // --- Selectors ---
  public readonly currentGame = this._currentGame.asReadonly();
  public readonly currentFrameRolls = this._currentFrameRolls.asReadonly();
  public readonly playerName = computed(() => this.currentGame()?.name ?? '');
  public readonly frames = computed(() => this.currentGame()?.frames ?? []);

  // --- Public API ---
  startNewGame(name: string): Observable<Game> {
    return this.http.get<Game>(`${environment.apiUrl}/start/${name}`).pipe(
      map((game) => {
        this.updateGameState(game);
        return game;
      }),
      catchError((err) =>
        throwError(() => new Error(`Failed to start: ${err.message}`))
      )
    );
  }

  loadGame(gameId: number): Observable<Game> {
    return this.http.get<Game>(`${environment.apiUrl}/${gameId}`).pipe(
      map((game) => {
        this.updateGameState(game);
        return game;
      }),
      catchError((err) =>
        throwError(() => new Error(`Failed to load game: ${err.message}`))
      )
    );
  }

  processRoll(pins: number): Observable<RollResult> {
    const game = this.currentGame();
    const isLastFrame =
      this.frames().length === GAME_CONSTANTS.LAST_FRAME_INDEX;

    // 1. Validation
    const validationError = BowlingGameLogic.validateRoll(game, pins);
    if (validationError) return validationError;

    // 2. State Update (Optimistic)
    this._currentFrameRolls.update((prev) => [...prev, pins]);
    const updatedRolls = this.currentFrameRolls();

    // 3. Check Completion
    if (!BowlingGameLogic.isFrameComplete(isLastFrame, updatedRolls)) {
      return of({ isSuccess: true, state: game! });
    }

    // 4. Final Frame Validation & Submission
    const frameError = BowlingGameLogic.validateFrame(
      isLastFrame,
      updatedRolls
    );
    if (frameError) {
      this.resetTurn();
      return frameError;
    }

    return this.submitTurn(game!.id, updatedRolls);
  }

  private submitTurn(gameId: number, rolls: number[]): Observable<RollResult> {
    const payload = this.mapToRollInput(gameId, rolls);

    return this.http
      .post<RollResult>(`${environment.apiUrl}/turn`, payload)
      .pipe(
        map((res) => {
          if (res.isSuccess && res.state) this.updateGameState(res.state);
          else this.resetTurn();
          return res;
        }),
        catchError((err) => {
          this.resetTurn();
          return of({
            isSuccess: false,
            errorMessage:
              err.error?.message ?? ERROR_MESSAGES.FAILED_BOWLING_SERVICE,
          });
        })
      );
  }

  // --- Private Helpers ---
  private updateGameState(game: Game): Game {
    this._currentGame.set(this.reconcileGame(game));
    this.resetTurn();
    return game;
  }

  private resetTurn(): void {
    this._currentFrameRolls.set([]);
  }

  private mapToRollInput(gameId: number, rolls: number[]): RollInput {
    return {
      gameId,
      roll1: rolls[0],
      roll2: rolls.length > 1 ? rolls[1] : null,
      roll3: rolls.length > 2 ? rolls[2] : null,
    };
  }

  private reconcileGame(newGame: Game): Game {
    const oldGame = this._currentGame();
    if (!oldGame || oldGame.id !== newGame.id) {
      return newGame;
    }

    const newFrames = newGame.frames.map((newFrame, index) => {
      const oldFrame = oldGame.frames[index];
      if (oldFrame && this.areFramesEqual(oldFrame, newFrame)) return oldFrame;
      return newFrame;
    });

    return { ...newGame, frames: newFrames };
  }

  private areFramesEqual(f1: Frame, f2: Frame): boolean {
    return (
      f1.score === f2.score &&
      f1.roll1 === f2.roll1 &&
      f1.roll2 === f2.roll2 &&
      f1.roll3 === f2.roll3
    );
  }
}
