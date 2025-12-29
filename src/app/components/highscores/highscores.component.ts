import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HighscoreService } from '../../services/highscore.service';
import { DateFormatterPipe } from '../../pipes/date-formatter.pipe';

@Component({
  selector: 'app-highscores',
  imports: [CommonModule, DateFormatterPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './highscores.component.html',
  styleUrl: './highscores.component.scss',
  providers: [HighscoreService],
})
export class HighscoresComponent {
  private readonly highscoreService = inject(HighscoreService);
  private readonly router = inject(Router);
  
  readonly currentError = this.highscoreService.currentError;

  get highscores() {
    return this.highscoreService.scores();
  }

  playAgain = () => this.router.navigate(['/']);
}
