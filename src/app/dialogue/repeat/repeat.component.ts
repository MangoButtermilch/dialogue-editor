import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { RepeatNode } from 'src/models/models';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss']
})
export class RepeatComponent implements OnInit {

  @Output() onUpdate: EventEmitter<RepeatNode> = new EventEmitter<RepeatNode>();
  @Output() onDelete: EventEmitter<RepeatNode> = new EventEmitter<RepeatNode>();
  @Input() repeatNode: RepeatNode;

  public formGroup: FormGroup | null = null;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      count: new FormControl(this.repeatNode.repetitions ?? 1, [Validators.required, Validators.min(1)])
    });
  }

  public onAmountInput(eventData: any): void {
    const val = eventData.target.value;
    const amount = parseInt(val);

    if (amount < 0 || !amount) return;

    this.repeatNode.repetitions = amount;
    this.onUpdate.emit(this.repeatNode);
  }

  public hasErrors(): boolean {
    return this.inputErrors !== null && this.inputErrors !== undefined;
  }

  public get inputErrors(): ValidationErrors | null | undefined {
    return this.formGroup?.get("count")?.errors;
  }
}
