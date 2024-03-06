import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { ToolbarComponent } from './editor/toolbar/toolbar.component';
import { CanvasComponent } from './editor/canvas/canvas.component';
import { ContextMenuComponent } from './editor/context-menu/context-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader';
import { NgxPanZoomModule } from 'ngx-panzoom';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BackgroundComponent } from './editor/background/background.component';
import { ChoiceComponent } from './dialogue/choice/choice.component';
import { CommentComponent } from './dialogue/comment/comment.component';
import { NodeComponent } from './dialogue/node/node.component';
import { PortComponent } from './dialogue/port/port.component';
import { ModalComponent } from './global/modal/modal.component';
import { HelpModalComponent } from './editor/help-modal/help-modal.component';
import { EventComponent } from './dialogue/event/event.component';
import { VariablePanelComponent } from './editor/variable-panel/variable-panel.component';
import { VariableComponent } from './editor/variable-panel/variable/variable.component';
import { ResizableComponent } from './global/resizable/resizable.component';
import { CharacterPanelComponent } from './editor/character-panel/character-panel.component';
import { ObserversModule } from '@angular/cdk/observers';
import { ConditionComponent } from './dialogue/condition/condition.component';
import { GuiElementComponent } from './global/gui-element/gui-element.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepeatComponent } from './dialogue/repeat/repeat.component';
import { RandomComponent } from './dialogue/random/random.component';
@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ToolbarComponent,
    CanvasComponent,
    ContextMenuComponent,
    BackgroundComponent,
    ChoiceComponent,
    CommentComponent,
    NodeComponent,
    PortComponent,
    ModalComponent,
    HelpModalComponent,
    EventComponent,
    VariablePanelComponent,
    VariableComponent,
    ResizableComponent,
    CharacterPanelComponent,
    ConditionComponent,
    GuiElementComponent,
    RepeatComponent,
    RandomComponent,
  ],
  imports: [
    NgxPanZoomModule,
    DragDropModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularSvgIconModule.forRoot(),
    AngularSvgIconPreloaderModule.forRoot({
      configUrl: './assets/icons.json',
    }),
    HttpClientModule,
    ObserversModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
