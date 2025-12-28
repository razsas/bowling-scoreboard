import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Frame } from '../../models/game.models';
import { FrameComponent } from '../frame/frame.component';
import { RollDisplayPipe } from '../../pipes/roll-display.pipe';

@Component({
  selector: 'app-scoreboard-display',
  imports: [FrameComponent, RollDisplayPipe],
  templateUrl: './scoreboard-display.component.html',
  styleUrl: './scoreboard-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreboardDisplayComponent {
  frames = input.required<Frame[]>();
  currentFrameRolls = input.required<number[]>();

  readonly frameIndices = Array.from({ length: 10 }, (_, i) => i);

  readonly allFrames = computed(() => {
    const finished = this.frames();
    const current = this.currentFrameRolls();
    const nextIdx = finished.length;
    
    const frames: (Frame | undefined)[] = [...finished];
    if (nextIdx < 10) {
      frames[nextIdx] = this.createActiveFrame(current, nextIdx);
    }
    return frames;
  });

  readonly cumulativeScores = computed(() => {
    let total = 0;
    const scores = this.frames().map(f => {
      total += f.score;
      return total;
    });
    return scores;
  });

  private createActiveFrame(rolls: number[], index: number): Frame {
    const r1 = rolls[0] ?? null;
    const r2 = rolls[1] ?? null;
    const r3 = rolls[2] ?? null;
    const isStrike = r1 === 10;
    const isSpare = !isStrike && r1 !== null && r2 !== null && (r1 + r2 === 10);

    return {
      id: -1,
      gameId: -1,
      frameIndex: index,
      roll1: r1,
      roll2: r2,
      roll3: r3,
      score: 0,
      isStrike,
      isSpare
    };
  }
}
