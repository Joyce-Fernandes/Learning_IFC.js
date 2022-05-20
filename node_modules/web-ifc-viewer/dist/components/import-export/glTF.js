import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { IfcComponent } from '../../base-types';
export class GLTFManager extends IfcComponent {
    constructor(context) {
        super(context);
        this.loader = new GLTFLoader();
        this.GLTFModels = {};
        this.context = context;
    }
    async load(modelID, url) {
        const loaded = (await this.loader.loadAsync(url));
        const mesh = loaded.scene;
        this.GLTFModels[modelID] = mesh;
        this.context.getScene().add(mesh);
    }
    getModel(modelID) {
        if (!this.GLTFModels[modelID]) {
            throw new Error('The requested GLTF model does not exist!');
        }
        return this.GLTFModels[modelID];
    }
}
//# sourceMappingURL=glTF.js.map