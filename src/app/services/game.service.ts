import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Game, RollInput, RollResult } from '../models/game.models';
import { environment } from '../../environments/environments';
import { GAME_CONSTANTS, ERROR_MESSAGES } from '../constants/game.constants';
import { BowlingGameLogic } from '../utils/bowling-game.logic';

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
        throwError(() => new Error(`Error starting new game: ${error}`))
      )
    );
  }

  processRoll(pins: number): Observable<RollResult> {
    const currentGame = this.currentGame();
    let error;
    const isLastFrame = (this.currentGame()?.frames.length || 0) === GAME_CONSTANTS.LAST_FRAME_INDEX;

    error = BowlingGameLogic.validateRoll(currentGame, pins);
    if (error) {
      return error;
    }

    this.recordRoll(pins);

    const isFrameComplete = BowlingGameLogic.isFrameComplete(
      isLastFrame,
      this.currentFrameRolls()
    );
    if (!isFrameComplete) {
      return of({ isSuccess: true, state: currentGame! });
    }

    error = BowlingGameLogic.validateFrame(isLastFrame, this.currentFrameRolls());
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
              ERROR_MESSAGES.FAILED_BOWLING_SERVICE,
          });
        })
      );
  }
}
