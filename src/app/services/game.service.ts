import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Game, RollInput, RollResult } from '../models/game.models';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly http = inject(HttpClient);

  private _currentGame = signal<Game | null>(null);
  private _currentFrameRolls = signal<number[]>([]);

  public readonly currentGame = computed(() => this._currentGame());
  public readonly playerName = computed(() => this.currentGame()?.name || '');
  public readonly frames = computed(() => this.currentGame()?.frames || []);
  public readonly currentFrameRolls = computed(() => this._currentFrameRolls());

  private setCurrentGame(game: Game): void {
    this._currentGame.set(game);
  }

  private recordRoll(pins: number): void {
    this._currentFrameRolls.set([...this.currentFrameRolls(), pins]);
  }

  private resetCurrentRolls(): void {
    this._currentFrameRolls.set([]);
  }

  startNewGame(name: string): Observable<Game> {
    return this.sendStartGameApiRequest(name).pipe(
      map((game) => {
        this.setCurrentGame(game);
        this.resetCurrentRolls();
        return game;
      }),
      catchError((error) =>
        throwError(() => `Error starting new game :${error}`)
      )
    );
  }

  processRoll(pins: number): Observable<RollResult> {
    const currentGame = this.currentGame();
    let error;
    const isLastFrame = (this.currentGame()?.frames.length || 0) === 9;

    error = this.rollValidations(currentGame, pins);
    if (error) {
      return error;
    }

    this.recordRoll(pins);

    const isFrameComplete = this.isFrameComplete(
      isLastFrame,
      this.currentFrameRolls()
    );
    if (!isFrameComplete) {
      return of({ isSuccess: true, state: currentGame! });
    }

    error = this.validateFrame(isLastFrame, this.currentFrameRolls());
    if (error) {
      this.resetCurrentRolls();
      return error;
    }

    const rollInput = this.createRollInput(
      currentGame!.id,
      this.currentFrameRolls()
    );
    return this.postRoll(rollInput);
  }

  private rollValidations(
    currentGame: Game | null,
    pins: number
  ): Observable<RollResult> | null {
    if (!currentGame) {
      return throwError(
        () => new Error('No active game. Please start a new game first.')
      );
    }
    if (currentGame.isGameOver) {
      return throwError(() => new Error('Game is already complete.'));
    }
    if (pins < 0 || pins > 10) {
      return throwError(() => new Error(`Pins must be between 0 and ${10}.`));
    }
    return null;
  }

  private validateFrame(
    isLastFrame: boolean,
    currentRolls: number[]
  ): Observable<RollResult> | null {
    const [roll1, roll2] = currentRolls;

    if (!isLastFrame && roll1 !== 10 && currentRolls.length === 2) {
      const sum = (roll1 || 0) + (roll2 || 0);
      if (sum > 10) {
        return throwError(
          () => new Error(`Invalid frame: ${roll1} + ${roll2} = ${sum} > ${10}`)
        );
      }
    }
    return null;
  }

  private isFrameComplete(isLastFrame: boolean, rolls: number[]): boolean {
    if (rolls.length === 0) {
      return false;
    }
    const isStrike = rolls[0] === 10;

    if (!isLastFrame) {
      return isStrike || rolls.length >= 2;
    } else {
      if (rolls.length < 2) {
        return false;
      }
      const isSpare = rolls[0] + rolls[1] === 10;

      return isStrike || isSpare ? rolls.length >= 3 : rolls.length >= 2;
    }
  }

  private createRollInput(gameId: number, rolls: number[]): RollInput {
    return {
      gameId: gameId,
      roll1: rolls[0],
      roll2: rolls.length > 1 ? rolls[1] : null,
      roll3: rolls.length > 2 ? rolls[2] : null,
    };
  }

  private sendStartGameApiRequest(name: string): Observable<Game> {
    return this.http.post<Game>(
      `${environment.apiUrl}/start`,
      { gameName: name },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  private postRoll(rollInput: RollInput): Observable<RollResult> {
    return this.http
      .post<RollResult>(`${environment.apiUrl}/turn`, rollInput)
      .pipe(
        map((result) => {
          if (result.isSuccess && result.state) {
            this.setCurrentGame(result.state);
            this.resetCurrentRolls();
          } else {
            this.resetCurrentRolls();
          }
          return result;
        }),
        catchError((error) => {
          this.resetCurrentRolls();
          return of({
            isSuccess: false,
            errorMessage:
              error.error?.message ||
              error.message ||
              'Failed to communicate with bowling service.',
          });
        })
      );
  }
}
