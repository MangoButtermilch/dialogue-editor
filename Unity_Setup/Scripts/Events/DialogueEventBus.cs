using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Acetix.Events;

namespace Acetix.Dialogue {

    public enum DialogueEventBusType {
        IDLE, LOADING, LOADING_DONE, START_READING, END
    }

    public class DialogueEventBus : AbstractEventBus<DialogueEventBusType> { }
}