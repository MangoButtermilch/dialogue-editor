using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;
using System.IO;

namespace Acetix.Dialogue {

    public class DialogueLoader : MonoBehaviour {

        [SerializeField] private string _fileName = "test-dialogue-export";
        private readonly string _folderPath = Application.streamingAssetsPath + "/dialogues/";
        private readonly string _fileExtension = ".json";
        private Dialogue _dialogue = null;

        private void Awake() {
            DialogueEventBus.Publish(DialogueEventBusType.IDLE);
            Load();
        }

        private void Load() {
            DialogueEventBus.Publish(DialogueEventBusType.LOADING);

            string file = _folderPath + _fileName + _fileExtension;

            using (StreamReader r = new StreamReader(file)) {
                string json = r.ReadToEnd();
                Dialogue dialogue = JsonConvert.DeserializeObject<Dialogue>(json);
                _dialogue = dialogue;
                DialogueEventBus.Publish(DialogueEventBusType.LOADING_DONE);
            }
        }

        public Dialogue GetDialogue() {
            return _dialogue;
        }
    }
}