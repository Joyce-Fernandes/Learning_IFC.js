import { LineSegments, EdgesGeometry } from 'three';
export class Edges {
    constructor(context) {
        this.context = context;
        this.threshold = 30;
        this.edges = {};
    }
    static setupModelMaterial(material) {
        material.polygonOffset = true;
        material.polygonOffsetFactor = 1;
        material.polygonOffsetUnits = 1;
    }
    getAll() {
        return Object.keys(this.edges);
    }
    get(name) {
        return this.edges[name];
    }
    // TODO: Implement ids to create filtered edges / edges by floor plan
    create(name, modelID, lineMaterial, material) {
        const model = this.context.items.ifcModels.find((model) => model.modelID === modelID);
        if (!model)
            return;
        const planes = this.context.getClippingPlanes();
        lineMaterial.clippingPlanes = planes;
        if (material)
            material.clippingPlanes = planes;
        this.setupModelMaterials(model);
        const geo = new EdgesGeometry(model.geometry, this.threshold);
        lineMaterial.clippingPlanes = this.context.getClippingPlanes();
        this.edges[name] = {
            edges: new LineSegments(geo, lineMaterial),
            originalMaterials: model.material,
            baseMaterial: material,
            model,
            active: false
        };
    }
    toggle(name, active) {
        const selected = this.edges[name];
        if (!selected)
            return;
        if (active === undefined)
            active = !selected.active;
        selected.active = active;
        if (active) {
            if (selected.baseMaterial)
                selected.model.material = selected.baseMaterial;
            selected.model.add(selected.edges);
            return;
        }
        if (selected.baseMaterial)
            selected.model.material = selected.originalMaterials;
        selected.model.remove(selected.edges);
    }
    setupModelMaterials(model) {
        if (Array.isArray(model.material)) {
            model.material.forEach((mat) => Edges.setupModelMaterial(mat));
            return;
        }
        Edges.setupModelMaterial(model.material);
    }
}
//# sourceMappingURL=edges.js.map