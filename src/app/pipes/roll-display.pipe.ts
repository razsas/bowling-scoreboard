import { Pipe, PipeTransform } from '@angular/core';
import { Frame, RollNumber } from '../models/game.models';
import { GAME_CONSTANTS } from '../constants/game.constants';

@Pipe({
  name: 'rollDisplay',
  standalone: true
})
export class RollDisplayPipe implements PipeTransform {
  transform(value: number | null | undefined, frame: Frame | null | undefined, rollNumber: RollNumber): string {
    if (value === null || value === undefined || !frame) {
      return '';
    }

    const isLastFrame = frame.frameIndex === GAME_CONSTANTS.LAST_FRAME_INDEX;

    // Handle Strike
    if (frame.isStrike && rollNumber === 'roll1') {
      return 'X';
    }

    // Handle Last Frame Special Cases
    if (isLastFrame) {
      if (rollNumber === 'roll2' && value === GAME_CONSTANTS.MAX_PINS) {
        return 'X';
      }
      if (rollNumber === 'roll3' && value === GAME_CONSTANTS.MAX_PINS) {
        return 'X';
      }
      if (rollNumber === 'roll2') {
        const r1 = frame.roll1 ?? 0;
        if (r1 !== GAME_CONSTANTS.MAX_PINS && r1 + value === GAME_CONSTANTS.MAX_PINS) {
          return '/';
        }
      }
      if (rollNumber === 'roll3') {
        const r2 = frame.roll2 ?? 0;
        if (r2 !== GAME_CONSTANTS.MAX_PINS && r2 + value === GAME_CONSTANTS.MAX_PINS) {
          return '/';
        }
      }
    }

    // Handle Spare (Regular Frame)
    if (!isLastFrame && rollNumber === 'roll2' && !frame.isStrike) {
      const r1 = frame.roll1 ?? 0;
      if (r1 + value === GAME_CONSTANTS.MAX_PINS) {
        return '/';
      }
    }

    return value.toString();
  }
}
