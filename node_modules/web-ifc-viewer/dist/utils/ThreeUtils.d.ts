import * as THREE from 'three';
export declare function RightToLeftHand(vector: THREE.Vector3): THREE.Vector3;
export declare function stringToAxes(axesString: string): {
    negative: boolean;
    name: string;
}[] | null;
export declare function getBasisTransform(from: string, to: string, targetMatrix: THREE.Matrix4): void;
