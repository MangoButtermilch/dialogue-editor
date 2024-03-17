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
    .pipe(withLatestFrom(this.editorStateService.onEdgeSelected()));

  constructor(
    private editorStateService: EditorStateService,
    private guidService: GuidService,
    private domEventService: DomEventService,
    private portService: PortService) {

    this.handlePortsConnected();
    this.handlePortsDisconnected();
    this.handleDeleteEdge();
  }

  public getEdges(): Observable<Edge[]> {
    return this.edges$.asObservable();
  }

  /**
   * Updates edges stream 
   */
  private updateEdges(): void {
    this.edges$.next(this.edges);
  }

  /**
   * Sets edges array to empty array and updates stream
   */
  private destroyEdges(): void {
    this.edges = [];
    this.updateEdges();
  }

  /**
   * Iterates over all ports and creates edges.
   * Edges will only be created for SINGLE capacity ports to avoid overdraw.
   */
  public generateEdgesAfterImport(): void {
    this.destroyEdges();

    this.portService.getPorts().subscribe((ports: Port[]) => {

      for (const port of ports) {
        if (
          port.connectedPortGuids.length == 0 ||
          port.capacity === PortCapacity.MULTIPLE
        ) continue;

        for (let guid of port.connectedPortGuids) {

          const otherPort: Port = ports.find((other: Port) => other.guid === guid);
          this.generateEdge(port, otherPort);
        }
      }

      this.updateEdges();
    }).unsubscribe();
  }

  private handleDeleteEdge(): void {
    this.deleteEdge$.subscribe((data: [void, Edge]) => {
      const edge: Edge = data[1];
      if (edge === null || edge === undefined) return;

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
      if (portA !== undefined) this.removeAllEdgesFor(portA, true);
      if (portB !== undefined) this.removeAllEdgesFor(portB, true);
    });
  }

  /**
   * Generates an edge between two ports. Edges will be used for canvas rendering of connections between ports.
   * @param portA 
   * @param portB 
   */
  public generateEdge(portA: Port, portB: Port): void {
    const edgeExists: boolean = this.edges.some((other: Edge) => {
      other.start.guid === portA.guid || other.end.guid === portB.guid ||
        other.end.guid === portA.guid || other.start.guid === portB.guid
    });
    if (edgeExists) return;

    this.edges.push(new Edge(
      this.guidService.getGuid(),
      { x: 0, y: 0 },
      portA,
      portB
    ));
    this.updateEdges();
  }

  /**
   * Will remove all edges for given port.
   * @param port 
   * @param singleCapacityOnly If true, will only delete edge if port has SINGLE capacity.
   * Set to true if deleting edges (this is because edges are only created via SINGLE capacity ports).
   * Set to false if deleteing whole nodes. 
   */
  public removeAllEdgesFor(port: Port, singleCapacityOnly: boolean): void {
    if (singleCapacityOnly && port.capacity !== PortCapacity.SINGLE) return;

    this.edges = this.edges.filter((other: Edge) =>
      other.start.guid !== port.guid &&
      other.end.guid !== port.guid
    );

    this.updateEdges();
  }

  /**
   * Removes all edges for in-port and all out-ports from choices
   * @param node 
   */
  public removeEdgesForNode(node: DialogueNode) {
    this.removeAllEdgesFor(node.inPort, false);

    for (const choice of node.choices) {
      this.removeAllEdgesFor(choice.outPort, false);
    }
  }

  /**
   * Removes all edges for in-port and out-port of EventNode
   * @param event 
   */
  public removeEdgesForEvent(event: EventNode) {
    this.removeAllEdgesFor(event.inPort, false);
    this.removeAllEdgesFor(event.outPort, false);
  }

  /**
   * Removes all edges for in-port and all out-ports from possibilities 
   * @param randomNode 
   */
  public removeEdgesForRandomNode(randomNode: RandomNode) {
    this.removeAllEdgesFor(randomNode.inPort, false);
    for (const possibility of randomNode.possibilites) {
      this.removeAllEdgesFor(possibility.outPort, false);
    }
  }

  /**
   * Removes all edges for in-port and out-port of RepeatNode
   * @param node 
   */
  public removeEdgesForRepeatNode(node: RepeatNode) {
    this.removeAllEdgesFor(node.inPort, false);
    this.removeAllEdgesFor(node.outPort, false);
  }

  /**
   * Removes all edges for in-port and out-port for failure and out-port for success
   * @param condition 
   */
  public removeEdgesForCondition(condition: ConditionNode) {
    this.removeAllEdgesFor(condition.inPort, false);
    this.removeAllEdgesFor(condition.outPortFails, false);
    this.removeAllEdgesFor(condition.outPortMatches, false);
  }
}
