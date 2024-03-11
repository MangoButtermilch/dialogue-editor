import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Choice, ConditionNode, DialogueNode, EventNode, Port, PortCapacity, PortDirection, Possibility, RandomNode, RepeatNode } from 'src/models/models';
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

  private updatePorts(): void {
    this.ports$.next(this.ports);
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
    this.findPortByGuid(guidB).disconnectByGuid(portA.guid);
    this.portsDisconnectedState$.next([portA]);
  }

  /**
   * @returns Observable array of 2 ports that have been connected
   */
  public onPortsConnected(): Observable<Port[]> {
    return this.portsConnectedState$;
  }

  /**
   * @returns Observable array of 2 ports that have been disconnected
   */
  public onPortsDisconnected(): Observable<Port[]> {
    return this.portsDisconnectedState$;
  }

  public removePort(port: Port): void {
    this.ports = this.ports.filter((other: Port) => other.guid !== port.guid);
    this.updatePorts();
  }

  public removePortByGuid(guid: string): void {
    this.ports = this.ports.filter((other: Port) => other.guid !== guid);
    this.updatePorts();
  }

  private findPortByGuid(guid: string): Port {
    return this.ports.find((other: Port) => other.guid === guid);
  }

  /**
   * Removes in-port and all out-ports from choices
   * @param node 
   */
  public removePortsForNode(node: DialogueNode) {
    this.removePort(node.inPort);
    
    node.choices.forEach((choice: Choice) => {
      this.removePort(choice.outPort);
    })
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
    
    randomNode.possibilites.forEach((possibility: Possibility) => {
      this.removePort(possibility.outPort);
    });
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
