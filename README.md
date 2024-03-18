# Dialogue Editor

Made with Angular 17.3.0 (previously 15.2.2)

Prototype for generating non-linear dialogues in games.

## Live demo: https://dialogue-editor.buttermilch-dev.de/

## Screenshot:

![Zoom-Out](https://raw.githubusercontent.com/MangoButtermilch/dialogue-editor/main/screenshots/example-dialogue-zoom-out.png)

## TODO
- Unity package as example on how to traverse the dialogue in a game
- Localization
- Undo/redo actions
- adding more nodes
- rework UI design


## Features
- custom variables and conditions
- custom characters
- different types of nodes such as events, comments etc.
- JSON import + export
- C# setup for parsing the dialogue in the Unity Engine

## Controls explained

### Toolbar
- Origin button - Reset view to Origin
- Save button - Save dialogue as JSON file for loading it again later
- Export button - Export optimized JSON dialogue for engines
### Mouse:
- mouse wheel - Zoom in and out
- click mouse wheel - Pan viewport
- mouse right click - Open context menu
- hover + double click on connections - Delete connections

## Using dialogue JSON files
- files created via save button are used for loading inside the editor [(example file)](https://github.com/MangoButtermilch/dialogue-editor/blob/main/example_files/My-Dialogue.json)

- files created via export button can be used inside your engine. The are easier to traverse and contain only necessary data [(example C# setup for Unity,](https://github.com/MangoButtermilch/dialogue-editor/tree/main/Unity_Setup/Scripts) [example JSON file for import)](https://github.com/MangoButtermilch/dialogue-editor/blob/main/example_files/My-Dialogue-export.json)


