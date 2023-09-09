import { Injectable } from '@angular/core';
import { Port, PortCapacity, PortDirection } from 'src/models/models';
import { GuidService } from '../editor/guid.service';

@Injectable({
  providedIn: 'root'
})
export class PortService {

  constructor(private guidService: GuidService) { }

  public generateInputPort(parentGuid: string): Port {
    const guid: string = this.guidService.getGuid();
    return new Port(
      guid,
      { x: 0, y: 0 },
      parentGuid,
      PortDirection.IN,
      PortCapacity.MULTIPLE
    );
  }

  public generateOutputPort(parentGuid: string): Port {
    const guid: string = this.guidService.getGuid();
    return new Port(
      guid,
      { x: 0, y: 0 },
      parentGuid,
      PortDirection.OUT,
      PortCapacity.SINGLE
    );
  }
}
