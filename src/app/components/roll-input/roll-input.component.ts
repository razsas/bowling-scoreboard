import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-roll-input',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roll-input.component.html',
  styleUrl: './roll-input.component.scss',
})
export class RollInputComponent {
  isGameComplete = input.required<boolean>();
  isLoading = input.required<boolean>();
  errorMessage = input.required<string | null>();
  totalScore = input<number | undefined>();
  maxAllowedPins = input.required<number>();

  handleRoll = output<number>();
  navigateToHighscores = output<void>();
  handleClearError = output<void>();

  readonly pinOptions = Array.from({ length: 11 }, (_, i) => i);

  onPinClick(pins: number): void {
    if (this.isLoading()) return;
    this.handleRoll.emit(pins);
  }
}
