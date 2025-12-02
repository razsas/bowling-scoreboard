import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Frame } from '../../models/game.models';

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
    { length: 10 },
    (_, i) => i
  );

  getLiveRollDisplay(
    frame: Frame | undefined,
    throwNumber: 1 | 2 | 3,
    frameIndex: number
  ): string {
    if (frame) {
      return this.getRollDisplay(frame, `roll${throwNumber}`, frameIndex);
    }
    if (frameIndex === this.frames.length) {
      const rollIndex = throwNumber - 1;
      if (this.currentFrameRolls.length > rollIndex) {
        const rollValue = this.currentFrameRolls[rollIndex];
        const isTenthFrame = frameIndex === 9;
        const isSpare =
          this.currentFrameRolls.length === 2 &&
          this.currentFrameRolls[0] + this.currentFrameRolls[1] === 10;
        const isSecondThrow = throwNumber === 2;
        
        if (isSpare && isTenthFrame && isSecondThrow) {
          return '/';
        }
        if (rollValue === 10) {
          return 'X';
        }
        return rollValue.toString();
      }
    }
    return '';
  }

  getRollDisplay = (
    frame: Frame,
    throwNumber: 'roll1' | 'roll2' | 'roll3',
    index: number
  ): string => {
    let val = frame[throwNumber];
    if (val === null || val === undefined) return '';
    if (frame.isStrike && throwNumber === 'roll1') return 'X';
    if (val === 10 && throwNumber === 'roll3') return 'X';
    if (val === 10 && index === 9 && throwNumber === 'roll2') return 'X';
    if (frame.isSpare && throwNumber === 'roll2') return '/';
    return val.toString();
  };

  calculateCumulativesScore(currentIndex: number): number {
    return this.frames
      .slice(0, currentIndex + 1)
      .reduce((total, frame) => total + frame.score, 0);
  }
}
