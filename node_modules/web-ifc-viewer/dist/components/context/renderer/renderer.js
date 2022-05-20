import { Color, Vector2, WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { IfcComponent } from '../../../base-types';
import { IfcPostproduction } from './postproduction';
export class IfcRenderer extends IfcComponent {
    constructor(context) {
        super(context);
        this.basicRenderer = new WebGLRenderer({ antialias: true });
        this.renderer2D = new CSS2DRenderer();
        this.renderer = this.basicRenderer;
        this.postProductionActive = false;
        this.context = context;
        this.container = context.options.container;
        this.setupRenderers();
        this.postProductionRenderer = new IfcPostproduction(this.context, this.basicRenderer.domElement);
        this.adjustRendererSize();
    }
    get usePostproduction() {
        return this.postProductionActive;
    }
    set usePostproduction(active) {
        if (this.postProductionActive === active)
            return;
        this.postProductionActive = active;
        this.renderer = active ? this.postProductionRenderer : this.basicRenderer;
        if (!active)
            this.restoreRendererBackgroundColor();
    }
    update(_delta) {
        const scene = this.context.getScene();
        const camera = this.context.getCamera();
        this.renderer.render(scene, camera);
        this.renderer2D.render(scene, camera);
    }
    getSize() {
        return new Vector2(this.basicRenderer.domElement.clientWidth, this.basicRenderer.domElement.clientHeight);
    }
    adjustRendererSize() {
        this.basicRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer2D.setSize(this.container.clientWidth, this.container.clientHeight);
        this.postProductionRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    newScreenshot(usePostproduction = false) {
        const scene = this.context.getScene();
        const camera = this.context.getCamera();
        this.renderer.render(scene, camera);
        const domElement = usePostproduction
            ? this.basicRenderer.domElement
            : this.postProductionRenderer.renderer.domElement;
        return domElement.toDataURL();
    }
    setupRenderers() {
        this.basicRenderer.localClippingEnabled = true;
        this.container.appendChild(this.basicRenderer.domElement);
        this.renderer2D.domElement.style.position = 'absolute';
        this.renderer2D.domElement.style.top = '0px';
        this.renderer2D.domElement.style.pointerEvents = 'none';
        this.container.appendChild(this.renderer2D.domElement);
    }
    restoreRendererBackgroundColor() {
        this.basicRenderer.setClearColor(new Color(0, 0, 0), 0);
    }
}
//# sourceMappingURL=renderer.js.map