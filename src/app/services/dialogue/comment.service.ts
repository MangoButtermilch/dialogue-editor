import { Injectable } from '@angular/core';
import { CommentNode, Vector2 } from 'src/models/models';
import { GuidService } from '../editor/guid.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private readonly defaultColor = "#198754";

  constructor(private guidService: GuidService) { }

  public generateComment(position: Vector2 | null = null): CommentNode {
    return new CommentNode(
      this.guidService.getGuid(),
      position ?? { x: 0, y: 0 },
      this.defaultColor,
      ""
    );
  }
}
