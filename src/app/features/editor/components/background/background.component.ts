import { Component, OnDestroy } from '@angular/core';
import { PanZoomModel } from 'ngx-panzoom';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { PanZoomService } from '../../services/pan-zoom.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  public panZoomLevel$: Observable<number> = this.panZoomService.panZoomConfig.modelChanged
    .pipe(
      map((panZoomModel: PanZoomModel) => {
        return Math.round(panZoomModel.zoomLevel);
      }),
      takeUntil(this.destroy$)
    );

  constructor(private panZoomService: PanZoomService) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
