import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HighscoreService } from '../../services/highscore.service';

@Component({
  selector: 'app-highscores',
  imports: [CommonModule],
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

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  }

  playAgain(): void {
    this.router.navigate(['/']);
  }
}
