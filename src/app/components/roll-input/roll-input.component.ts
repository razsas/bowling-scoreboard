import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'roll-input-component',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roll-input.component.html',
  styleUrl: './roll-input.component.scss',
})
export class RollInputComponent {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) isGameComplete!: boolean;
  @Input({ required: true }) isLoading!: boolean;
  @Input({ required: true }) errorMessage!: string | null;
  @Input({ required: true }) totalScore!: number | undefined;

  @Output() handleRoll = new EventEmitter<number>();
  @Output() navigateToHighscores = new EventEmitter<void>();
  @Output() handleClearError = new EventEmitter<void>();

  rollForm!: FormGroup;

  constructor() {
    this.rollForm = this.fb.group({
      pins: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
    });
  }

  submitRoll(): void {
    if (this.rollForm.valid) {
      const pins = this.rollForm.get('pins')?.value;
      if (pins !== null && pins !== undefined) {
        this.handleRoll.emit(pins);
        this.rollForm.reset();
      }
    } else {
      this.rollForm.get('pins')?.markAsTouched();
    }
  }

  get pinsControl(): AbstractControl | null {
    return this.rollForm.get('pins');
  }

  onInput(): void {
    if (this.errorMessage) {
      this.handleClearError.emit();
    }
  }
}
