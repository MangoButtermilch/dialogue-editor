
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
    
    
    public findCommentNodeIndex(node: CommentNode): number {
        return this.comments.findIndex((other: CommentNode) => other.guid === node.guid);
    }

    public addCommentNode(node: CommentNode): void {
        this.comments.push(node);
    }

    public updateCommentNode(node: CommentNode): void {
        this.comments[this.findCommentNodeIndex(node)] = node;
    }

    public removeCommentNode(node: CommentNode): void {
        this.comments.splice(this.findCommentNodeIndex(node), 1);
    }


    
    public findRandomNodeIndex(node: RandomNode): number {
        return this.randomNodes.findIndex((other: RandomNode) => other.guid === node.guid);
    }

    public addRandomNode(node: RandomNode): void {
        this.randomNodes.push(node);
    }

    public updateRandomNode(node: RandomNode): void {
        this.randomNodes[this.findRandomNodeIndex(node)] = node;
    }

    public removeRandomNode(node: RandomNode): void {
        this.randomNodes.splice(this.findRandomNodeIndex(node), 1);
    }

    
    public findConditionNodeIndex(node: ConditionNode): number {
        return this.conditions.findIndex((other: ConditionNode) => other.guid === node.guid);
    }

    public addConditionNode(node: ConditionNode): void {
        this.conditions.push(node);
    }

    public updateConditionNode(node: ConditionNode): void {
        this.conditions[this.findConditionNodeIndex(node)] = node;
    }

    public removeConditionNode(node: ConditionNode): void {
        this.conditions.splice(this.findConditionNodeIndex(node), 1);
    }
    

    public findEventNodeIndex(node: EventNode): number {
        return this.events.findIndex((other: EventNode) => other.guid === node.guid);
    }

    public addEventNode(node: EventNode): void {
        this.events.push(node);
    }

    public updateEventNode(node: EventNode): void {
        this.events[this.findEventNodeIndex(node)] = node;
    }

    public removeEventNode(node: EventNode): void {
        this.events.splice(this.findEventNodeIndex(node), 1);
    }
    

    public findDialogueNodeIndex(node: DialogueNode): number {
        return this.nodes.findIndex((other: DialogueNode) => other.guid === node.guid);
    }

    public addDialogueNode(node: DialogueNode): void {
        this.nodes.push(node);
    }

    public updateDialogueNode(node: DialogueNode): void {
        this.nodes[this.findDialogueNodeIndex(node)] = node;
    }

    public removeDialogueNode(node: DialogueNode): void {
        this.nodes.splice(this.findDialogueNodeIndex(node), 1);
    }


    public findRepeatNodeIndex(node: RepeatNode): number {
        return this.repeatNodes.findIndex((other: RepeatNode) => other.guid === node.guid);
    }

    public addRepeatNode(node: RepeatNode): void {
        this.repeatNodes.push(node);
    }

    public updateRepeatNode(node: RepeatNode): void {
        this.repeatNodes[this.findRepeatNodeIndex(node)] = node;
    }

    public removeRepeatNode(node: RepeatNode): void {
        this.repeatNodes.splice(this.findRepeatNodeIndex(node), 1);
    }
}