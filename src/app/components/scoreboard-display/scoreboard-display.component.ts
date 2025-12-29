import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Frame, FrameVM, RollNumber, ROLLS } from '../../models/game.models';
import { FrameComponent } from '../frame/frame.component';
import { GAME_CONSTANTS } from '../../constants/game.constants';

@Component({
  selector: 'app-scoreboard-display',
  imports: [FrameComponent],
  templateUrl: './scoreboard-display.component.html',
  styleUrl: './scoreboard-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreboardDisplayComponent {
  frames = input.required<Frame[]>();
  currentFrameRolls = input.required<number[]>();

  readonly viewFrames = computed<FrameVM[]>(() => {
    const finished = this.frames();
    const liveRolls = this.currentFrameRolls();
    const lastIdx = GAME_CONSTANTS.LAST_FRAME_INDEX;

    let cumulative = 0;

    return Array.from({ length: GAME_CONSTANTS.MAX_FRAMES }, (_, idx) => {
      const isLastFrame = idx === lastIdx;
      // Get frame data: either from finished list or create a "live" one
      const frame =
        finished[idx] ||
        (idx === finished.length
          ? this.createActiveFrame(liveRolls, idx)
          : null);

      // Update cumulative score only if frame is finished and has a score
      const hasScore = frame && finished[idx]?.score !== undefined;
      if (hasScore) cumulative += frame.score;

      return {
        frameNumber: idx + 1,
        ariaLabel: `Frame ${idx + 1}`,
        isTenthFrame: isLastFrame,
        roll1: frame ? this.formatRoll(frame, ROLLS['first']) : '',
        roll2: frame ? this.formatRoll(frame, ROLLS['second']) : '',
        roll3: frame ? this.formatRoll(frame, ROLLS['third']) : '',
        score: hasScore ? cumulative : '',
      };
    });
  });

  private createActiveFrame(rolls: number[], index: number): Frame {
    return {
      id: -1,
      gameId: -1,
      frameIndex: index,
      roll1: rolls[0] ?? null,
      roll2: rolls[1] ?? null,
      roll3: rolls[2] ?? null,
      score: 0,
      isStrike: rolls[0] === GAME_CONSTANTS.MAX_PINS,
      isSpare:
        (rolls[0] ?? 0) + (rolls[1] ?? 0) === GAME_CONSTANTS.MAX_PINS &&
        rolls[0] !== GAME_CONSTANTS.MAX_PINS,
    };
  }

  private formatRoll(frame: Frame, rollNum: RollNumber): string {
    const val = frame[rollNum];
    if (val === null || val === undefined) return '';

    const { MAX_PINS, LAST_FRAME_INDEX } = GAME_CONSTANTS;
    const isLast = frame.frameIndex === LAST_FRAME_INDEX;

    // Strike Logic
    if (val === MAX_PINS && (isLast || rollNum === ROLLS['first'])) {
      return 'X';
    }

    // Spare Logic
    if (rollNum === ROLLS['second']) {
      const prev = frame.roll1 ?? 0;
      if (prev !== MAX_PINS && prev + val === MAX_PINS) return '/';
    }

    // 10th frame 3rd roll spare logic (e.g., X, 7, 3, but not 7, 3, 7)
    if (isLast && rollNum === ROLLS['third'] && !frame.isSpare) {
      const prev = frame.roll2 ?? 0;
      if (prev !== MAX_PINS && prev + val === MAX_PINS) return '/';
    }

    return val.toString();
  }
}
