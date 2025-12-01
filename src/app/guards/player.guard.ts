import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../services/game.service';

export const playerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const gameService = inject(GameService);

  if (!gameService.playerName()) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
