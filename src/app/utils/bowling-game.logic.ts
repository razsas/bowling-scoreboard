import { GameConstants, ErrorMessages } from '../constants/game.constants';
import { Game, RollResult } from '../models/game.models';
import { Observable, throwError } from 'rxjs';

export class BowlingGameLogic {
  static validateRoll(
    currentGame: Game | null,
    pins: number
  ): Observable<RollResult> | null {
    if (!currentGame) {
      return throwError(() => new Error(ErrorMessages.NoActiveGame));
    }
    if (currentGame.isGameOver) {
      return throwError(() => new Error(ErrorMessages.GameComplete));
    }
    if (pins < GameConstants.MinPins || pins > GameConstants.MaxPins) {
      return throwError(
        () =>
          new Error(
            ErrorMessages.InvalidPinCount(
              GameConstants.MinPins,
              GameConstants.MaxPins
            )
          )
      );
    }
    return null;
  }

  static validateFrame(
    isLastFrame: boolean,
    currentRolls: number[]
  ): Observable<RollResult> | null {
    const [roll1, roll2] = currentRolls;

    if (
      !isLastFrame &&
      roll1 !== GameConstants.MaxPins &&
      currentRolls.length === GameConstants.RollsPerRegularFrame
    ) {
      const sum = (roll1 || 0) + (roll2 || 0);
      if (sum > GameConstants.MaxPins) {
        return throwError(
          () =>
            new Error(
              ErrorMessages.InvalidFrameSum(
                roll1,
                roll2,
                sum,
                GameConstants.MaxPins
              )
            )
        );
      }
    }
    return null;
  }

  static isFrameComplete(isLastFrame: boolean, rolls: number[]): boolean {
    if (rolls.length === 0) {
      return false;
    }
    const isStrike = rolls[0] === GameConstants.MaxPins;

    if (!isLastFrame) {
      return isStrike || rolls.length >= GameConstants.RollsPerRegularFrame;
    } else {
      if (rolls.length < GameConstants.RollsPerRegularFrame) {
        return false;
      }
      const isSpare = rolls[0] + rolls[1] === GameConstants.MaxPins;

      return isStrike || isSpare
        ? rolls.length >= GameConstants.MaxRollsLastFrame
        : rolls.length >= GameConstants.RollsPerRegularFrame;
    }
  }
}
