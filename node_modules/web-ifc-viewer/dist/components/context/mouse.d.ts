import { Vector2 } from 'three';
import { IfcComponent, Context } from '../../base-types';
export declare class IfcMouse extends IfcComponent {
    position: Vector2;
    constructor(context: Context);
    private setupMousePositionUpdate;
}
