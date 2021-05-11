import { Component } from "@angular/core";
export interface TreeNode<T = any> {
    id?: number;
    label?: string;
    addTree?: boolean;
    data?: T;
    icon?: string;
    expandedIcon?: any;
    collapsedIcon?: any;
    children?: TreeNode<T>[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: TreeNode<T>;
    partialSelected?: boolean;
    styleClass?: string;
    draggable?: boolean;
    droppable?: boolean;
    selectable?: boolean;
    key?: string;
}
@Component({
    templateUrl: './rca.component.html',
})
export class RCAComponent {
    files: TreeNode[];

    selectedFile: any;
    public Treeshow: boolean= false;
    public itemCount: number = 100;
    public SelectedTagNumber: string = ""
    public PrescriptiveTreeList: any = [];
    public SelectedPrescriptiveTree: any = [];
    public SelectBoxEnabled: boolean = true
    public TreeUptoFCA: any = [];
    public data1Clone: any;
    constructor() {
        this.files = [{
            id: this.itemCount,
            label: 'Bearing Damage',
            addTree: true,
            children: []
        }];
    }

    addTreeRow(event) {
        this.itemCount++;
        let obj = {
            id: this.itemCount,
            label: "Why?",
            icon: "pi pi-image",
            addTree: true,
            children: []
        }
        event.children.push(obj);
    }

    deleteTreeRow(event) {        
        this.containsInNestedObjectDF(this.files, event.id);
    }


    containsInNestedObjectDF(obj, val) {
        if (obj === val) {
            return true;
        }

        const keys = obj instanceof Object ? Object.keys(obj) : [];

        for (const key of keys) {

            const objval = obj[key];

            const isMatch = this.containsInNestedObjectDF(objval, val);

            if (isMatch) {
                if (Array.isArray(obj) && obj.length > 0) {
                    const deleteNode = obj.findIndex(a => a.id === val);
                    obj.splice(deleteNode, 1);
                    break;
                }
                return true;
            }
        }

        return false;
    }

    TagNumberSelect() {
        this.Treeshow= true;
        this.SelectBoxEnabled = false
       
    }
}