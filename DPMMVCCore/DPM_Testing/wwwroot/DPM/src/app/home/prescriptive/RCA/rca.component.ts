import { Component } from "@angular/core";
import { MessageService} from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { Router } from '@angular/router';
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { PrescriptiveContantAPI } from "../Shared/prescriptive.constant";
import { ChangeDetectorRef } from "@angular/core";
import { fromEvent } from 'rxjs';
import { HttpParams } from "@angular/common/http";
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
    Updatefiles: any[];
    selectedFile: any;
    public Treeshow: boolean= false;
    public UpdateTreeshow: boolean= false;
    public itemCount: number = 100;
    public RCAUpdateItemCount: number = 1000;
    public TagNumber: string = "";
    public RCALabel: string = "";
    public UserId: string = ""; 
    public SelectBoxEnabled: boolean = true
    public SelectUpdateBoxEnabled: boolean = true
    public UpdateSelectedTagNumber : string = ""
    public UpdateSelectedLabel : string = ""
    public RCAListRecords: any = [];
    public UpdateTagNumberList : any = [];
    public UpdateRecordList : any = [];
    public ADDDataForSaveAuth : any = [];
    public UpdateRCADataForSaveAuth : any = [];
    public AddRCAmodal : any;
    public ADDRCAMachineType : string = ""
    public ADDRCAFailureMode : string = ""
    public HeatExchangerFailureModeList : any = [];
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
           label: 'Problem Statement',
           addTree: true,
           update : '',
           operationalData : '',
           designData : '',
           isParent : 'Yes',
           children: []
       }];
       this.ADDDataForSaveAuth.push(
        {
            id: this.itemCount,
            label: 'Problem Statement',
            addTree: true,
            isParent : 'Yes',
            children: []
        }
       )    

    }
    ngOnInit() {
        this.getRecordsList();
        this.getHeatExchangerData();
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

    
    getHeatExchangerData(){
        const params = new HttpParams()
              .set("data", 'Heat Exchanger')
        this.commonBL.getWithParameters(this.RCAAPIName.RCAGetHeatExchangerFMAPI, params)
        .subscribe(
            (res : any) => {
                this.HeatExchangerFailureModeList = []
                res.forEach(element => {
                    this.HeatExchangerFailureModeList.push(element.Description)
                });
            }, err => {console.log(err.error)}
        )
    }

    getRecordsList(){
        this.commonBL.getWithoutParameters(this.RCAAPIName.RCAGetAPI)
        .subscribe(
            (res: any) => { 
                this.RCAListRecords = []
                this.UpdateTagNumberList = []
                this.RCAListRecords = res
                this.RCAListRecords.forEach(element => {
                   this.UpdateTagNumberList.push(element.RCALabel)
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
            addTree: true,
            deleteTree: true,
            children: []
        }
       var id = obj.id; 
      if(event.isParent == 'Yes' && ( event.label == 'Problem Statement' ||event.label == 'Problem' || event.label == 'Statement' || event.label == '')){
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add data to parent node" })  
      }else if(event.isParent == 'Yes' && (event.label != 'Why?' ||event.label != 'Why' || event.label != '?' || event.label != '')){
        event.children.push(obj);
        this.ADDDataForSaveAuth.push(obj)
      }else if(event.isParent == undefined && (event.label == 'Why?'||event.label == 'Why')){
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add data in node" })  
      }else if( event.isParent == undefined && event.RCAFILE == ''){
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add attachment to node" })  
      }else if( event.label == ''){
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add data to node" })  
      }else if(event.isParent == undefined && event.RCAFILE != '' && event.label != 'Why?'){
        event.children.push(obj);
        this.ADDDataForSaveAuth.push(obj)
      }
    }

    deleteTreeRow(event) {   
        if(event.RCAFILE !== ''){
            var fileDetails = JSON.parse(event.RCAFILE)
            const params = new HttpParams()
                  .set('fullPath', fileDetails.dbPath)
            this.commonBL.DeleteWithParam(this.RCAAPIName.RCAUpdateAttachment, params)
            .subscribe()
        }  
        this.containsInNestedObjectDF(this.files, event.id);
        var index = this.ADDDataForSaveAuth.findIndex(std => std.id == event.id);
        this.ADDDataForSaveAuth.splice(index, 1);
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
        if (this.TagNumber.length > 0 && this.RCALabel.length > 0) {
            var TagNo : any;
            TagNo = this.RCAListRecords.find(r => r['TagNumber'] === this.TagNumber && r['RCALabel'] === this.RCALabel)
                if(TagNo == undefined){
                    this.Treeshow= true;
                    this.SelectBoxEnabled = false
                }else if (TagNo.TagNumber == this.TagNumber && TagNo.RCALabel == this.RCALabel){
                    this.messageService.add({ severity: 'warn', summary: 'warn', detail: "RCA Label already Exist with same Tag number, please change Label name" })  
                }
    
        
        }else{
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "All fields are manditory" })  
        }
    }
    CancelADDRCA(){
        this.Treeshow = false
        this.SelectBoxEnabled = true
        this.files=[]  
        this.files = [{
            id: this.itemCount,
            label: 'Why?',
            addTree: true,
            isParent : 'Yes',
            children: []
        }];
    }


    RCAADDSave(){
        this.ADDDataForSaveAuth[0].label = this.files[0].label 
        var Data = this.ADDDataForSaveAuth.find(f => f['label'] === 'Why?' || f['label'] === 'Why' || f['label'] === '' || f['label'] ==='?' || f['label'] ===' ?');
        var RCAFILE = this.ADDDataForSaveAuth.find(f => f['RCAFILE'] === '');
        if(Data !== undefined){
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'please fill data to all nodes' });
          
        } else if(RCAFILE !== undefined){
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'please add attachment to all nodes' });
          
        }else if(Data == undefined && RCAFILE == undefined){
            this.files[0].update = JSON.stringify(this.ADDDataForSaveAuth);
            this.AddRCAmodal = document.getElementById("ADDRCAModal")
            this.AddRCAmodal.style.display = 'block'
        }
    }

    SaveAddRCAToDatabase(){
        if(this.ADDRCAMachineType.length > 0 && this.ADDRCAFailureMode.length > 0){
            let RCAOBJ = {
                RCAID : 0 ,
                TagNumber : this.TagNumber,
                RCALabel : this.RCALabel,
                RCATree : JSON.stringify(this.files),
                RCAFailureMode : this.ADDRCAFailureMode,
                RCAEquipment : this.ADDRCAMachineType
            }
            
            this.commonBL.postWithoutHeaders(this.RCAAPIName.RCASaveAPI, RCAOBJ)
            .subscribe(
                res => {
                    this.getRecordsList();
                    this.TagNumber = ""
                    this.RCALabel = ""
                    this.ADDRCAFailureMode = ""
                    this.ADDRCAMachineType = ""
                    this.closeRCAAddModal();
                    this.CancelADDRCA();
                    this.ADDDataForSaveAuth = []
                    this.messageService.add({ severity: 'success', summary: 'Sucess', detail: 'Successfully Done' });
                }, error =>{ console.log(error.error)}
            )

        }else {
            this.messageService.add({ severity: 'warn',  summary: 'warn', detail: 'Fill all details'})
        }
        
    }

    DeleteRCARecord(p) {
        const params = new HttpParams()
              .set('id', p.RCAID)
        this.commonBL.DeleteWithParam(this.RCAAPIName.RCADeleteAPI, params)
        .subscribe(
            (res: any) => {
                this.getRecordsList()
            }
        )
    }

    closeRCAAddModal(){
        this.AddRCAmodal.style.display = 'none'
    }

    UpdateTagNumberSelect(){
        if(this.UpdateSelectedLabel.length > 0){
        this.RCAListRecords.forEach(element => {
            if(element.RCALabel == this.UpdateSelectedLabel){
               this.Updatefiles = JSON.parse(element.RCATree)
               this.UpdateRCADataForSaveAuth = JSON.parse(this.Updatefiles[0].update);
               this.UpdateRecordList.push(element)
               this.ADDRCAFailureMode = element.RCAFailureMode
               this.ADDRCAMachineType = element.RCAEquipment
            }
        });
        
        this.UpdateTreeshow= true;
        this.SelectUpdateBoxEnabled = false
    }else{
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: " Choose RCA label" })   
    }
    }

    UpdateaddTreeRow(event) {
        this.RCAUpdateItemCount++;
        let obj = {
            id: this.RCAUpdateItemCount,
            label: "Why?",
            RCAFILE:'',
            addTree: true,
            deleteTree: true,
            children: []
        }
        event.children.push(obj);
        this.UpdateRCADataForSaveAuth.push(obj)
    }

    UpdatedeleteTreeRow(event) {        
        if(event.RCAFILE !== ''){
            var fileDetails = JSON.parse(event.RCAFILE)
            const params = new HttpParams()
                  .set('fullPath', fileDetails.dbPath)
            this.commonBL.DeleteWithParam(this.RCAAPIName.RCAUpdateAttachment, params)
            .subscribe()
        }  
        this.containsInNestedObjectDF(this.Updatefiles, event.id);
        var index = this.UpdateRCADataForSaveAuth.findIndex(std => std.id == event.id);
        this.UpdateRCADataForSaveAuth.splice(index, 1);
    }

    UpdateRCA(){
        this.UpdateRCADataForSaveAuth[0].label = this.Updatefiles[0].label 
        var Data = this.UpdateRCADataForSaveAuth.find(f => f['label'] === 'Why?' || f['label'] === 'Why' || f['label'] === '' || f['label'] ==='?' || f['label'] ===' ?');
        var RCAFILE = this.UpdateRCADataForSaveAuth.find(f => f['RCAFILE'] === '');
        if(Data !== undefined){
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'please fill data to all nodes' });
          
        } else if(RCAFILE !== undefined){
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'please add attachment to all nodes' });
          
        }else if(Data == undefined && RCAFILE == undefined){
                this.Updatefiles[0].update = JSON.stringify(this.UpdateRCADataForSaveAuth);
                let obj = {
                    RCAID : this.UpdateRecordList[0].RCAID,
                    TagNumber : this.UpdateRecordList[0].TagNumber,
                    RCATree : JSON.stringify(this.Updatefiles),
                    RCALabel : this.UpdateRecordList[0].RCALabel,
                    RCAEquipment : this.ADDRCAMachineType,
                    RCAFailureMode : this.ADDRCAFailureMode
                }
                this.commonBL.PutData(this.RCAAPIName.RCAUpdateAPI, obj)
                .subscribe(
                    res =>{ 
                        this.ADDRCAMachineType = "";
                        this.ADDRCAFailureMode = "";
                        this.UpdateTreeshow = false;
                        this.SelectUpdateBoxEnabled = true;
                        this.UpdateSelectedLabel = ""
                        this.Updatefiles = []
                        this.UpdateRCADataForSaveAuth = []
                        this.getRecordsList();
                    }
                )
        }
        
    }

    cancelRCAUpdate(){
        this.Updatefiles = []
        this.UpdateTreeshow = false;
        this.SelectUpdateBoxEnabled = true;
    }

    uploadRCAAttachment(event){
        var FileEvent = event[0]
        var TreeNode = event[1]
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
                        if(this.Treeshow){
                            this.Treeshow = false
                            this.changeDetectorRef.detectChanges()
                            this.Treeshow = true
                            this.messageService.add({ severity: 'success', summary: 'success', detail: "Sucessfully attached" })
               
                        }else if(this.UpdateTreeshow){
                            this.UpdateTreeshow = false
                            this.changeDetectorRef.detectChanges()
                            this.UpdateTreeshow = true
                            this.messageService.add({ severity: 'success', summary: 'success', detail: "Sucessfully attached" })
               
                        }
                        
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