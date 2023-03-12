import { Injectable } from '@angular/core';
import { PanZoomModel } from 'ngx-panzoom';
import { first, Observable } from 'rxjs';
import { CommentNode, Vector2 } from 'src/models/models';
import { GuidService } from '../editor/guid.service';
import { PanZoomService } from '../editor/pan-zoom.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private readonly defaultColor = "#157347";

  constructor(private guidService: GuidService) {
  }

  public generateComment(position: Vector2 | null = null): CommentNode {

    return new CommentNode(
      this.guidService.getGuid(),
      { x: 0, y: 0 },
      this.defaultColor,
      ""
    )
  }
}
