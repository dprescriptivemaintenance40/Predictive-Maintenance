import { Component } from "@angular/core";
import { MessageService} from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { Router } from '@angular/router';
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { PrescriptiveContantAPI } from "../Shared/prescriptive.constant";
import { ChangeDetectorRef } from "@angular/core";
import { fromEvent } from 'rxjs';
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
    files: any=[];
    Updatefiles: TreeNode[];
    selectedFile: any;
    public Treeshow: boolean= false;
    public UpdateTreeshow: boolean= false;
    public itemCount: number = 100;
    public TagNumber: string = "";
    public UserId: string = ""; 
    public SelectBoxEnabled: boolean = true
    public SelectUpdateBoxEnabled: boolean = true
    public UpdateSelectedTagNumber : string = ""
    public RCAListRecords: any = [];
    public UpdateTagNumberList : any = [];
    public UpdateRecordList : any = [];
    public ADDDataForPercentage : any = [];
    zoom = 1;
    altKeyPressed = false;

    constructor(private messageService: MessageService,
                public commonLoadingDirective: CommonLoadingDirective,
                private changeDetectorRef: ChangeDetectorRef,
                public router: Router,
                private commonBL : CommonBLService,
                private RCAAPIName :  PrescriptiveContantAPI) {
       this.files = [{
           id: this.itemCount,
           label: 'Bearing Damage',
           addTree: true,
           isParent : 'Yes',
           children: []
       }];
       this.ADDDataForPercentage.push(
        {
            id: this.itemCount,
            label: 'Bearing Damage',
            addTree: true,
            isParent : 'Yes',
            children: []
        }
       )    

    }
    ngOnInit() {
        this.getRecordsList();
        fromEvent(document, 'wheel').subscribe((event: any) => {
            console.log('lll');
            if (this.altKeyPressed) {
              let newZoom = this.zoom + event.deltaY / 500;
              this.setZoom(newZoom);
            }
          });
          fromEvent(document, 'keydown.control').subscribe((event: any) => {
            this.altKeyPressed = true;
          });
          fromEvent(document, 'keyup.control').subscribe((event: any) => {
            this.altKeyPressed = false;
          });  
    }

    setZoom(value: number) {
        console.log('setting zoom ' + this.zoom.toString());
        this.zoom = value;
      }

    getRecordsList(){
        this.commonBL.getWithoutParameters(this.RCAAPIName.RCAGetAPI)
        .subscribe(
            (res: any) => { 
                this.RCAListRecords = res
                this.RCAListRecords.forEach(element => {
                   this.UpdateTagNumberList.push(element.TagNumber)
                }); 
            }, err => {console.log(err.error)}
        )
    }

    addTreeRow(event) {
        this.itemCount++;
        let obj = {
            id: this.itemCount,
            label: "Why?",
            RCAFILE:'',
            icon: "pi pi-image",
            addTree: true,
            children: []
        }
       var id = obj.id; 
      if(event.isParent == 'Yes'){
        event.children.push(obj);
        this.ADDDataForPercentage.push(obj)
      }else if( event.label == 'Why?'){
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add Information in node" })  
      }else if( event.RCAFILE == ''){
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add attachment to node" })  
      }else if( event.label == ''){
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add information to node" })  
      }else if( event.RCAFILE != '' && event.label != 'Why?'){
        event.children.push(obj);
        this.ADDDataForPercentage.push(obj)
      }
    }

    deleteTreeRow(event) {        
        this.containsInNestedObjectDF(this.files, event.id);
    }

    rCAAttachment(event){

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
            var TagNo : any;
            TagNo = this.RCAListRecords.find(r => r['TagNumber'] === this.TagNumber)
                if(TagNo == undefined){
                    this.Treeshow= true;
                    this.SelectBoxEnabled = false
                }else if (TagNo.TagNumber == this.TagNumber){
                    this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Tag number already Exist" })  
                }
    
        
        }else{
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please Add Tag number" })  
        }
    }
    CancelADDRCA(){
        this.Treeshow = false
        this.SelectBoxEnabled = true
        this.files=[]  
        this.files = [{
            id: this.itemCount,
            label: 'Bearing Damage',
            addTree: true,
            isParent : 'Yes',
            children: []
        }];
    }

    Save(){
    
    let RCAOBJ = {
        RCAID : 0 ,
        TagNumber : this.TagNumber,
        RCACompletionPercentage : 60,
        RCATree : JSON.stringify(this.files)
    }
    
    this.commonBL.postWithoutHeaders(this.RCAAPIName.RCASaveAPI, RCAOBJ)
     .subscribe(
        res => {
            this.getRecordsList();
            this.messageService.add({ severity: 'success', summary: 'Sucess', detail: 'Successfully Done' });
        }, error =>{ console.log(error.error)}
      )
    }

    UpdateTagNumberSelect(){
        if(this.UpdateSelectedTagNumber.length>0){
        this.RCAListRecords.forEach(element => {
            if(element.TagNumber == this.UpdateSelectedTagNumber){
               this.Updatefiles = JSON.parse(element.RCATree)
               this.UpdateRecordList.push(element)
            }
        });
        
        this.UpdateTreeshow= true;
        this.SelectUpdateBoxEnabled = false
    }else{
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: " Choose Tag number" })   
    }
    }

    UpdateaddTreeRow(event) {
        this.itemCount++;
        let obj = {
            id: this.itemCount,
            label: "Why?",
            RCAFILE:'',
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

    uploadRCAAttachment(event){
        var FileEvent = event[0]
        var TreeNode = event[1]
        var RCAFILEChange = this.ADDDataForPercentage.find(data => data['id'] == TreeNode.id)
        if (FileEvent.target.files.length > 0) {
            if (FileEvent.target.files[0].type === 'application/pdf'
              || FileEvent.target.files[0].type === 'image/png'
              || FileEvent.target.files[0].type === 'image/jpeg') {
              let fileToUpload = FileEvent.target.files[0];
              const formData = new FormData();
              formData.append('file', fileToUpload, fileToUpload.name);
              var url : string =  this.RCAAPIName.FMEAFileUpload
              this.commonBL.postWithoutHeaders(url,formData)
              .subscribe(
                    (res: any) => {
                        TreeNode.RCAFILE = JSON.stringify(res)
                        this.Treeshow = false
                        this.changeDetectorRef.detectChanges()
                        this.Treeshow = true
                        if(RCAFILEChange !== undefined){
                            var i = this.ADDDataForPercentage.findIndex(std => std.id == RCAFILEChange.id);
                            this.ADDDataForPercentage[i].RCAFILE = JSON.stringify(res)
                        }
                        this.messageService.add({ severity: 'success', summary: 'success', detail: "Sucessfully attached" })
           
                    }, 
                    err => { console.log(err.error) });
            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "Only Pdf's and Images are allowed" })
            }
          }
    }

    CheckData(){
        var labels =  this.files.find(a => a['label'])
        var Data = this.files.find(a => a['label'] == 'Why?')
    }

}