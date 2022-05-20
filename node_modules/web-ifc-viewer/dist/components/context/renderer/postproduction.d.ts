import { WebGLRenderer } from 'three';
import { Context } from '../../../base-types';
export declare class IfcPostproduction {
    private context;
    ssaoEffect: any;
    renderer: WebGLRenderer;
    composer: any;
    constructor(context: Context, canvas: HTMLElement);
    get domElement(): HTMLCanvasElement;
    render(): void;
    setSize(width: number, height: number): void;
    private setupEvents;
}
