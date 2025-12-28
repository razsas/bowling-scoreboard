import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-frame',
  imports: [CommonModule],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameComponent {
  frameNumber = input.required<number>();
  roll1 = input<string>('');
  roll2 = input<string>('');
  roll3 = input<string>('');
  score = input<number | string>('');
  isTenthFrame = input<boolean>(false);
}
