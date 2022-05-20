import { Group } from 'three';
import { Context, IfcComponent } from '../../base-types';
export declare class GLTFManager extends IfcComponent {
    private context;
    private loader;
    private GLTFModels;
    constructor(context: Context);
    load(modelID: number, url: string): Promise<void>;
    getModel(modelID: number): Group;
}
