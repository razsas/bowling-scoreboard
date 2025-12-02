import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Frame, RollNumber } from '../../models/game.models';
import { GAME_CONSTANTS } from '../../constants/game.constants';
import { RollDisplayUtil } from '../../utils/roll-display.util';

@Component({
  selector: 'app-scoreboard-display-component',
  imports: [CommonModule],
  templateUrl: './scoreboard-display.component.html',
  styleUrl: './scoreboard-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreboardDisplayComponent {
  @Input({ required: true }) frames!: Frame[];
  @Input({ required: true }) currentFrameRolls!: number[];

  public readonly frameIndices: number[] = Array.from(
    { length: GAME_CONSTANTS.MAX_FRAMES },
    (_, i) => i
  );

  getLiveRollDisplay(
    frame: Frame | undefined,
    throwNumber: 1 | 2 | 3,
    frameIndex: number
  ): string {
    if (frame) {
      return this.getRollDisplay(frame, `roll${throwNumber}` as RollNumber, frameIndex);
    }
    if (frameIndex === this.frames.length) {
      const rollIndex = throwNumber - 1;
      if (this.currentFrameRolls.length > rollIndex) {
        const rollValue = this.currentFrameRolls[rollIndex];
        const isTenthFrame = frameIndex === GAME_CONSTANTS.LAST_FRAME_INDEX;
        const isSpare =
          this.currentFrameRolls.length === GAME_CONSTANTS.ROLLS_PER_REGULAR_FRAME &&
          this.currentFrameRolls[0] + this.currentFrameRolls[1] === GAME_CONSTANTS.MAX_PINS;
        const isSecondThrow = throwNumber === GAME_CONSTANTS.ROLLS_PER_REGULAR_FRAME;
        
        if (isSpare && isTenthFrame && isSecondThrow) {
          return '/';
        }
        if (rollValue === GAME_CONSTANTS.MAX_PINS) {
          return 'X';
        }
        return rollValue.toString();
      }
    }
    return '';
  }

  getRollDisplay = (
    frame: Frame,
    rollNumber: RollNumber,
    frameIndex: number
  ): string => {
    return RollDisplayUtil.getRollDisplay(frame, rollNumber, frameIndex);
  };

  calculateCumulativesScore(currentIndex: number): number {
    return this.frames
      .slice(0, currentIndex + 1)
      .reduce((total, frame) => total + frame.score, 0);
  }
}
