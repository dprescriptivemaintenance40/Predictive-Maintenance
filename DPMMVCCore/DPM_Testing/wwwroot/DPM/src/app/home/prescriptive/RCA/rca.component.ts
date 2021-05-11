import { Component } from "@angular/core";
import { MessageService} from 'primeng/api';
import { RCAModel } from './rca-model'
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
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
    Updatefiles: TreeNode[];
    selectedFile: any;
    public Treeshow: boolean= false;
    public UpdateTreeshow: boolean= false;
    public itemCount: number = 100;
    public TagNumber: string = "";
    public SelectBoxEnabled: boolean = true
    public SelectUpdateBoxEnabled: boolean = true
    public SelectedTagNumber : string = ""
    public RCARecords: any = [];
    public cancel: boolean  = false
    public add: boolean  = false
    public update: boolean  = false
    public rcaOBJ: RCAModel = new RCAModel();

    constructor(private messageService: MessageService,
                public commonLoadingDirective: CommonLoadingDirective,) {
       
            this.files = [{
            id: this.itemCount,
            label: 'Bearing Damage',
            addTree: true,
            children: []
        }];

        this.Updatefiles = [{
            id: this.itemCount,
            label: 'Breakdown',
            addTree: true,
            children: []
        }];
    }
    ngOnInit() {
    }
    async ngOnDestroy() {
        await localStorage.removeItem('RCATestingOBj');
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
        if (this.TagNumber.length > 0) {
        this.Treeshow= true;
        this.SelectBoxEnabled = false
        this.cancel= true;
        this.add= true;
        }else{
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please Add Tag number" })  
        }
    }
    Cancel(){
        this.files[0].children=[]  
    }
    Add(){
        var temp: string = JSON.stringify(this.files)
        var temp2 = JSON.parse(temp) 
        this.files[0].children.forEach((res: any) => {
            res.RCA = temp2
          })
          localStorage.setItem('RCATestingOBj', JSON.stringify(this.files))
          
    }

    UpdateTagNumberSelect(){
        this.UpdateTreeshow= true;
        this.SelectUpdateBoxEnabled = false
        this.update = true
        // if (this.SelectedTagNumber.length > 0) {
        //      this.UpdateTreeshow= true;
        //     this.SelectUpdateBoxEnabled = false
        //     }else{
        //         this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please Add Tag number" })  
        //     }
    }
    UpdateaddTreeRow(event) {
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

    UpdatedeleteTreeRow(event) {        
        this.containsInNestedObjectDF(this.Updatefiles, event.id);
    }
    UpdateRCA(){

    }
}