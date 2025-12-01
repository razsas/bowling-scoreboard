import { Routes } from '@angular/router';
import { playerGuard } from './guards/player.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/start-screen/start-screen.component').then(m => m.StartScreenComponent)
  },
  {
    path: 'scoreboard',
    loadComponent: () => import('./components/game/game.component').then(m => m.GameComponent),
    canActivate: [playerGuard]
  },
  {
    path: 'highscores',
    loadComponent: () => import('./components/highscores/highscores.component').then(m => m.HighscoresComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
