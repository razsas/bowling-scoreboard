
import { GAME_CONSTANTS } from '../constants/game.constants';
import { Frame, RollNumber } from '../models/game.models';

export class RollDisplayUtil {

  static getRollDisplay(
    frame: Frame,
    rollNumber: RollNumber,
    frameIndex: number
  ): string {
    const val = frame[rollNumber];
    
    if (val === null || val === undefined) {
      return '';
    }

    if (frame.isStrike && rollNumber === 'roll1') {
      return 'X';
    }

    if (val === GAME_CONSTANTS.MAX_PINS && rollNumber === 'roll3') {
      return 'X';
    }

    if (val === GAME_CONSTANTS.MAX_PINS && 
        frameIndex === GAME_CONSTANTS.LAST_FRAME_INDEX && 
        rollNumber === 'roll2') {
      return 'X';
    }

    if (frame.isSpare && rollNumber === 'roll2') {
      return '/';
    }

    return val.toString();
  }
}

