using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Acetix.Dialogue {

    public class DialogueReader : MonoBehaviour {

        private Dialogue _dialogue;

        private void OnEnable() {
            DialogueEventBus.Subscribe(DialogueEventBusType.LOADING_DONE, FetchDialogue);
            DialogueEventBus.Subscribe(DialogueEventBusType.START_READING, ReadDialogue);
        }

        private void OnDisable() {
            DialogueEventBus.Unsubscribe(DialogueEventBusType.LOADING_DONE, FetchDialogue);
            DialogueEventBus.Unsubscribe(DialogueEventBusType.START_READING, ReadDialogue);
        }

        private void FetchDialogue() {
            _dialogue = FindObjectOfType<DialogueLoader>().GetDialogue();
            DialogueEventBus.Publish(DialogueEventBusType.START_READING);
        }

        private void ReadDialogue() {
            DialogueNode currentNode = _dialogue.root;

            // Hier können Sie entsprechend des aktuellen Knotens die Aktionen im Spiel ausführen
            print("Character: " + _dialogue.FindCharacter(currentNode.characterGuid).name);
            print("Content: " + currentNode.content);
        }

    }

}