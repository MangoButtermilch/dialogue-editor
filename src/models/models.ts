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

/**
 * Does not include variables and characters since they are defined by an interface
 */
export enum DialogeIteratableProperty {
    NODES = "NODES",
    COMMENTS = "COMMENTS",
    EVENTS = "EVENTS",
    CONDITIONS = "CONDITIONS",
    RANDOMNODES = "RANDOMNODES",
    REPEATNODES = "REPEATNODES",
}

export enum NotificationType {
    ERROR = "ERROR",
    WARNING = "WARNING",
    SUCCESS = "SUCCESS"
}

export class Notification {
    constructor(
        public message: string,
        public type: NotificationType,
        public guid: string
    ) { }
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
        public position: Vector2) { }
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

    public static fromImportedData(importedData: any): Choice {
        return new Choice(
            importedData.guid,
            importedData.position ?? { x: 0, y: 0 },
            importedData.parentGuid,
            importedData.outPort,
            importedData.content
        );
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

    public static fromImportedData(importedData: any): DialogueNode {
        return new DialogueNode(
            importedData.guid,
            importedData.position ?? { x: 0, y: 0 },
            importedData.character,
            importedData.label,
            importedData.content,
            importedData.isRoot,
            importedData.inPort,
            importedData.choices
        );
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

    public static fromImportedData(importedData: any): CommentNode {
        return new CommentNode(
            importedData.guid,
            importedData.position ?? { x: 0, y: 0 },
            importedData.color,
            importedData.content
        );
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

    public static fromImportedData(importedData: any): EventNode {
        return new EventNode(
            importedData.guid,
            importedData.position ?? { x: 0, y: 0 },
            importedData.name,
            importedData.inPort,
            importedData.outPort
        );
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

    public static fromImportedData(importedData: any): ConditionNode {
        return new ConditionNode(
            importedData.guid,
            importedData.position ?? { x: 0, y: 0 },
            importedData.type,
            importedData.inPort,
            importedData.outPortMatches,
            importedData.outPortFails,
            importedData.variable,
            importedData.expectedValue
        );
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

    public static fromImportedData(importedData: any): Possibility {
        return new Possibility(
            importedData.guid,
            importedData.position ?? { x: 0, y: 0 },
            importedData.parentGuid,
            importedData.outPort,
        );
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

    public static fromImportedData(importedData: any): RandomNode {
        return new RandomNode(
            importedData.guid,
            importedData.position ?? { x: 0, y: 0 },
            importedData.inPort,
            importedData.possibilites,
        );
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

    public static fromImportedData(importedData: any): RepeatNode {
        return new RepeatNode(
            importedData.guid,
            importedData.position ?? { x: 0, y: 0 },
            importedData.repetitions,
            importedData.inPort,
            importedData.outPort,
        );
    }
}

export class Dialogue {
    constructor(
        public name: string = "",
        public guid: string = "",
        public dateTime: string = "",
        public nodes: DialogueNode[] = [],
        public comments: CommentNode[] = [],
        public events: EventNode[] = [],
        public conditions: ConditionNode[] = [],
        public randomNodes: RandomNode[] = [],
        public repeatNodes: RepeatNode[] = [],
        public variables: Variable[] = [],
        public characters: Character[] = []
    ) { }

    /**
     * Used for loading JSON files.
     * Called directly after generateDialouge()
     * @param jsonStr 
     * @throws Error If JSON object is not of type Dialogue
     * @returns Dialouge object from JSON.
     */
    public static fromJsonData(jsonStr: string): Dialogue {
        const dialogue: Dialogue = new Dialogue();

        let jsonObj = JSON.parse(jsonStr);
        for (let prop in jsonObj) {

            if (dialogue[prop] === undefined) {
                throw new Error("Invalid JSON");
            }

            dialogue[prop] = jsonObj[prop];
        }
        return dialogue;
    }


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