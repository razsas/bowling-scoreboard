import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HighscoreEntry } from '../models/game.models';
import { catchError, of, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environments';
import { ERROR_MESSAGES } from '../constants/game.constants';

@Injectable()
export class HighscoreService {
  private readonly http = inject(HttpClient);

  private readonly _highscores = signal<HighscoreEntry[]>([]);
  readonly scores = computed(() => this._highscores());
  
  private readonly _currentError = signal<string | null>(null);
  readonly currentError = computed(() => this._currentError());

  constructor() {
    this.loadHighscores().subscribe();
  }

  public loadHighscores(): Observable<HighscoreEntry[]> {
    this._currentError.set(null);

    return this.getScores().pipe(
      tap((scores) => this._highscores.set(scores)),
      catchError((error) => {
        this._currentError.set(ERROR_MESSAGES.FAILED_LOAD_HIGHSCORES);
        return of([]);
      })
    );
  }

  getScores(): Observable<HighscoreEntry[]> {
    return this.http.get<HighscoreEntry[]>(`${environment.apiUrl}/highscores`);
  }
}
