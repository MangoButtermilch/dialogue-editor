import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { PanZoomModel } from 'ngx-panzoom';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { EdgeService } from 'src/app/services/dialogue/edge.service';
import { DomEventService } from 'src/app/services/dom/dom-event.service';
import { EditorStateService } from 'src/app/services/editor/editor-state.service';
import { PanZoomService } from 'src/app/services/editor/pan-zoom.service';
import { CanvasType, Choice, Edge, Port, Vector2 } from 'src/models/models';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {

  private initialized: boolean = false;
  private ctxStatic: any;
  private ctxDynamic: any;

  private lineWidth: number = 5;
  private lineOffset: number = 26.6;
  private lineColor: string = "#0d6efd";
  private lineHoverColor: string = "#40dfff";
  private canvasWidth: number = 0;
  private canvasHeight: number = 0;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private drawEdgesInterval: any = null;
  private drawLineToMouseInterval: any = null;
  private currentHoverEdge: Edge | null = null;

  private currentPort: Port | null = null;
  private renderEdges: Edge[] = [];

  private renderEdges$: Observable<Edge[]> = this.edgeService.getEdges()
    .pipe(takeUntil(this.destroy$));
  private portSelected$: Observable<Port | null> = this.editorStateService.onPortSelected()
    .pipe(takeUntil(this.destroy$));
  private draggingChoice$: Observable<Choice | null> = this.editorStateService.onChoiceDrag()
    .pipe(takeUntil(this.destroy$));
  private edgeDeleted$: Observable<Edge | null> = this.editorStateService.onEdgeDeleted()
    .pipe(takeUntil(this.destroy$));
  private domResize$: Observable<void> = this.domEventService.onDomResize()
    .pipe(takeUntil(this.destroy$));
  private panZoomChange$: Observable<PanZoomModel> = this.panZoomSerivce.panZoomConfig.modelChanged
    .pipe(takeUntil(this.destroy$));

  /**
   * HTML elements will first be fetched by guid in id attribute, then cached inside this Map.
   * Map key is the guid.
   */
  private elementIdCache: Map<string, HTMLElement> = new Map<string, HTMLElement>();
  /**
   * Lines will be drawn every x milliseconds
   */
  private readonly drawDelayMs = 16;

  constructor(
    private editorStateService: EditorStateService,
    private domEventService: DomEventService,
    private panZoomSerivce: PanZoomService,
    private edgeService: EdgeService
  ) { }

  ngOnInit(): void {

    //Update draw port edge when moving choice
    this.handleDraggingChoices();
    this.handleEdges();
    this.setupDrawEdgesInterval();
    this.setupDrawLineToMouseInterval();
  }

  ngAfterViewInit(): void {
    this.canvasSetup();
    this.handlePanZoomChange();
    this.handleWindowResize();
  }

  ngOnDestroy(): void {
    this.resetDrawEdgesInterval();
    this.resetDrawLineToMouseInterval();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Fetches edges from service to update the array of edges to render
   */
  private handleEdges(): void {
    this.renderEdges$.subscribe((edges: Edge[]) => {
      this.renderEdges = edges;
      //Needs to be cleared since new HTML elements have been created
      this.elementIdCache.clear();
      this.clear(CanvasType.STATIC);
    });

    this.edgeDeleted$.subscribe((edge: Edge | null) => {
      if (edge === null) return;
      this.currentHoverEdge = null;
    });
  }

  /**
   * Updates choice port element when a choice is being dragged.
   * CDK drag adds a preview element with the class cdk-drag-preview, that's where the choice port will be.
   * If no choice is dragged any more, the element will be same as before.
   */
  private handleDraggingChoices(): void {

    this.draggingChoice$.subscribe((choice: Choice | null) => {
      if (!choice) return;

      const isRenderingPortEdge: boolean = this.renderEdges.some(
        (edge: Edge) => edge.start.guid === choice.outPort.guid || edge.end.guid === choice.outPort.guid
      );
      if (!isRenderingPortEdge) {
        this.elementIdCache.set(choice.outPort.guid, document.getElementById(choice.outPort.guid));
        return;
      }

      const newInstance = document.querySelector("app-choice.cdk-drag-preview app-port");
      this.elementIdCache.set(choice.outPort.guid, newInstance as HTMLElement);
    });
  }

  /**
   * Draws connections between ports every x ms on the static canvas.
   */
  private setupDrawEdgesInterval(): void {
    if (this.drawEdgesInterval !== null) return;

    this.drawEdgesInterval =
      setInterval(() => {
        this.clear(CanvasType.STATIC);

        for (let edge of this.renderEdges) {
          this.evaluateIfEdgeIsHovered(edge);
          this.drawEdge(edge, CanvasType.STATIC);
        }
        
      }, this.drawDelayMs);
  }

  /**
   * Sets up interval for drawing a line to a mouse for every time a new port is selected.
   * Draws on dynamic canvas.
   */
  private setupDrawLineToMouseInterval(): void {
    this.portSelected$.subscribe((port: Port | null) => {
      this.currentPort = port;
      if (!port) {
        this.clear(CanvasType.DYNAMIC);
        this.resetDrawLineToMouseInterval();
        return;
      }

      //if clicked new port
      if (this.currentPort.guid !== port.guid) {
        this.resetDrawLineToMouseInterval();
      }

      if (this.drawLineToMouseInterval !== null) return;

      this.drawLineToMouseInterval =
        setInterval(() => {

          this.drawLine(
            this.getPortPosition(port),
            this.domEventService.getMousePosition(),
            CanvasType.DYNAMIC
          );

        }, this.drawDelayMs);
    });
  }

  /**
   * Use to draw line for an edge. This also considers is line is currently being hovered.
   * @param edge 
   * @param type 
   * @returns 
   */
  private drawEdge(edge: Edge, type: CanvasType): void {
    if (!this.getCtx(type) || !this.initialized) return;

    const from = this.getPortPosition(edge.start);
    const to = this.getPortPosition(edge.end);

    let xDir = type === CanvasType.DYNAMIC && this.domEventService.getMousePosition().x < this.currentPort.position.x ? -1 : 1;
    xDir = type === CanvasType.STATIC && from.x > to.x ? -1 : 1;

    const maxZoom = this.panZoomSerivce.panZoomConfig.zoomLevels;
    const currentZoomLevel = Math.ceil(this.panZoomSerivce.getZoomScale() + 1);
    const zoomratio = currentZoomLevel / maxZoom;
    const lineOffset = this.lineOffset * zoomratio;

    const isHovered = this.currentHoverEdge?.guid === edge.guid;

    this.getCtx(type).strokeStyle = isHovered ? this.lineHoverColor : this.lineColor;

    if (type === CanvasType.DYNAMIC) this.clear(type);
    this.getCtx(type).beginPath();
    this.getCtx(type).moveTo(from.x, from.y);
    this.getCtx(type).lineTo(from.x + (lineOffset * xDir), from.y);
    this.getCtx(type).lineTo(to.x - (lineOffset * xDir), to.y);
    this.getCtx(type).lineTo(to.x, to.y);
    this.getCtx(type).stroke();
  }

  /**
   * Use to draw line between 2 positions. Usually port and mouse
   */
  private drawLine(from: Vector2, to: Vector2, type: CanvasType): void {
    if (!this.getCtx(type) || !this.initialized) return;

    let xDir = type === CanvasType.DYNAMIC && this.domEventService.getMousePosition().x < this.currentPort.position.x ? -1 : 1;
    xDir = type === CanvasType.STATIC && from.x > to.x ? -1 : 1;

    const maxZoom = this.panZoomSerivce.panZoomConfig.zoomLevels;
    const currentZoomLevel = Math.ceil(this.panZoomSerivce.getZoomScale() + 1);
    const zoomratio = currentZoomLevel / maxZoom;
    const lineOffset = this.lineOffset * zoomratio;

    if (type === CanvasType.DYNAMIC) this.clear(type);
    this.getCtx(type).beginPath();
    this.getCtx(type).moveTo(from.x, from.y);
    this.getCtx(type).lineTo(from.x + (lineOffset * xDir), from.y);
    this.getCtx(type).lineTo(to.x - (lineOffset * xDir), to.y);
    this.getCtx(type).lineTo(to.x, to.y);
    this.getCtx(type).stroke();
  }

  private handleWindowResize(): void {
    this.domResize$.subscribe(() => {
      this.initialized = false;
      this.canvasSetup();
    });
  }

  private handlePanZoomChange(): void {
    this.panZoomChange$.subscribe((model: PanZoomModel) => {
      const maxZoomLevel = this.panZoomSerivce.panZoomConfig.zoomLevels;
      const zoomRatio = (model.zoomLevel + 1) / maxZoomLevel
      const lineWidth = this.lineWidth * zoomRatio;
      this.ctxStatic.lineWidth = lineWidth;
      this.ctxDynamic.lineWidth = lineWidth;
    });
  }

  private resetDrawEdgesInterval(): void {
    window.clearInterval(this.drawEdgesInterval);
    this.drawEdgesInterval = null;
  }

  private resetDrawLineToMouseInterval(): void {
    window.clearInterval(this.drawLineToMouseInterval);
    this.drawLineToMouseInterval = null;
  }

  private canvasSetup(): void {
    const canvasStatic: any = document.getElementById("static");
    const canvasDynamic: any = document.getElementById("dynamic");

    const computed = window.getComputedStyle(canvasStatic, null);

    canvasStatic.width = computed.width.replace("px", "");
    canvasStatic.height = computed.height.replace("px", "");

    canvasDynamic.width = computed.width.replace("px", "");
    canvasDynamic.height = computed.height.replace("px", "");

    this.canvasWidth = parseInt(computed.width.replace("px", ""));
    this.canvasHeight = parseInt(computed.width.replace("px", ""));

    this.ctxStatic = canvasStatic.getContext("2d");
    this.ctxStatic.lineWidth = this.lineWidth;
    this.ctxStatic.strokeStyle = this.lineColor;

    this.ctxDynamic = canvasDynamic.getContext("2d");
    this.ctxDynamic.lineWidth = this.lineWidth;
    this.ctxDynamic.strokeStyle = this.lineColor;

    this.initialized = true;
  }

  /**
   * https://stackoverflow.com/a/26080467
   */
  private drawArrow(ctx, fromx: number, fromy: number, tox: number, toy: number) {
    //variables to be used when creating the arrow
    const headlen = 10;
    const angle = Math.atan2(toy - fromy, tox - fromx);

    ctx.save();

    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of
    //the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7),
      toy - headlen * Math.sin(angle - Math.PI / 7));

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7),
      toy - headlen * Math.sin(angle + Math.PI / 7));

    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7),
      toy - headlen * Math.sin(angle - Math.PI / 7));

    //draws the paths created above
    ctx.stroke();
    ctx.restore();
  }

  private clear(type: CanvasType): void {
    if (!this.initialized) return;
    this.getCtx(type).clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private getCtx(type: CanvasType): any {
    return type === CanvasType.STATIC ? this.ctxStatic : this.ctxDynamic;
  }

  private evaluateIfEdgeIsHovered(edge: Edge): void {
    const isBeingHovered = this.isMouseOnEdge(edge);
    const canBeHovered = isBeingHovered && this.currentHoverEdge === null
    const isNoLongerHovered = !isBeingHovered && edge === this.currentHoverEdge;

    if (canBeHovered) {
      this.currentHoverEdge = edge;
      this.editorStateService.selectEdge(edge);
    } else if (isNoLongerHovered) {
      this.currentHoverEdge = null;
      this.editorStateService.deselectEdge();
    }
  }

  /**
   * https://stackoverflow.com/questions/17692922/check-is-a-point-x-y-is-between-two-points-drawn-on-a-straight-line
   * @returns true is mouse position is on an edge.
   */
  private isMouseOnEdge(edge: Edge): boolean {

    const mousePos: Vector2 = this.domEventService.getMousePosition();
    const edgeStart: Vector2 = this.getPortPosition(edge.start);
    const edgeEnd: Vector2 = this.getPortPosition(edge.end);

    const mouseToStart: Vector2 = {
      x: edgeStart.x - mousePos.x,
      y: edgeStart.y - mousePos.y
    };

    const mouseToEnd: Vector2 = {
      x: edgeEnd.x - mousePos.x,
      y: edgeEnd.y - mousePos.y
    };

    const startToEnd: Vector2 = {
      x: edgeEnd.x - edgeStart.x,
      y: edgeEnd.y - edgeStart.y
    }

    const lengthMouseToStart = Math.sqrt(mouseToStart.x * mouseToStart.x + mouseToStart.y * mouseToStart.y);
    const lengthMouseToEnd = Math.sqrt(mouseToEnd.x * mouseToEnd.x + mouseToEnd.y * mouseToEnd.y);
    const lengthStartToEnd = Math.sqrt(startToEnd.x * startToEnd.x + startToEnd.y * startToEnd.y);

    return (this.isApprox(lengthMouseToStart + lengthMouseToEnd, lengthStartToEnd, .2));
  }

  /**
   * @returns HTML Element center as Vector2 
   */
  private getPortPosition(port: Port): Vector2 {
    let el = this.elementIdCache.get(port.guid);

    if (!el) {
      el = document.getElementById(port.guid);
      this.elementIdCache.set(port.guid, el);
    }
    const rect = el.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  }


  /**
   * 
   * @param a 
   * @param b 
   * @param tolerance 
   * @returns true if a is approx to b with given tolerance
   */
  private isApprox(a: number, b: number, tolerance: number): boolean {
    return Math.abs(a - b) <= tolerance;
  }
}
