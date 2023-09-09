
export enum PortDirection { IN = "in", OUT = "out" };
export enum PortCapacity { SINGLE = "single", MULTIPLE = "multiple" };
export enum CanvasType { STATIC, DYNAMIC };
export enum VariableType { TEXT = "text", NUM = "num", BOOL = "bool" }
export enum ConditionType {
    EQUAL = "EQUAL",
    GREATER = "GREATER",
    LESS = "LESS",
    GREATER_EQ = "GREATER_EQ",
    LESS_EQ = "LESS_EQ",
    TRUE = "TRUE",
    FALSE = "FALSE",
}

export const ConditionVariableMap: Map<ConditionType, VariableType[]> = new Map<ConditionType, VariableType[]>([
    [ConditionType.EQUAL, [VariableType.BOOL, VariableType.NUM, VariableType.TEXT]],
    [ConditionType.GREATER, [VariableType.NUM,]],
    [ConditionType.GREATER_EQ, [VariableType.NUM]],
    [ConditionType.LESS, [VariableType.NUM]],
    [ConditionType.LESS_EQ, [VariableType.NUM]],
    [ConditionType.TRUE, [VariableType.BOOL]],
    [ConditionType.FALSE, [VariableType.BOOL]],
]);

export interface Vector2 {
    x: number
    y: number
}

export interface Line {
    start: Vector2
    end: Vector2
}

export interface Character {
    guid: string
    name: string
    color: string
    isDefault: boolean
}

export interface Variable {
    guid: string,
    name: string,
    value: any,
    type: VariableType
}

export abstract class GuiObject {
    constructor(
        public guid: string,
        public position: Vector2,
        public transformStyle: string = "") { }
}

export class Port extends GuiObject {
    constructor(
        guid: string,
        pos: Vector2,
        public parentGuid: string,
        public direction: PortDirection,
        public capacity: PortCapacity,
        public connectedPorts: Port[] = [],
    ) {
        super(guid, pos);
    }

    public isConnectedTo(other: Port): boolean {
        return this.connectedPorts.findIndex((ports: Port) => ports.guid === other.guid) > -1;
    }

    public connect(other: Port): void {
        this.connectedPorts.push(other);
    }

    public disconnect(other: Port): void {
        this.connectedPorts = this.connectedPorts.filter((port: Port) => port.guid !== other.guid);
    }

    public disconnectAll(): void {
        this.connectedPorts = [];
    }

    public getConnections(): Port[] {
        return this.connectedPorts;
    }
}

export class Choice extends GuiObject {
    constructor(
        guid: string,
        pos: Vector2,
        public parentGuid: string,
        public outPort: Port,
        public content: string
    ) {
        super(guid, pos);
    }
}

export class Edge extends GuiObject {
    constructor(
        guid: string,
        pos: Vector2,
        public start: Port,
        public end: Port
    ) {
        super(guid, pos);
    }
}

export class DialogueNode extends GuiObject {

    constructor(
        guid: string,
        pos: Vector2,
        public character: Character,
        public label: string,
        public content: string,
        public isRoot: boolean,
        public inPort: Port,
        public choices: Choice[] = []
    ) {
        super(guid, pos);
    }
}

export class CommentNode extends GuiObject {
    constructor(
        guid: string,
        pos: Vector2,
        public color: string,
        public content: string
    ) {
        super(guid, pos);
    }
}

export class EventNode extends GuiObject {
    constructor(
        guid: string,
        pos: Vector2,
        public name: string,
        public inPort: Port,
        public outPort: Port
    ) {
        super(guid, pos);
    }
}

export class ConditionNode extends GuiObject {
    constructor(
        guid: string,
        pos: Vector2,
        public type: ConditionType,
        public inPort: Port,
        public outPort: Port,
        public variableA?: Variable,
        public variableB?: Variable
    ) {
        super(guid, pos);
    }
}

export class Dialogue {
    constructor(
        public name: string,
        public guid: string,
        public dateTime: string,
        public nodes: DialogueNode[],
        public comments: CommentNode[] = [],
        public events: EventNode[] = [],
        public conditions: ConditionNode[] = []
    ) { }
}