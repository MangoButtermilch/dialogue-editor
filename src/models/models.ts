
export enum PortDirection { IN = "in", OUT = "out" };
export enum PortCapacity { SINGLE = "single", MULTIPLE = "multiple" };
export enum CanvasType { STATIC, DYNAMIC };
export enum VariableType { TEXT = "TEXT", NUM = "NUM", BOOL = "BOOL" }
export enum ConditionType {
    STR_EQUAL = "STR_EQUAL",
    EQUAL = "EQUAL",
    GREATER = "GREATER",
    LESS = "LESS",
    GREATER_EQ = "GREATER_EQ",
    LESS_EQ = "LESS_EQ",
    TRUE = "TRUE",
    FALSE = "FALSE",
}
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
        public connectedPortGuids: string[] = [],
    ) {
        super(guid, pos);
    }

    public isConnectedTo(other: Port): boolean {
        return this.connectedPortGuids.findIndex((guid: string) => guid === other.guid) > -1;
    }

    public connect(other: Port): void {
        this.connectedPortGuids.push(other.guid);
    }

    public disconnect(other: Port): void {
        this.connectedPortGuids = this.connectedPortGuids.filter((guid: string) => guid !== other.guid);
    }

    public disconnectByGuid(otherGuid: string): void {
        this.connectedPortGuids = this.connectedPortGuids.filter((guid: string) => guid !== otherGuid);
    }

    public disconnectAll(): void {
        this.connectedPortGuids = [];
    }

    public getConnections(): string[] {
        return this.connectedPortGuids;
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
        public outPortMatches: Port,
        public outPortFails: Port,
        public variable?: Variable,
        public expectedValue?: boolean | number | string
    ) {
        super(guid, pos);
    }
}

export class Possibility extends GuiObject {
    constructor(
        guid: string,
        pos: Vector2,
        public parentGuid: string,
        public outPort: Port,
    ) {
        super(guid, pos);
    }
}

export class RandomNode extends GuiObject {
    constructor(
        guid: string,
        pos: Vector2,
        public inPort: Port,
        public possibilites: Possibility[]
    ) {
        super(guid, pos);
    }
}

export class RepeatNode extends GuiObject {
    constructor(
        guid: string,
        pos: Vector2,
        public repetitions: number,
        public inPort: Port,
        public outPort: Port,
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
        public conditions: ConditionNode[] = [],
        public randomNodes: RandomNode[] = [],
        public repeatNodes: RepeatNode[] = [],
        public variables: Variable[] = [],
        public characters: Character[] = []
    ) { }
}