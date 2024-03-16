import { ConditionType, VariableType } from "./models"

export enum DialogueExportElementType {
    DIALOGUE_NODE = "DIALOGUE_NODE",
    EVENT_NODE = "EVENT_NODE",
    REPEAT_NODE = " REPEAT_NODE",
    CONDITION_NODE = "CONDITION_NODE",
    RANDOM_NODE = "RANDOM_NODE",
}

export interface CharacterExport {
    guid: string
    name: string
}

export interface VariableExport {
    guid: string,
    name: string,
    type: VariableType,
    value?: string | number | boolean
}

export class ChoiceExport {

    constructor(
        public guid: string,
        public parentGuid: string,
        public nextGuid: string,
        public content: string
    ) { }
}

export class DialogeNodeExport {

    constructor(
        public guid: string,
        public type: DialogueExportElementType,
        public characterGuid: string,
        public label: string,
        public content: string,
        public choiceGuids: string[]
    ) { }
}

export class ConditionNodeExport {
    constructor(
        public guid: string,
        public type: DialogueExportElementType,
        public conditionType: ConditionType,
        public variableGuid: string,
        public expectedValue: boolean | number | string,
        public nextGuidMachtes: string,
        public nextGuidFails: string,
    ) { }
}

export class PossibilityExport {
    constructor(
        public guid: string,
        public parentGuid: string,
        public nextGuid: string
    ) { }
}

export class RandomNodeExport {

    constructor(
        public guid: string,
        public type: DialogueExportElementType,
        public possibilites: PossibilityExport[]
    ) { }
}

export class EventNodeExport {

    constructor(
        public guid: string,
        public type: DialogueExportElementType,
        public name: string,
        public nextGuid: string
    ) { }
}

export class RepeatNodeExport {
    constructor(
        public guid: string,
        public type: DialogueExportElementType,
        public repetitions: number,
        public guidToRepeat: string
    ) { }
}

export class DialogueExport {
    constructor(
        public name: string,
        public guid: string,
        public dateTime: string,
        public root: DialogeNodeExport = null,
        public characters: CharacterExport[] = [],
        public variables: VariableExport[] = [],
        public choices: ChoiceExport[] = [],
        public dialogueNodes: DialogeNodeExport[] = [],
        public conditionNodes: ConditionNodeExport[] = [],
        public randomNodes: RandomNodeExport[] = [],
        public eventNodes: EventNodeExport[] = [],
        public repeatNodes: RepeatNodeExport[] = [],
    ) { }
}
