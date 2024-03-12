import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, withLatestFrom } from 'rxjs';
import { Choice, ConditionNode, DialogueNode, Edge, EventNode, Port, PortCapacity, Possibility, RandomNode, RepeatNode } from 'src/models/models';
import { DomEventService } from '../dom/dom-event.service';
import { EditorStateService } from '../editor/editor-state.service';
import { GuidService } from '../editor/guid.service';
import { PortService } from './port.service';

@Injectable({
  providedIn: 'root'
})
export class EdgeService {

  private edges$: ReplaySubject<Edge[]> = new ReplaySubject<Edge[]>();
  private edges: Edge[] = [];
  private portsConnected$: Observable<Port[]> = this.portService.onPortsConnected();
  private portsDisconnected$: Observable<Port[]> = this.portService.onPortsDisconnected();
  private deleteEdge$: Observable<[void, Edge]> = this.domEventService.onDomDblClick()
    .pipe(
      withLatestFrom(this.editorStateService.onEdgeSelected())
    );


  constructor(
    private guidService: GuidService,
    private domEventService: DomEventService,
    private editorStateService: EditorStateService,
    private portService: PortService) {

    this.handlePortsConnected();
    this.handlePortsDisconnected();
    this.handleDeleteEdge();
  }

  public generateEdgesAfterImport(): void {
    this.edges = [];
    this.updateEdges();

    this.portService.getPorts().subscribe((ports: Port[]) => {
      ports.forEach((port: Port) => {

        //Only need one-way connections to avoid overdraw
        if (
          port.connectedPortGuids.length == 0 ||
          port.capacity === PortCapacity.MULTIPLE
        ) return;

        for (let guid of port.connectedPortGuids) {

          const otherPort: Port = ports.find((other: Port) => other.guid === guid);
          this.generateEdge(port, otherPort);
        }

      });

    }).unsubscribe();
  }

  /**
   * Updates edges observable with current edges array.
   */
  private updateEdges(): void {
    this.edges$.next(this.edges);
  }

  private handleDeleteEdge(): void {
    this.deleteEdge$.subscribe((data: [void, Edge]) => {
      const edge: Edge = data[1];
      if (edge === null || edge === undefined) return;

      const deleteEndConnection = edge.end.capacity === "single";
      const deleteStartConnection = edge.start.capacity === "single";

      if (deleteEndConnection) this.removeAllEdgesFor(edge.end);
      if (deleteStartConnection) this.removeAllEdgesFor(edge.start);

      this.portService.disconnectPorts(edge.start, edge.end);
      this.editorStateService.setDeleteEdge(edge);

    });
  }

  private handlePortsConnected(): void {
    this.portsConnected$.subscribe((ports: Port[]) => {
      const portA = ports[0];
      const portB = ports[1];
      this.generateEdge(portA, portB);
    });
  }

  private handlePortsDisconnected(): void {
    this.portsDisconnected$.subscribe((ports: Port[]) => {
      const portA = ports[0];
      const portB = ports[1];
      this.removeAllEdgesFor(portA);
    });
  }

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
    this.updateEdges();
  }

  public removeAllEdgesFor(port: Port): void {
    this.edges = this.edges.filter(
      (other: Edge) =>
        other.start.guid !== port.guid &&
        other.end.guid !== port.guid
    );

    this.updateEdges();
  }

  public getEdges(): Observable<Edge[]> {
    return this.edges$.asObservable();
  }

  /**
   * Removes all edges for in-port and all out-ports from choices
   * @param node 
   */
  public removeEdgesForNode(node: DialogueNode) {
    this.removeAllEdgesFor(node.inPort);

    node.choices.forEach((choice: Choice) => {
      this.removeAllEdgesFor(choice.outPort)
    });

  }

  /**
   * Removes all edges for in-port and out-port of EventNode
   * @param event 
   */
  public removeEdgesForEvent(event: EventNode) {
    this.removeAllEdgesFor(event.inPort);
    this.removeAllEdgesFor(event.outPort);
  }

  /**
   * Removes all edges for in-port and all out-ports from possibilities 
   * @param randomNode 
   */
  public removeEdgesForRandomNode(randomNode: RandomNode) {
    this.removeAllEdgesFor(randomNode.inPort);
    randomNode.possibilites.forEach((possibility: Possibility) => {
      this.removeAllEdgesFor(possibility.outPort)
    });
  }

  /**
   * Removes all edges for in-port and out-port of RepeatNode
   * @param node 
   */
  public removeEdgesForRepeatNode(node: RepeatNode) {
    this.removeAllEdgesFor(node.inPort);
    this.removeAllEdgesFor(node.outPort);
  }

  /**
   * Removes all edges for in-port and out-port for failure and out-port for success
   * @param condition 
   */
  public removeEdgesForCondition(condition: ConditionNode) {
    this.removeAllEdgesFor(condition.inPort);
    this.removeAllEdgesFor(condition.outPortFails);
    this.removeAllEdgesFor(condition.outPortMatches);
  }
}
