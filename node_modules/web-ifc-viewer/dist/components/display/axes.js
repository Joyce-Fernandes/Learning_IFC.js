import { AxesHelper } from 'three';
import { IfcComponent } from '../../base-types';
export class IfcAxes extends IfcComponent {
    constructor(context, size) {
        super(context);
        this.axes = new AxesHelper(size);
        this.axes.material.depthTest = false;
        this.axes.renderOrder = 2;
        const scene = context.getScene();
        scene.add(this.axes);
    }
}
//# sourceMappingURL=axes.js.map