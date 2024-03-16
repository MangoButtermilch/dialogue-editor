import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Character, Choice, ConditionNode, ConditionType, Dialogue, DialogueNode, EventNode, Port, RandomNode, RepeatNode, Variable, VariableType } from 'src/models/models';
import { CharacterExport, ChoiceExport, ConditionNodeExport, DialogeNodeExport, DialogueExport, DialogueExportElementType, EventNodeExport, PossibilityExport, RandomNodeExport, RepeatNodeExport, VariableExport } from 'src/models/models.export';
import { DialogueService } from '../dialogue/dialogue.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private dialogue$: Observable<Dialogue> = this.dialogueService.getDialoge();

  constructor(private dialogueService: DialogueService) { }

  /**
   * Plain JSON export with default models
   */
  public saveToJson(): void {
    this.dialogue$.subscribe((dialoge: Dialogue) => {
      this.downloadJSON(dialoge, dialoge.name);
    }).unsubscribe();
  }

  /**
   * JSON Export for game engines with export models.
   * Easier to traverse in game engines and procudes smaller file sizs.
   */
  public exportForEngine(): void {

    this.dialogue$.subscribe((dialogue: Dialogue) => {
      const exportDialogue: DialogueExport = new DialogueExport(dialogue.name, dialogue.guid, dialogue.dateTime);

      exportDialogue.characters = this.convertCharactersForExport(dialogue.characters);
      exportDialogue.variables = this.convertVariablesForExport(dialogue.variables);
      exportDialogue.root = this.getExportDialogueRootNode(dialogue);
      this.findChoicesRecursivleyForExport(dialogue, exportDialogue.choices);
      this.findDialogueNodesRecursivleyForExport(dialogue, exportDialogue.dialogueNodes);
      this.findConditionsRecursivleyForExport(dialogue, exportDialogue.conditionNodes);
      this.findRandomNodesRecursivleyForExport(dialogue, exportDialogue.randomNodes);
      this.findEventsRecursivleyForExport(dialogue, exportDialogue.eventNodes);
      this.findRepeatNodesRecursivleyForExport(dialogue, exportDialogue.repeatNodes);

      this.downloadJSON(exportDialogue, exportDialogue.name.concat("-export"));
    }).unsubscribe();
  }

  private getExportDialogueRootNode(dialoge: Dialogue): DialogeNodeExport {

    const rootNode = dialoge.nodes.find((node: DialogueNode) => node.isRoot === true);

    const exportRootNode: DialogeNodeExport = new DialogeNodeExport(
      rootNode.guid,
      DialogueExportElementType.DIALOGUE_NODE,
      rootNode.character.guid,
      rootNode.label,
      rootNode.content,
      this.getNodeChoiceGuids(rootNode)
    );
    return exportRootNode;
  }

  /**
   * @returns string array of choice guids for given node
   */
  private getNodeChoiceGuids(node: DialogueNode): string[] {
    const guids: string[] = [];

    for (let choice of node.choices) {
      guids.push(choice.guid);
    }
    return guids;
  }

  private findRepeatNodesRecursivleyForExport(iteratable: any, repeatNodes: RepeatNodeExport[]) {
    for (const key in iteratable) {
      const value = iteratable[key];
      const isIteratable = (typeof (value) === "object");
      if (!isIteratable) continue;

      this.findRepeatNodesRecursivleyForExport(value, repeatNodes);

      const isRepeatNode = value instanceof RepeatNode;
      if (!isRepeatNode) continue;

      const hasRepeatNode = repeatNodes.some((other: RepeatNodeExport) => other.guid === value.inPort.guid);
      if (hasRepeatNode) continue;
      repeatNodes.push({
        guid: value.inPort.guid,
        type: DialogueExportElementType.REPEAT_NODE,
        repetitions: value.repetitions,
        guidToRepeat: this.getOutPortConnection(value.outPort)
      });
    }
  }

  private findEventsRecursivleyForExport(iteratable: any, events: EventNodeExport[]) {
    for (const key in iteratable) {
      const value = iteratable[key];
      const isIteratable = (typeof (value) === "object");
      if (!isIteratable) continue;

      this.findEventsRecursivleyForExport(value, events);

      const isEvent = value instanceof EventNode;
      if (!isEvent) continue;

      const hasEvent = events.some((other: EventNodeExport) => other.guid === value.inPort.guid);
      if (hasEvent) continue;
      events.push({
        guid: value.inPort.guid,
        type: DialogueExportElementType.EVENT_NODE,
        name: value.name,
        nextGuid: this.getOutPortConnection(value.outPort)
      });
    }
  }

  private findRandomNodesRecursivleyForExport(iteratable: any, randomNodes: RandomNodeExport[]) {
    for (const key in iteratable) {
      const value = iteratable[key];
      const isIteratable = (typeof (value) === "object");
      if (!isIteratable) continue;

      this.findRandomNodesRecursivleyForExport(value, randomNodes);

      const isRandomNode = value instanceof RandomNode;
      if (!isRandomNode) continue;

      const hasRandomNode = randomNodes.some((other: RandomNodeExport) => other.guid === value.inPort.guid);
      if (hasRandomNode) continue;
      randomNodes.push({
        guid: value.inPort.guid,
        type: DialogueExportElementType.RANDOM_NODE,
        possibilites: this.getRandomNodePossibilities(value)
      });
    }
  }

  private getRandomNodePossibilities(randomNode: RandomNode): PossibilityExport[] {
    const possibilites: PossibilityExport[] = [];

    for (const possibility of randomNode.possibilites) {
      possibilites.push({
        guid: possibility.guid,
        parentGuid: randomNode.guid,
        nextGuid: possibility.outPort.getConnections()[0]
      })
    }
    return possibilites;
  }

  private findDialogueNodesRecursivleyForExport(iteratable: any, nodes: DialogeNodeExport[]) {
    for (const key in iteratable) {
      const value = iteratable[key];
      const isIteratable = (typeof (value) === "object");
      if (!isIteratable) continue;

      this.findDialogueNodesRecursivleyForExport(value, nodes);

      const isNode = value instanceof DialogueNode;
      if (!isNode) continue;

      if (value.isRoot) continue;//root node is already defined in base export object

      const hasNode = nodes.some((other: DialogeNodeExport) => other.guid === value.inPort.guid);
      if (hasNode) continue;
      nodes.push({
        guid: value.inPort.guid,
        type: DialogueExportElementType.DIALOGUE_NODE,
        characterGuid: value.character.guid,
        label: value.label,
        content: value.content,
        choiceGuids: this.getNodeChoiceGuids(value)
      });
    }
  }

  private findConditionsRecursivleyForExport(iteratable: any, conditionNodes: ConditionNodeExport[]) {
    for (const key in iteratable) {
      const value = iteratable[key];
      const isIteratable = (typeof (value) === "object");
      if (!isIteratable) continue;

      this.findConditionsRecursivleyForExport(value, conditionNodes);

      const isCondition = value instanceof ConditionNode;
      if (!isCondition) continue;

      const hasCondition = conditionNodes.some((other: ConditionNodeExport) => other.guid === value.inPort.guid);
      if (hasCondition) continue;
      conditionNodes.push({
        guid: value.inPort.guid,
        type: DialogueExportElementType.CONDITION_NODE,
        conditionType: ConditionType.STR_EQUAL,
        variableGuid: value.variable.guid,
        expectedValue: value.expectedValue,
        nextGuidMachtes: value.outPortMatches.getConnections()[0],
        nextGuidFails: value.outPortFails.getConnections()[0]
      });
    }
  }

  private findChoicesRecursivleyForExport(iteratable: any, choices: ChoiceExport[]) {
    for (const key in iteratable) {
      const value = iteratable[key];
      const isIteratable = (typeof (value) === "object");
      if (!isIteratable) continue;

      this.findChoicesRecursivleyForExport(value, choices);

      const isChoice = value instanceof Choice;
      if (!isChoice) continue;

      const hasChoice = choices.some((other: ChoiceExport) => other.guid === value.guid);
      if (hasChoice) continue;
      choices.push({
        guid: value.guid,
        parentGuid: value.parentGuid,
        nextGuid: this.getOutPortConnection(value.outPort),
        content: value.content
      });
    }
  }

  private convertVariablesForExport(variables: Variable[]): VariableExport[] {
    const exportVars: VariableExport[] = [];

    for (const variable of variables) {
      exportVars.push({
        guid: variable.guid,
        name: variable.name,
        type: variable.type,
      });

      switch (variable.type) {
        case VariableType.BOOL: variable.value = false; break;
        case VariableType.NUM: variable.value = 0; break;
        case VariableType.TEXT: variable.value = ""; break;
      }
    }
    return exportVars;
  }

  private convertCharactersForExport(characters: Character[]): CharacterExport[] {
    const exportChars: CharacterExport[] = [];

    for (const char of characters) {
      exportChars.push({
        guid: char.guid,
        name: char.name
      });
    }
    return exportChars;
  }

  /**
   * Output Ports can only have 1 connection since their capacity is set to single.
   * @param outPort 
   * @returns Connected GUID for output
   */
  private getOutPortConnection(outPort: Port): string {
    return outPort.getConnections()[0];
  }

  /**
   * Creates a JSON file that will be downloaded by the browser to save a file.
   * @param jsonData 
   * @param filename 
   */
  private downloadJSON(jsonData: object, filename: string) {
    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
