import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { PanZoomModel } from 'ngx-panzoom';
import { Subject, takeUntil } from 'rxjs';
import { PanZoomService } from '../../services/pan-zoom.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnDestroy {

  @Input() dialogueName: string = "";

  @Output() onHelpClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() onNewNodeClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() onBackToOriginClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaveClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() onLoadClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() onExportClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() onDialogeNameChange: EventEmitter<string> = new EventEmitter<string>();

  private destroy$: Subject<boolean> = new Subject<boolean>();

  zoom: number = 0;
  x: number = 0;
  y: number = 0;

  public iconHelp = faQuestion;
  public iconAdd = faPlus;

  constructor(
    private panZoomService: PanZoomService) { }

  ngOnInit(): void {
    this.panZoomService.panZoomConfig.modelChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe((model: PanZoomModel) => {
        this.zoom = Math.round(model.zoomLevel);
        this.x = Math.round(model.pan.x);
        this.y = Math.round(model.pan.y);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onNameChange(event: any): void {
    this.onDialogeNameChange.emit(event?.target?.value ?? "");
  }

  public save(): void {
    this.onSaveClicked.emit();
  }

  public export(): void {
    this.onExportClicked.emit();
  }

  public load(): void {
    this.onLoadClicked.emit();
  }
}
