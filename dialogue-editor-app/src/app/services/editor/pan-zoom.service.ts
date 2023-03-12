import { Injectable } from '@angular/core';
import { PanZoomConfig, PanZoomAPI } from 'ngx-panzoom';
import { ReplaySubject } from 'rxjs';
import { Vector2 } from 'src/models/models';

@Injectable({
  providedIn: 'root'
})
export class PanZoomService {

  private origin$: ReplaySubject<Vector2> = new ReplaySubject<Vector2>();

  public panZoomConfig: PanZoomConfig = new PanZoomConfig({
    zoomOnDoubleClick: false,
    zoomLevels: 4,
    freeMouseWheel: false,
    invertMouseWheel: true,
    panOnClickDrag: true,
    friction: 20,
    dragMouseButton: 'middle',
    initialZoomLevel: 2,
  });

  public panZoomApi?: PanZoomAPI;

  constructor() {
    this.panZoomConfig.api
      .subscribe((api: PanZoomAPI) => {
        this.panZoomApi = api;
      });
  }

  /**
   * Moves viewport to specific location.
   * Also resets zoom level to 2 (initial value)
   * @param position 
   */
  private panTo(position: Vector2): void {
    this.panZoomApi?.changeZoomLevel(2, { x: position.x, y: position.y })
    this.panZoomApi?.panDelta(position);
  }

  /**
   * Moves viewport to origin
   */
  public panToOrigin(): void {
    this.panZoomApi?.panToPoint({ x: 0, y: 0 });
  }

  public getZoomScale(): number {
    return this.panZoomApi?.model.zoomLevel ?? -1;
  }
}
