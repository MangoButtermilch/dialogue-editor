import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Edge, Port } from 'src/models/models';
import { GuidService } from '../editor/guid.service';

@Injectable({
  providedIn: 'root'
})
export class EdgeService {

  private edges$: ReplaySubject<Edge[]> = new ReplaySubject<Edge[]>();
  private edges: Edge[] = [];

  constructor(private guidService: GuidService) { }

  /**
   * Edges will be used for canvas rendering of connections between ports.
   * @param portA 
   * @param portB 
   */
  public generateEdge(portA: Port, portB: Port): void {
    const edgeExists: boolean = this.edges.some(
      (other: Edge) => {
        other.start.guid === portA.guid &&
          other.end.guid === portB.guid
      });
    if (edgeExists) return;

    this.edges.push(
      new Edge(
        this.guidService.getGuid(),
        { x: 0, y: 0 },
        portA,
        portB
      )
    );
    this.edges$.next(this.edges);
  }

  public removeEdge(portA: Port, portB: Port): void {
    this.removeAllEdgesFor(portA);
    this.removeAllEdgesFor(portB);
  }

  public removeEdgeFor(portA: Port): void {
    this.removeAllEdgesFor(portA);
  }

  public removeAllEdgesFor(port: Port): void {
    this.edges = this.edges.filter(
      (other: Edge) =>
        other.start.guid !== port.guid &&
        other.end.guid !== port.guid
    );

    this.edges$.next(this.edges);
  }

  public getEdges(): Observable<Edge[]> {
    return this.edges$;
  }
}
