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
  @Input({ required: true }) getRollDisplay!: (
    frame: Frame,
    throwNumber: "roll1" | "roll2" | "roll3",
    index: number
  ) => string;
  @Input({ required: true }) currentFrameRolls!: number[];

  public readonly frameIndices: number[] = Array.from(
    { length: 10 },
    (_, i) => i
  );

  public getLiveRollDisplay(
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
        if (
          this.currentFrameRolls.length === 2 &&
          this.currentFrameRolls[0] + this.currentFrameRolls[1] === 10 &&
          frameIndex === 9 &&
          throwNumber === 2
        ) {
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

  calculateCumulativesScore(currentIndex: number): number {
    return this.frames
      .slice(0, currentIndex + 1)
      .reduce((total, frame) => total + frame.score, 0);
  }
}
