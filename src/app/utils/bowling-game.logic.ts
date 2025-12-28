import { GAME_CONSTANTS, ERROR_MESSAGES } from '../constants/game.constants';
import { Game, RollResult } from '../models/game.models';
import { Observable, throwError } from 'rxjs';

export class BowlingGameLogic {
  static validateRoll(
    currentGame: Game | null,
    pins: number
  ): Observable<RollResult> | null {
    if (!currentGame) {
      return throwError(() => new Error(ERROR_MESSAGES.NO_ACTIVE_GAME));
    }
    if (currentGame.isGameOver) {
      return throwError(() => new Error(ERROR_MESSAGES.GAME_COMPLETE));
    }
    if (pins < GAME_CONSTANTS.MIN_PINS || pins > GAME_CONSTANTS.MAX_PINS) {
      return throwError(
        () =>
          new Error(
            ERROR_MESSAGES.INVALID_PIN_COUNT(
              GAME_CONSTANTS.MIN_PINS,
              GAME_CONSTANTS.MAX_PINS
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
      roll1 !== GAME_CONSTANTS.MAX_PINS &&
      currentRolls.length === GAME_CONSTANTS.ROLLS_PER_REGULAR_FRAME
    ) {
      const sum = (roll1 || 0) + (roll2 || 0);
      if (sum > GAME_CONSTANTS.MAX_PINS) {
        return throwError(
          () =>
            new Error(
              ERROR_MESSAGES.INVALID_FRAME_SUM(
                roll1,
                roll2,
                sum,
                GAME_CONSTANTS.MAX_PINS
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
    const isStrike = rolls[0] === GAME_CONSTANTS.MAX_PINS;

    if (!isLastFrame) {
      return isStrike || rolls.length >= GAME_CONSTANTS.ROLLS_PER_REGULAR_FRAME;
    } else {
      if (rolls.length < GAME_CONSTANTS.ROLLS_PER_REGULAR_FRAME) {
        return false;
      }
      const isSpare = rolls[0] + rolls[1] === GAME_CONSTANTS.MAX_PINS;

      return isStrike || isSpare
        ? rolls.length >= GAME_CONSTANTS.MAX_ROLLS_LAST_FRAME
        : rolls.length >= GAME_CONSTANTS.ROLLS_PER_REGULAR_FRAME;
    }
  }
}
