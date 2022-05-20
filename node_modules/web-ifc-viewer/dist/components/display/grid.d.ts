import { Color, GridHelper } from 'three';
import { IfcComponent, Context } from '../../base-types';
export declare class IfcGrid extends IfcComponent {
    grid: GridHelper;
    constructor(context: Context, size?: number, divisions?: number, colorCenterLine?: Color, colorGrid?: Color);
}
