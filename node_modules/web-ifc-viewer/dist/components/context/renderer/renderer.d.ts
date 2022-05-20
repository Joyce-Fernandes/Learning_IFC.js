import { Vector2, WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { Context, IfcComponent } from '../../../base-types';
import { IfcPostproduction } from './postproduction';
export interface RendererAPI {
    domElement: HTMLElement;
    render(...args: any): void;
    setSize(width: number, height: number): void;
}
export declare class IfcRenderer extends IfcComponent {
    basicRenderer: WebGLRenderer;
    renderer2D: CSS2DRenderer;
    postProductionRenderer: IfcPostproduction;
    renderer: RendererAPI;
    postProductionActive: boolean;
    private readonly container;
    private readonly context;
    constructor(context: Context);
    get usePostproduction(): boolean;
    set usePostproduction(active: boolean);
    update(_delta: number): void;
    getSize(): Vector2;
    adjustRendererSize(): void;
    newScreenshot(usePostproduction?: boolean): string;
    private setupRenderers;
    private restoreRendererBackgroundColor;
}
