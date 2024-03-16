using System;
using System.Collections.Generic;

namespace Acetix.Dialogue {

    public class Character {
        public string guid { get; set; }
        public string name { get; set; }
    }

    public class Variable {
        public string guid { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public object value { get; set; }
    }

    public class Choice {
        public string guid { get; set; }
        public string parentGuid { get; set; }
        public string nextGuid { get; set; }
        public string content { get; set; }
    }

    public class DialogueNode {
        public string guid { get; set; }
        public string type { get; set; }
        public string characterGuid { get; set; }
        public string label { get; set; }
        public string content { get; set; }
        public List<string> choiceGuids { get; set; }
    }

    public class ConditionNode {
        public string guid { get; set; }
        public string type { get; set; }
        public string conditionType { get; set; }
        public string variableGuid { get; set; }
        public object expectedValue { get; set; }
        public string nextGuidMachtes { get; set; }
        public string nextGuidFails { get; set; }
    }

    public class Possibility {
        public string guid { get; set; }
        public string parentGuid { get; set; }
        public string nextGuid { get; set; }
    }

    public class RandomNode {
        public string guid { get; set; }
        public string type { get; set; }
        public List<Possibility> possibilites { get; set; }
    }

    public class EventNode {
        public string guid { get; set; }
        public string type { get; set; }
        public string name { get; set; }
        public string nextGuid { get; set; }
    }

    public class RepeatNode {
        public string guid { get; set; }
        public string type { get; set; }
        public int repetitions { get; set; }
        public string guidToRepeat { get; set; }
    }

    public class Dialogue {
        public string name { get; set; }
        public string guid { get; set; }
        public string dateTime { get; set; }
        public DialogueNode root { get; set; }
        public List<Character> characters { get; set; }
        public List<Variable> variables { get; set; }
        public List<Choice> choices { get; set; }
        public List<DialogueNode> dialogueNodes { get; set; }
        public List<ConditionNode> conditionNodes { get; set; }
        public List<RandomNode> randomNodes { get; set; }
        public List<EventNode> eventNodes { get; set; }
        public List<RepeatNode> repeatNodes { get; set; }

        public Character FindCharacter(string guid) => characters.Find(other => other.guid == guid);
        public Variable FindVariable(string guid) => variables.Find(other => other.guid == guid);
        public Choice FindChoice(string guid) => choices.Find(other => other.guid == guid);
        public DialogueNode FindDialogueNode(string guid) => dialogueNodes.Find(other => other.guid == guid);
        public ConditionNode FindConditionNode(string guid) => conditionNodes.Find(other => other.guid == guid);
        public RandomNode FindRandomNode(string guid) => randomNodes.Find(other => other.guid == guid);
        public EventNode FindEventNode(string guid) => eventNodes.Find(other => other.guid == guid);
        public RepeatNode FindRepeatNode(string guid) => repeatNodes.Find(other => other.guid == guid);
    }
}
