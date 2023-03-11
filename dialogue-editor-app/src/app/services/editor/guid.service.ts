import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class GuidService {

  constructor() { }

  /**
   * @returns Unique identifier for every GUI element
   */
  public getGuid(): string {
    return Guid.create().toString();
  }
}
