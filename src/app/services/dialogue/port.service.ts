import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConditionNode, Dialogue, DialogueNode, EventNode, Port, PortCapacity, PortDirection, RandomNode, RepeatNode } from 'src/models/models';
import { GuidService } from '../editor/guid.service';

@Injectable({
  providedIn: 'root'
})
export class PortService {

  private ports: Port[] = [];
  private ports$: BehaviorSubject<Port[]> = new BehaviorSubject<Port[]>([]);
  private portsConnectedState$: Subject<Port[]> = new Subject<Port[]>();
  private portsDisconnectedState$: Subject<Port[]> = new Subject<Port[]>();

  constructor(private guidService: GuidService) { }

  public loadImportedPorts(dialogue: Dialogue): void {
    this.destroyPorts();
    this.findPortsRecursivley(dialogue);
    this.updatePorts();
  }

  /**
   * @returns Observable array of 2 ports that have been connected
   */
  public onPortsConnected(): Observable<Port[]> {
    return this.portsConnectedState$.asObservable();
  }

  /**
   * @returns Observable array of 2 ports that have been disconnected
   */
  public onPortsDisconnected(): Observable<Port[]> {
    return this.portsDisconnectedState$.asObservable();
  }

  /**
   * 
   * @returns Observable of current ports array
   */
  public getPorts(): Observable<Port[]> {
    return this.ports$.asObservable();
  }

  /**
   * Updates ports$ stream
   */
  private updatePorts(): void {
    this.ports$.next(this.ports);
  }

  /**
   * Sets ports to empty array and updates stream.
   */
  private destroyPorts(): void {
    this.ports = [];
    this.updatePorts();
  }

  /**
   * Automatically connects A to B and B to A
   * @param portA 
   * @param portB 
   */
  public connectPorts(portA: Port, portB: Port): void {
    portA.connect(portB);
    portB.connect(portA);
    this.portsConnectedState$.next([portA, portB]);
  }

  /**
   * Automatically disonnects A from B and B from A
   * @param portA 
   * @param portB 
   */
  public disconnectPorts(portA: Port, portB: Port): void {
    portA.disconnect(portB);
    portB.disconnect(portA);
    this.portsDisconnectedState$.next([portA, portB]);
  }

  /**
   * Automatically disonnects A from B and B from A
   * @param portA 
   * @param portB 
   */
  public disconnectPortsByGuid(portA: Port, guidB: string): void {
    portA.disconnectByGuid(guidB);

    const portB = this.findPortByGuid(guidB);

    if (portB !== undefined) { //Port B can be undefined if node of port has already been destroyed
      portB.disconnectByGuid(portA.guid);
      this.portsDisconnectedState$.next([portA, portB]);
      return;
    }
    this.portsDisconnectedState$.next([portA]);
  }

  public generateInputPort(parentGuid: string): Port {
    const guid: string = this.guidService.getGuid();
    const port = new Port(
      guid,
      { x: 0, y: 0 },
      parentGuid,
      PortDirection.IN,
      PortCapacity.MULTIPLE
    );
    this.ports.push(port);
    this.updatePorts();
    return port;
  }

  public generateOutputPort(parentGuid: string): Port {
    const guid: string = this.guidService.getGuid();
    const port = new Port(
      guid,
      { x: 0, y: 0 },
      parentGuid,
      PortDirection.OUT,
      PortCapacity.SINGLE
    );
    this.ports.push(port);
    this.updatePorts();
    return port;
  }

  /**
   * Only call after import of a dialogue.
   * @param iteratable Initial value should be Dialouge object after an import
   */
  private findPortsRecursivley(iteratable: any) {

    for (const key in iteratable) {
      const value = iteratable[key];
      const isIteratable = (typeof (value) === "object");
      if (!isIteratable) continue;

      this.findPortsRecursivley(value);

      const isPort = value instanceof Port;
      if (!isPort) continue;

      const hasPort = this.ports.some((other: Port) => other.guid === value.guid);
      if (hasPort) continue;
      this.ports.push(value);
    }
  }

  private findPortByGuid(guid: string): Port {
    return this.ports.find((other: Port) => other.guid === guid);
  }

  public removePort(port: Port): void {
    for (const guid of port.connectedPortGuids) {
      this.disconnectPortsByGuid(port, guid);
    }
    
    this.ports = this.ports.filter((other: Port) => other.guid !== port.guid);
    this.updatePorts();
  }

  /**
   * Removes in-port and all out-ports from choices
   * @param node 
   */
  public removePortsForNode(node: DialogueNode) {
    this.removePort(node.inPort);

    for (const choice of node.choices) {
      this.removePort(choice.outPort);
    }
  }

  /**
   * Removes in-port and out-port of EventNode
   * @param event 
   */
  public removePortsForEvent(event: EventNode) {
    this.removePort(event.inPort);
    this.removePort(event.outPort);
  }

  /**
   * Removes in-port and all out-ports from possibilities 
   * @param randomNode 
   */
  public removePortsForRandomNode(randomNode: RandomNode) {
    this.removePort(randomNode.inPort);

    for (const possibility of randomNode.possibilites) {
      this.removePort(possibility.outPort);
    }
  }

  /**
   * Removes in-port and out-port of RepeatNode
   * @param node 
   */
  public removePortsForRepeatNode(node: RepeatNode) {
    this.removePort(node.inPort);
    this.removePort(node.outPort);
  }

  /**
   * Removes in-port and out-port for failure and out-port for success
   * @param condition 
   */
  public removePortsForCondition(condition: ConditionNode) {
    this.removePort(condition.inPort);
    this.removePort(condition.outPortFails);
    this.removePort(condition.outPortMatches);
  }
}
