import { IfcComponent, Context } from '../../base-types';
import { IfcManager } from '../ifc';
export declare class DropboxAPI extends IfcComponent {
    private tid?;
    private counter;
    private loader;
    constructor(context: Context, loader: IfcManager);
    loadDropboxIfc(): void;
    openDropboxChooser(options: any): void | null;
    private errorOnConnection;
    private onDBChooserSuccess;
    private getOptions;
    private onDBChooserCancel;
    private initializeAPI;
}
