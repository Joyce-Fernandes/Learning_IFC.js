import { Vector3 } from 'three';
export declare class Animator {
    readonly transformer: any;
    constructor();
    move(vector: Vector3, transform: Vector3, duration?: number, delay?: number): void;
}
