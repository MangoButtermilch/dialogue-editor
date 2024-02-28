import { Injectable } from '@angular/core';
import { PanZoomModel } from 'ngx-panzoom';
import { Observable } from 'rxjs';
import { Vector2 } from 'src/models/models';
import { PanZoomService } from './pan-zoom.service';

@Injectable({
  providedIn: 'root'
})
export class GuiElementServiceService {

  private panZoomChanged$: Observable<PanZoomModel> = this.panZoomService.panZoomConfig.modelChanged;
  private panPosition: Vector2 = { x: 0, y: 0 };
  private panZoomLevel: number = 2;
  
  constructor(private panZoomService: PanZoomService) {
    this.panZoomChanged$.subscribe((model: PanZoomModel) => {
      this.panZoomLevel = model.zoomLevel;
      this.panPosition.x = Math.round(model.pan.x);
      this.panPosition.y = Math.round(model.pan.y);
    });
  }

  /**
   * @param mousePosition 
   * @returns Vector2 position for a new GUI element to instantiate at.
   */
  public getInstantiatePosition(mousePosition: Vector2) {
    const x: number = (mousePosition.x - this.panPosition.x) * this.zoomMultiplier;
    const y: number = (mousePosition.y - this.panPosition.y) * this.zoomMultiplier;
    return { x: x, y: y }
  }

  private get zoomMultiplier() {
    return this.zoomLevelToMultiplierMap.get(this.panZoomLevel);
  }

  /**
   * Holds information about how to multiply a position in the editor by a given zoom level.
   * 3 is most zoom in and 0 is furthest zoom out.
   */
  private readonly zoomLevelToMultiplierMap: Map<number, number> = new Map(
    [
      [3, 0.5],
      [2, 1],
      [1, 2],
      [0, 4]
    ]
  );
}
