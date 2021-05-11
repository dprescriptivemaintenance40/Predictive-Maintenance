import { Component } from "@angular/core";
import { MessageService} from 'primeng/api';
import { RCAModel } from './rca-model'
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
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
    public UserId: string = ""; 
    public SelectBoxEnabled: boolean = true
    public SelectUpdateBoxEnabled: boolean = true
    public SelectedTagNumber : string = ""
    public RCARecords: any = [];
    public cancel: boolean  = false
    public update: boolean  = false
    public save: boolean  = false
    public rcaOBJ: RCAModel = new RCAModel();

    constructor(private messageService: MessageService,
                public commonLoadingDirective: CommonLoadingDirective,
                private http: HttpClient,
                public router: Router,) {
       
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
        localStorage.setItem('RCATestingOBj', JSON.stringify(this.files))    
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
        this.save= true
        }else{
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please Add Tag number" })  
        }
    }
    Cancel(){
        this.files[0].children=[]  
    }

    Save(){
    this.rcaOBJ.RCAID = 0;
    this.rcaOBJ.UserId = this.UserId;
    this.rcaOBJ.TagNumber = this.TagNumber
    this.rcaOBJ.RCACompletionPercentage = 60
    this.rcaOBJ.RCATree = JSON.stringify(this.files)
    this.http.post<any>('api/RCAAPI/SaveNewRCA',this.rcaOBJ)
     .subscribe(
        res => {
            console.log(res);
            this.messageService.add({ severity: 'success', summary: 'Sucess', detail: 'Successfully Done' });
        }, error =>{ console.log(error.error)}
      )
    }

    UpdateTagNumberSelect(){
        this.UpdateTreeshow= true;
        this.SelectUpdateBoxEnabled = false
        this.update = true
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