import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { Router } from '@angular/router';
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { PrescriptiveContantAPI } from "../Shared/prescriptive.constant";
import { ChangeDetectorRef } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { ConfirmationService } from 'primeng/api';
import panzoom from 'panzoom';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFDocument } from 'pdf-lib';
import domtoimage from 'dom-to-image';
import { DomSanitizer } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
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
    text?:string;
    years?: number;
    hours?:number;
    ANDORLogic?:boolean;
    nodeType?:string;
}
@Component({
    selector: 'app-rca',
    templateUrl: './rca.component.html',
    providers: [ConfirmationService, MessageService]
})
export class RCAComponent {
    @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;
    @ViewChild('image') image;
    tree: RCAComponent;
    panZoomController;
    panZoomController1;
    panZoomController2;
    files: any = [];
    public Updatefiles: any[];
    public RCAUpdateQuantitivefiles: any[];
    selectedFile: any;
    public Treeshow: boolean = false;
    public UpdateTreeshow: boolean = false;
    public itemCount: number = 100;
    public RCAUpdateItemCount: number = 1000;
    public TagNumber: string = "";
    public RCALabel: string = "";
    public UserId: string = "";
    public SelectBoxEnabled: boolean = true
    public SelectUpdateBoxEnabled: boolean = true
    public UpdateSelectedTagNumber: string = ""
    public UpdateSelectedLabel: string = ""
    public RCAListRecords: any = [];
    public UpdateTagNumberList: any = [];
    public UpdateRecordList: any = [];
    public ADDDataForSaveAuth: any = [];
    public UpdateRCADataForSaveAuth: any = [];
    public AddRCAmodal: any;
    public ADDRCAMachineType: string = ""
    public ADDRCAFailureMode: string = ""
    public HeatExchangerFailureModeList: any = [];
    public RCADisplayLabel: string = ""
    public RCADisplayFile: any = []
    public tabView: boolean = true
    public currentZoomLevel: number;
    public currentZoomLevel1: number;
    public currentZoomLevel2: number;
    public UpdateFC: number = 1000
    private ADDRCANodeCount: number = 0
    private ADDRCAForSaveNodeCount: number = 0
    private UserDetails: any = []
    zoomLevels: number[];
    zoomLevels1: number[];
    zoomLevels2: number[];
    public RCAReportData: any = []
    public RCAReportTree: any = []
    public RCAReportDate: string = ""
    public RCAFILE: any = []
    public RCAReportRecommadtion: string = ""
    public RCAReportinputs: string = ""
    public RCAReportBodyEnabled: boolean = false
    public RCAReportfileds: boolean = false
    public RCAFileSafeUrl: any;
    public FileUrl: any;
    public RCAImageViewEnable: boolean = false
    public RCAPdfViewEnable: boolean = false
    public XYZ: any
    private UpdateAttachmentBuffer : any = [];
    public RCATypeQualititive : boolean = false;
    public RCATypeQuantitive : boolean = false;
    public finalRCATypeQualititive : boolean = false;
    public finalRCATypeQuantitive : boolean = false;
    public andOrItemCount?: number = 100;
    public ANDORLOGICTREE: TreeNode[] = [
        {
            id: this.andOrItemCount,
            label: 'Top Event',
            text: '',
            years: 0,
            hours: 0,
            expanded: true,
            ANDORLogic: true,
            children: [],
            nodeType: "TopEvent"
        }
    ];
    public FailureComponents: any[] = [];
    public FailureCause: any[] = [];
    public FailureModeNamesList: any[] = []

    constructor(private messageService: MessageService,
        public commonLoadingDirective: CommonLoadingDirective,
        private changeDetectorRef: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        public router: Router,
        private confirmationService: ConfirmationService,
        private commonBL: CommonBLService,
        private RCAAPIName: PrescriptiveContantAPI,
    ) { }
    ngOnInit() {
        this.addStartup();
        this.getRecordsList();
        this.getHeatExchangerData();
        this.getUserDetails();
    }

    getUserDetails() {
        this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
    }



    addStartup() {
        this.files = [{
            id: this.itemCount,
            label: '',
            addTree: true,
            currentStage: 'add',
            update: '',
            operationalData: '',
            disable: false,
            designData: '',
            isParent: 'Yes',
            children: []
        }];
        this.ADDDataForSaveAuth.push(
            {
                id: this.itemCount,
                label: '',
                currentStage: 'add',
                addTree: true,
                isParent: 'Yes',
                disable: false,
                children: []
            }
        )
    }
    getHeatExchangerData() {
        const params = new HttpParams()
            .set("data", 'Heat Exchanger')
        this.commonBL.getWithParameters(this.RCAAPIName.RCAGetHeatExchangerFMAPI, params)
            .subscribe(
                (res: any) => {
                    this.HeatExchangerFailureModeList = []
                    res.forEach(element => {
                        this.HeatExchangerFailureModeList.push(element.Description)
                    });
                }, err => { console.log(err.error) }
            )
    }

    getRecordsList() {
        this.commonBL.getWithoutParameters(this.RCAAPIName.RCAGetAPI)
            .subscribe(
                (res: any) => {
                    this.RCAListRecords = []
                    this.UpdateTagNumberList = []
                    this.RCAListRecords = res
                    this.RCAListRecords.forEach(element => {
                        this.UpdateTagNumberList.push(element.RCALabel)
                    });
                }, err => { console.log(err.error) }
            )
    }

    addTreeRow(event) {
        this.itemCount++;
        let obj = {
            id: this.itemCount,
            label: "",
            RCAFILE: '',
            currentStage: 'add',
            addTree: true,
            deleteTree: true,
            disable: false,
            children: []
        }
        if (event.isParent == 'Yes' && event.label == '') {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add problem statment to node" })
        } else if (event.isParent == 'Yes' && event.label != '') {
            event.children.push(obj);
            this.ADDDataForSaveAuth.push(obj)
        } else if (event.isParent == undefined && event.label == '') {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add data to node" })
        } else if (event.isParent == undefined && event.RCAFILE == '') {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add attachment to node" })
        } else if (event.label == '') {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add data to node" })
        } else if (event.isParent == undefined && event.RCAFILE != '' && event.label != '') {
            event.children.push(obj);
            this.ADDDataForSaveAuth.push(obj)
        }
    }

    deleteTreeRow(event) {
        this.containsInNestedObjectDF(this.files, event.id);
        var index = this.ADDDataForSaveAuth.findIndex(std => std.id == event.id);
        this.ADDDataForSaveAuth.splice(index, 1);
    }

    rCAAttachment(event) {

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
            var TagNo: any;
            TagNo = this.RCAListRecords.find(r => r['TagNumber'] === this.TagNumber && r['RCALabel'] === this.RCALabel)
            if (TagNo == undefined) {
                this.Treeshow = true;
                this.RCATypeQualititive= true;
                this.finalRCATypeQualititive = true;
                this.SelectBoxEnabled = false;
            } else if (TagNo.TagNumber == this.TagNumber && TagNo.RCALabel == this.RCALabel) {
                this.messageService.add({ severity: 'warn', summary: 'warn', detail: "RCA Label already Exist with same Tag number, please change Label name" })
            }


        } else {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "All fields are manditory" })
        }
    }
    CancelADDRCA() {
        this.Treeshow = false
        this.SelectBoxEnabled = true
        this.TagNumber = ""
        this.RCALabel = ""
        this.files = []
        this.itemCount = 100
        this.ADDDataForSaveAuth = []
        this.files = []
        this.addStartup();

    }

    RCACheckValidation(){
        this.ADDDataForSaveAuth[0].label = this.files[0].label
            var Data = this.ADDDataForSaveAuth.find(f => f['label'] === '');
            var RCAFILE = this.ADDDataForSaveAuth.find(f => f['RCAFILE'] === '');
            if (Data !== undefined) {
                this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'please fill data to all nodes' });
    
            } else if (RCAFILE !== undefined) {
                this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'please add attachment to all nodes' });
    
            } else if (Data == undefined && RCAFILE == undefined) {
                this.files[0].update = JSON.stringify(this.ADDDataForSaveAuth);
                this.AddRCAmodal = document.getElementById("ADDRCAModal")
                this.AddRCAmodal.style.display = 'block'
            }
    }

    RCAADDSave() {
        if(this.finalRCATypeQualititive === true && this.finalRCATypeQuantitive === true){
           this.RCACheckValidation();
        } else  if(this.finalRCATypeQuantitive === true){
        this.AddRCAmodal = document.getElementById("ADDRCAModal")
        this.AddRCAmodal.style.display = 'block'
        }else  if(this.finalRCATypeQualititive === true){
            this.RCACheckValidation();
        }
    }

    SaveADDRCAFilesToDatabase() {
        var RCAQualitativeTree :string = "";
        var RCAQuantitiveTree :string = "";
        var RCAQualitativeEquipment :string = "";
        var RCAQuantitiveEquipment :string = "";
        var RCAQualitativeFailureMode :string = "";
        var RCAQuantitiveFailureMode :string = "";
        if(this.RCATypeQualititive === true && this.RCATypeQuantitive === true){
            RCAQualitativeTree = JSON.stringify(this.files);
            RCAQuantitiveTree  = JSON.stringify(this.ANDORLOGICTREE),
            RCAQualitativeEquipment = this.ADDRCAMachineType;
            RCAQuantitiveEquipment  = this.ADDRCAMachineType;
            RCAQualitativeFailureMode  = this.ADDRCAFailureMode ;
            RCAQuantitiveFailureMode = this.ADDRCAFailureMode;
        }else if(this.RCATypeQualititive === true ){
            RCAQualitativeTree = JSON.stringify(this.files);
            RCAQuantitiveTree  = "None",
            RCAQualitativeEquipment = this.ADDRCAMachineType;
            RCAQuantitiveEquipment  = "None";
            RCAQualitativeFailureMode  = this.ADDRCAFailureMode ;
            RCAQuantitiveFailureMode = "None";
        }else if(this.RCATypeQuantitive === true ){
            RCAQualitativeTree = "None";
            RCAQuantitiveTree  = JSON.stringify(this.ANDORLOGICTREE),
            RCAQualitativeEquipment = "None";
            RCAQuantitiveEquipment  = this.ADDRCAMachineType;
            RCAQualitativeFailureMode  = "None" ;
            RCAQuantitiveFailureMode = this.ADDRCAFailureMode;
        }
        let RCAOBJ = {
            RCAID: 0,
            TagNumber: this.TagNumber,
            RCALabel: this.RCALabel,
            RCAQualitativeTree  : RCAQualitativeTree,
            RCAQuantitiveTree :RCAQuantitiveTree,
            RCAQualitativeEquipment :RCAQualitativeEquipment,
            RCAQuantitiveEquipment :RCAQuantitiveEquipment,
            RCAQualitativeFailureMode :RCAQualitativeFailureMode,
            RCAQuantitiveFailureMode :RCAQuantitiveFailureMode
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
                    this.itemCount = 100
                    this.files = []
                    this.andOrItemCount = 100;
                    this.ANDORLOGICTREE = [];
                    this.ANDORLOGICTREE = [{
                        id: this.andOrItemCount,
                        label: 'Top Event',
                        text: '',
                        years: 0,
                        hours: 0,
                        expanded: true,
                        ANDORLogic: true,
                        children: [],
                        nodeType: "TopEvent"
                    }];
                    this.RCATypeQualititive = false;
                    this.RCATypeQuantitive = false;
                    this.finalRCATypeQualititive = false;
                    this.finalRCATypeQuantitive = false;
                    this.addStartup();
                    this.messageService.add({ severity: 'success', summary: 'Sucess', detail: 'Successfully Done' });
                }, error => { console.log(error.error) }
            )
    }

    async SaveAddRCAToDatabase() {
        if(this.RCATypeQualititive === true){
            this.ADDRCANodeCount = 0;
            this.ADDRCAForSaveNodeCount = 0;
            await this.TraverseNestedJson(this.files, 'count')
            if (this.ADDRCAMachineType.length > 0 && this.ADDRCAFailureMode.length > 0) {
                await this.TraverseNestedJson(this.files, 'add')
    
            } else {
                this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Fill all details' })
            }
        } else {
            this.SaveADDRCAFilesToDatabase();
        }
    }

    async DeleteRCARecord(p) {
        var j = JSON.parse(p.RCATree)
        await this.TraverseNestedJson(j, 'delete')
        const params = new HttpParams()
            .set('id', p.RCAID)
        this.commonBL.DeleteWithParam(this.RCAAPIName.RCADeleteAPI, params)
            .subscribe(
                (res: any) => {
                    this.getRecordsList()
                }
            )
    }

    closeRCAAddModal() {
        this.AddRCAmodal.style.display = 'none'
    }

    RCAHandleChange(e) {
        if (e.index === 1) {
            this.Updatefiles = []
            this.cancelRCAUpdate();
        } else if (e.index === 2) {
            this.files = []
            this.CancelADDRCA();
        }
    }

    UpdateTagNumberSelect() {
        if (this.UpdateSelectedLabel.length > 0) {
            this.RCAListRecords.forEach(element => {
                if (element.RCALabel == this.UpdateSelectedLabel) {
                    this.UpdateRecordList = []
                    this.Updatefiles = JSON.parse(element.RCAQualitativeTree)
                    this.RCAUpdateQuantitivefiles = JSON.parse(element.RCAQuantitiveTree);
                    this.TraverseNestedJson(this.Updatefiles, 'update')
                    this.UpdateRCADataForSaveAuth = JSON.parse(this.Updatefiles[0].update);
                    this.UpdateRecordList.push(element)
                    this.ADDRCAFailureMode = element.RCAFailureMode
                    this.ADDRCAMachineType = element.RCAEquipment
                }
            });

            this.UpdateTreeshow = true;
            this.SelectUpdateBoxEnabled = false
        } else {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: " Choose RCA label" })
        }
    }

    UpdateaddTreeRow(event) {
        this.RCAUpdateItemCount++;
        let obj = {
            id: this.RCAUpdateItemCount,
            label: "",
            currentStage: 'update',
            RCAFILE: '',
            disable: false,
            addTree: true,
            deleteTree: true,
            children: []
        }
        event.children.push(obj);
        this.UpdateRCADataForSaveAuth.push(obj)
    }

    UpdatedeleteTreeRow(event) {
        if(event.currentStage === "update"){
            if (event.RCAFILE !== '') {
                event.RCAFILE.forEach(element => {
                    this.UpdateAttachmentBuffer.push(JSON.parse(element));
                });
            }
        }
        this.containsInNestedObjectDF(this.Updatefiles, event.id);
        var index = this.UpdateRCADataForSaveAuth.findIndex(std => std.id == event.id);
        this.UpdateRCADataForSaveAuth.splice(index, 1);
    }

    UpdateRCA() {
        this.UpdateRCADataForSaveAuth[0].label = this.Updatefiles[0].label
        var Data = this.UpdateRCADataForSaveAuth.find(f => f['label'] === '');
        var RCAFILE = this.UpdateRCADataForSaveAuth.find(f => f['RCAFILE'] === '');
        if (Data !== undefined) {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'please fill data to all nodes' });

        } else if (RCAFILE !== undefined) {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'please add attachment to all nodes' });

        } else if (Data == undefined && RCAFILE == undefined) {
            this.Updatefiles[0].update = JSON.stringify(this.UpdateRCADataForSaveAuth);
            if(this.UpdateAttachmentBuffer !== [] || this.UpdateAttachmentBuffer !== undefined){
                this.UpdateAttachmentBuffer.forEach(element => {
                    const params1 = new HttpParams()
                          .set('fullPath', element[0][0].dbPath)
                     this.commonBL.DeleteWithParam(this.RCAAPIName.RCAUpdateAttachment, params1)
                    .subscribe(
                        res =>{}, err=>{ console.log(err.error)}
                    ) 
                });
            }
            let obj = {
                RCAID: this.UpdateRecordList[0].RCAID,
                TagNumber: this.UpdateRecordList[0].TagNumber,
                RCATree: JSON.stringify(this.Updatefiles),
                RCALabel: this.UpdateRecordList[0].RCALabel,
                RCAEquipment: this.ADDRCAMachineType,
                RCAFailureMode: this.ADDRCAFailureMode
            }
            this.commonBL.PutData(this.RCAAPIName.RCAUpdateAPI, obj)
                .subscribe(
                    res => {
                        this.ADDRCAMachineType = "";
                        this.ADDRCAFailureMode = "";
                        this.UpdateTreeshow = false;
                        this.SelectUpdateBoxEnabled = true;
                        this.UpdateSelectedLabel = "";
                        this.Updatefiles = [];
                        this.UpdateRCADataForSaveAuth = [];
                        this.UpdateAttachmentBuffer = [] ;
                        this.getRecordsList();
                        this.RCAUpdateItemCount = 1000;
                    }
                )
        }

    }

    cancelRCAUpdate() {
        this.RCAUpdateItemCount = 1000;
        this.Updatefiles = []
        this.UpdateRCADataForSaveAuth = []
        this.UpdateTreeshow = false;
        this.SelectUpdateBoxEnabled = true;
    }


    async uploadRCAAttachment(event) {
        var FileEvent = event[0]
        var TreeNode = event[1]
        if (FileEvent.target.files.length > 0) {
            if (FileEvent.target.files[0].type === 'application/pdf'
                || FileEvent.target.files[0].type === 'image/png'
                || FileEvent.target.files[0].type === 'image/jpeg') {
                let fileToUpload = FileEvent.target.files[0];
                var prevName = FileEvent.target.files[0].name
                var ext = this.getFileExtension(prevName);
                this.UpdateFC + 1;
                var newName: string = `${this.UserDetails.UserId}_${this.UpdateRecordList[0].RCALabel}_${this.UpdateRecordList[0].TagNumber}_${TreeNode.id}_${this.UpdateFC}.${ext}`
                const formData = new FormData();
                formData.append('file', fileToUpload, newName);
                var url: string = this.RCAAPIName.FMEAFileUpload
                this.commonBL.postWithoutHeaders(url, formData)
                    .subscribe(
                        (res: any) => {
                            if (TreeNode.RCAFILE === '') {
                                var Data: any = [], Data1: any = [];
                                Data.push(res);
                                Data.push(prevName)
                                Data1.push(Data)
                                TreeNode.RCAFILE = [] 
                                TreeNode.RCAFILE.push(JSON.stringify(Data1));
                            } else if (TreeNode.RCAFILE !== '') {
                                var Data1: any = [];
                                var Data2: any = [];
                                var Data3: any = [];
                                TreeNode.RCAFILE.forEach(element => {
                                    Data1.push(element);
                                });

                                Data2.push(res);
                                Data2.push(prevName);
                                Data3.push(Data2)
                                Data1.push(JSON.stringify(Data3));
                                TreeNode.RCAFILE = Data1;
                            }
                            let RCAOBJ = {
                                RCAID: this.UpdateRecordList[0].RCAID,
                                RCATree: JSON.stringify(this.Updatefiles),
                                TagNumber: this.UpdateRecordList[0].TagNumber,
                                RCALabel: this.UpdateRecordList[0].RCALabel,
                                RCAEquipment: this.ADDRCAMachineType,
                                RCAFailureMode: this.ADDRCAFailureMode,
                            }
                            this.commonBL.PutData(this.RCAAPIName.RCAOnlyTreeSaveAPI, RCAOBJ)
                                .subscribe(
                                    res => { }, err => { console.log(err.error) }
                                )

                        },
                        err => { console.log(err.error) });
            } else {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "Only Pdf's and Images are allowed" })
            }
        }

    }

    RCATreeDisplay(p) {
        this.RCADisplayLabel = p.RCALabel
        this.RCADisplayFile = JSON.parse(p.RCATree)
        this.TraverseNestedJson(this.RCADisplayFile, 'disable')
    }

    CloseRCATreeDisplay() {
        this.RCADisplayFile = []
    }


    async TraverseNestedJson(val: any, fun: string) {
        if( fun ==='add' && val[0].id === 100 && val[0].children.length == 0){
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "To Save Qualititive tree, it should require minimum one node except problem statement " });
        }
        for (let index = 0; index < val.length; index++) {
            if (fun === 'count') {
                this.ADDRCANodeCount = this.ADDRCANodeCount + 1;
            }
            if (fun === 'delete') {
                if (val[index].RCAFILE !== undefined && val[index].RCAFILE !== '') {
                    var deleteAttachment: any = []
                    val[index].RCAFILE.forEach(element => {
                        deleteAttachment.push(JSON.parse(element))
                    });
                    deleteAttachment.forEach(element => {
                        const paramsFile = new HttpParams()
                            .set('fullPath', element[0][0].dbPath)
                        this.commonBL.DeleteWithParam(this.RCAAPIName.RCAUpdateAttachment, paramsFile)
                            .subscribe(
                                res => {

                                }, error => { console.log(error.error) }
                            )
                    });

                }

            }
            if (fun === 'disable') {
                val[index].addTree = false;
                val[index].deleteTree = false;
                val[index].disable = true;
            } else if (fun === 'update') {
                val[index].currentStage = 'update';
            } else if (fun === 'add') {
                this.ADDRCAForSaveNodeCount = this.ADDRCAForSaveNodeCount + 1;
                if (val[index].RCAFILE !== undefined && val[index].RCAFILE !== '') {
                    let filess = val[index].RCAFILE
                    var FC: number = 1;
                    for (let FI = 0; FI < filess.length; FI++) {
                        var prevName = filess[FI][0].target.files[0].name
                        var ext = this.getFileExtension(prevName);
                        var newName: string = `${this.UserDetails.UserId}_${this.RCALabel}_${this.TagNumber}_${val[index].id}_${FC}.${ext}`
                        var f: any = []
                        f.push(filess[FI][0]);
                        f.push(newName);
                        f.push(filess[FI][2])
                        f.push(FI)
                        f.push(val[index])
                        let ff = f;
                        var res = await this.ADDRCAUploadAttachment(ff);
                        var abc: any = [], abc2: any = []
                        abc.push(res);
                        abc.push(f[2]);
                        abc2.push(abc);
                        var q = f[4].RCAFILE;
                        q[f[3]] = JSON.stringify(abc2);
                        val[index].RCAFILE = q;
                        FC = FC + 1;
                        if (this.ADDRCANodeCount === this.ADDRCAForSaveNodeCount) {
                            this.SaveADDRCAFilesToDatabase();
                        }
                    }

                }
            }
            if (val[index].children.length > 0) {
                var Data: any = val[index].children;
                for (let index1 = 0; index1 < Data.length; index1++) {
                    if (fun === 'count') {
                        this.ADDRCANodeCount = this.ADDRCANodeCount + 1;
                    }
                    if (fun === 'delete') {
                        if (Data[index1].RCAFILE !== undefined && Data[index1].RCAFILE !== '') {
                            var deleteAttachment: any = []
                            Data[index1].RCAFILE.forEach(element => {
                                deleteAttachment.push(JSON.parse(element))
                            });
                            deleteAttachment.forEach(element => {
                                const paramsFile = new HttpParams()
                                    .set('fullPath', element[0][0].dbPath)
                                this.commonBL.DeleteWithParam(this.RCAAPIName.RCAUpdateAttachment, paramsFile)
                                    .subscribe(res =>{}, err=>{ console.log(err.error)})
                            });

                        }

                    }
                    if (fun === 'disable') {
                        Data[index1].addTree = false;
                        Data[index1].deleteTree = false;
                        Data[index1].disable = true;
                    } else if (fun === 'update') {
                        Data[index1].currentStage = 'update';
                    } else if (fun === 'add') {
                        this.ADDRCAForSaveNodeCount = this.ADDRCAForSaveNodeCount + 1;
                        if (Data[index1].RCAFILE !== undefined && Data[index1].RCAFILE !== '') {
                            let filess = Data[index1].RCAFILE
                            var FC: number = 1;
                            for (let FI = 0; FI < filess.length; FI++) {
                                var prevName = filess[FI][0].target.files[0].name
                                var ext = this.getFileExtension(prevName);
                                var newName: string = `${this.UserDetails.UserId}_${this.RCALabel}_${this.TagNumber}_${Data[index1].id}_${FC}.${ext}`
                                var fz: any = [];
                                fz.push(filess[FI][0]);
                                fz.push(newName);
                                fz.push(filess[FI][2])
                                fz.push(FI)
                                fz.push(Data[index1])
                                let ff = fz;
                                var res = await this.ADDRCAUploadAttachment(ff);
                                var abc: any = [], abc2: any = []
                                abc.push(res);
                                abc.push(ff[2]);
                                abc2.push(abc);
                                var q = ff[4].RCAFILE;
                                q[ff[3]] = JSON.stringify(abc2);
                                Data[index1].RCAFILE = q;
                                FC = FC + 1;
                                if (this.ADDRCANodeCount === this.ADDRCAForSaveNodeCount) {
                                    this.SaveADDRCAFilesToDatabase();
                                }
                            }

                        }
                    }
                    if (Data[index1].children.length > 0) {
                        var Data2 = Data[index1].children
                        for (let index3 = 0; index3 < Data2.length; index3++) {
                            var d = []
                            d.push(Data2[index3])
                            this.TraverseNestedJson(d, fun)
                        }
                    }
                }
            }

        }

    }


    RCAReport(p) {
        this.RCAReportfileds = false
        this.RCAReportDate = moment().format('YYYY-MM-DD');
        this.RCAReportBodyEnabled = false
        this.RCAReportData = []
        this.RCAReportTree = []
        this.RCAReportData = p
        this.RCAReportTree = JSON.parse(p.RCATree)
        this.TraverseNestedJson(this.RCAReportTree, "disable");
        this.RCAReportBodyEnabled = true
        this.changeDetectorRef.detectChanges()

    }



    RCAReportDownload() {
        this.changeDetectorRef.detectChanges()
        this.commonLoadingDirective.showLoading(true, 'Downloading....');
        if (this.RCAReportRecommadtion.length > 0 && this.RCAReportinputs.length > 0) {
            const doc = new jsPDF('p', 'pt', 'a4', true);
            this.RCAReportfileds = true
            this.changeDetectorRef.detectChanges()
            const specialElementHandlers = {
                '#editor': (element, renderer) => {
                    return true;
                }
            };
            const pdfTable = this.pdfTable.nativeElement;
            doc.fromHTML(pdfTable.innerHTML, 15, 15, {
                'width': 590,
                'elementHandlers': specialElementHandlers
            });
            var imageLink: any
            let imageData = document.getElementById('image');
            domtoimage.toPng(this.image.nativeElement).then(res => {
                imageLink = res;
                // doc.addPage('a4', 'l');
                doc.addPage('a4', 'l');
                const imgProps = doc.getImageProperties(imageLink);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                doc.addImage(imageLink, 'PNG', 20, 200, pdfWidth * 2.5, pdfHeight * 4);
                doc.save('RCA Report');
                this.commonLoadingDirective.showLoading(false, 'Downloading....');
            })
            //  html2canvas(imageData).then( (canvas) =>
            //  {
            //     doc.addPage('a4', 'l');
            //     var img = canvas.toDataURL('image/png', 1.5,);
            //     doc.addImage(img, 'PNG', 10, 190, 1500, 190);
            //     doc.setFontSize(22);
            //     doc.setTextColor(0, 0, 0);
            //     doc.text(20, 20, 'Annexures');
            //     doc.save('RCA Report');
            //     this.commonLoadingDirective.showLoading(false, 'Downloading....');
            //     this.changeDetectorRef.detectChanges();

            //  })
            this.RCAReportinputs = ""
            this.RCAReportRecommadtion = ""
            this.RCAReportfileds = false
            this.RCAReportBodyEnabled = true
        } else {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please fill the details' })
        }
    }


    RCAReportPrint() {
        if (this.RCAReportRecommadtion.length > 0 && this.RCAReportinputs.length > 0) {
            this.RCAReportfileds = true;
            this.changeDetectorRef.detectChanges();
            let popupWinindow;
            let printContents = document.getElementById('RCAREPORT').innerHTML;
            popupWinindow = window.open('', '_blank', 'width=1600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            let documentContent = "<html><head>";
            documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/bootstrap.css">';
            documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/vendor/fontawesome-free/css/all.min.css">';
            documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/primeicons/primeicons.css">';
            documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/resources/themes/saga-blue/theme.css">';
            documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/resources/images/line.gif">';
            documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/resources/images/color.png">';
            documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/resources/images/hue.png">';
            documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/resources/primeng.min.css">';
            documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/print.css">';
            documentContent += '</head>';
            documentContent += '<body onload="window.print()">' + printContents + '</body></html>'
            popupWinindow.document.write(documentContent);
            popupWinindow.document.close();
            this.RCAReportfileds = false;
            this.changeDetectorRef.detectChanges();
        } else {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please fill the details' })
        }
    }
    async ADDRCAUploadAttachment(event) {
        const formData = new FormData();
        var FileEvent = event[0]
        let fileToUpload = FileEvent.target.files[0];
        formData.append('file', fileToUpload, event[1]);
        var url: string = this.RCAAPIName.FMEAFileUpload
        return await this.commonBL.postWithoutHeaders(url, formData)
            .toPromise()
    }

    getFileExtension(filename) {
        const extension = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
        return extension;
    }


    RCAUpdateDeleteFromList(event) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                var FileId: string = event[0][0][0].FileId
                var data: any = [];
                event[1].RCAFILE.forEach(element => {
                    data.push(JSON.parse(element))
                });
                var index1 = data.findIndex(std => std[0][0].FileId === FileId)
                data.splice(index1, 1)
                let d: any = []
                data.forEach(element => {
                    d.push(JSON.stringify(element))
                });
                event[1].RCAFILE = d;
                const params = new HttpParams()
                    .set('fullPath', event[0][0][0].dbPath)
                this.commonBL.DeleteWithParam(this.RCAAPIName.RCAUpdateAttachment, params)
                    .subscribe(
                        res => {
                            let RCAOBJ = {
                                RCAID: this.UpdateRecordList[0].RCAID,
                                RCATree: JSON.stringify(this.Updatefiles),
                                TagNumber: this.UpdateRecordList[0].TagNumber,
                                RCALabel: this.UpdateRecordList[0].RCALabel,
                                RCAEquipment: this.ADDRCAMachineType,
                                RCAFailureMode: this.ADDRCAFailureMode,
                            }
                            this.commonBL.PutData(this.RCAAPIName.RCAOnlyTreeSaveAPI, RCAOBJ)
                                .subscribe(
                                    res => { }, err => { console.log(err.error) }
                                )
                        }
                    )
            }
        })
    }


    public RCAUpdateUpload: any;
    public RCAUpdateUploadData: any;
    RCAUpdateAttachmentFromList(event) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to update the attachment, this will delete old attachments?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.RCAUpdateUploadData = []
                this.RCAUpdateUploadData = event;
                this.RCAUpdateUpload = document.getElementById("UpdateAttachmentInUpdateFle")
                this.RCAUpdateUpload.style.display = 'block'
            }
        })
    }

    RCAUpdateUploadFile(event) {

        var FileData = this.RCAUpdateUploadData[0]
        var TreeNode = this.RCAUpdateUploadData[1]
        if (event.target.files.length > 0) {
            if (event.target.files[0].type === 'application/pdf'
                || event.target.files[0].type === 'image/png'
                || event.target.files[0].type === 'image/jpeg') {
                let fileToUpload = event.target.files[0];
                var fileName = event.target.files[0].name
                var ext = this.getFileExtension(fileName);
                this.UpdateFC + 1;
                var newName: string = `${this.UserDetails.UserId}_${this.UpdateRecordList[0].RCALabel}_${this.UpdateRecordList[0].TagNumber}_${TreeNode.id}_${this.UpdateFC}.${ext}`
                const formData = new FormData();
                formData.append('file', fileToUpload, newName);
                var url: string = this.RCAAPIName.FMEAFileUpload
                this.commonBL.postWithoutHeaders(url, formData)
                    .subscribe(
                        (res: any) => {
                            var Data1: any = [];
                            var Data2: any = [];
                            var Data3: any = [];
                            var Data4: any = [];
                            TreeNode.RCAFILE.forEach(element => {
                                Data1.push(JSON.parse(element));
                            });
                            Data2.push(res);
                            Data2.push(fileName);
                            Data3.push(Data2)
                            var index = Data1.findIndex(std => std[0][0].FileId == FileData[0][0].FileId);
                            const paramsFile = new HttpParams()
                                .set('fullPath', Data1[index][0][0].dbPath)
                            this.commonBL.DeleteWithParam(this.RCAAPIName.RCAUpdateAttachment, paramsFile)
                                .subscribe(res =>{}, err=>{ console.log(err.error)})
                            Data1[index] = Data3
                            Data1.forEach(element => {
                                Data4.push(JSON.stringify(element))
                            });
                            TreeNode.RCAFILE = Data4;

                            let RCAOBJ = {
                                RCAID: this.UpdateRecordList[0].RCAID,
                                RCATree: JSON.stringify(this.Updatefiles),
                                TagNumber: this.UpdateRecordList[0].TagNumber,
                                RCALabel: this.UpdateRecordList[0].RCALabel,
                                RCAEquipment: this.ADDRCAMachineType,
                                RCAFailureMode: this.ADDRCAFailureMode,
                            }
                            this.commonBL.PutData(this.RCAAPIName.RCAOnlyTreeSaveAPI, RCAOBJ)
                                .subscribe(
                                    res => { }, err => { console.log(err.error) }
                                )

                        },
                        err => { console.log(err.error) });
            } else {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "Only Pdf's and Images are allowed" })
            }
        }


        this.RCAUpdateUploadData = []
        this.RCAUpdateUpload.style.display = 'none'
    }
    CloseRCAUpdateUploadFile() {
        this.RCAUpdateUploadData = []
        this.RCAUpdateUpload.style.display = 'none'
    }


    RCATypeSelect(){
        if(this.RCATypeQualititive == false && this.RCATypeQuantitive == false){
            this.messageService.add({severity : 'warn', summary: 'warn', detail : 'You cannot unselect both'});
            this.RCATypeQualititive = true;
            this.finalRCATypeQualititive = true;
        }else if(this.RCATypeQualititive == true && this.RCATypeQuantitive == true){
            this.finalRCATypeQualititive = true;
            this.finalRCATypeQuantitive = true;
        }
        if(this.RCATypeQualititive == true  ){
            this.finalRCATypeQualititive = true;
        } else if(this.RCATypeQualititive == false  ){
            this.finalRCATypeQualititive = false;
        }

        if(this.RCATypeQuantitive == true  ){
            this.finalRCATypeQuantitive = true;
        }else if(this.RCATypeQuantitive == false  ){
            this.finalRCATypeQuantitive = false;
        }
    }

    onAddNode(event: any) {
        this.andOrItemCount++;
        let obj = {
            id: this.andOrItemCount,
            text: '',
            expanded: true,
            ANDORLogic: true,
            years: 0,
            hours: 0,
        }
        if (!event.node.ANDIcon && event.ANDIcon) {
            event.node.ANDIcon = event.ANDIcon;
            obj = this.SetEventAndBasicEvent(event, obj);
        } else if (!event.node.ORIcon && event.ORIcon) {
            event.node.ORIcon = event.ORIcon;
            obj = this.SetEventAndBasicEvent(event, obj);
        } else {
            obj = this.SetEventAndBasicEvent(event, obj);
        }
        if (event.BasicEvent && event.node.children.length > 2) {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: 'You are allowed to add only 2 basic events.' });
        } else {
            event.node.children.push(obj);
        }
        this.changeDetectorRef.detectChanges();
    }

    private SetEventAndBasicEvent(event: any, obj: any) {
        if (event.Event) {
            Object.assign(obj,
                {
                    label: 'Event',
                    Event: event.Event,
                    children: [],
                    nodeType: "Event"
                });
        } else if (event.BasicEvent) {
            if (event.Failure) {
                Object.assign(obj,
                    {
                        label: 'Failure',
                        BasicEvent: event.BasicEvent,
                        SelectedFailureComponentsList: [],
                        SelectedFailureCausesList: [],
                        SelectedFailureComponents: "",
                        SelectedFailureCauses: "",
                        Failure: event.Failure,
                        nodeType: "BasicEvent"
                    });
            }

            if (event.ScheduledDowntime) {
                Object.assign(obj,
                    {
                        label: 'Scheduled Downtime',
                        BasicEvent: event.BasicEvent,
                        ScheduledDowntime: event.ScheduledDowntime,
                        nodeType: "BasicEvent"
                    });
            }
        }
        return obj;
    }
    onDeleteNode(event) {
        this.containsInNestedObjectDF(this.ANDORLOGICTREE, event.id);
    }

    private GetFailureComponents() {
        this.commonBL.GetFailureComponents()
            .subscribe((res: any) => {
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(res);
                fileReader.onload = (e) => {
                    var arrayBuffer: any = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    this.FailureComponents = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                    console.log(this.FailureComponents);
                }

            });
    }


    private GetFailureCause() {
        this.commonBL.GetFailureCause()
            .subscribe((res: any) => {
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(res);
                fileReader.onload = (e) => {
                    var arrayBuffer: any = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    this.FailureCause = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                    console.log(this.FailureCause);
                }
            });
    }

    public GetFailureRateAndRepair(event) {
        this.commonBL.GetMSSLibrary()
            .subscribe(res => {
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(res);
                fileReader.onload = (e) => {
                    var arrayBuffer: any = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    let Library = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                    console.log(Library);
                    let FailureComponentsList = event.SelectedFailureComponentsList;
                    let FailureCausesList = event.SelectedFailureCausesList;
                    let failureModes = [];
                    FailureComponentsList.forEach(comp => {
                        let CompList: any = comp;
                        let sortedFailureComponents = [];
                        for (var sort in CompList) {
                            sortedFailureComponents.push([sort, CompList[sort]]);
                        }
                        sortedFailureComponents.sort((a, b) => {
                            return a[1] - b[1];
                        });
                        const len = sortedFailureComponents.length;
                        failureModes.push(sortedFailureComponents[len - 1]);
                    });
                    FailureCausesList.forEach(cau => {
                        let CauList: any = cau;
                        let sortedFailureCauses = [];
                        for (var sort in CauList) {
                            sortedFailureCauses.push([sort, CauList[sort]]);
                        }
                        sortedFailureCauses.sort((a, b) => {
                            return a[1] - b[1];
                        });
                        const len = sortedFailureCauses.length;
                        failureModes.push(sortedFailureCauses[len - 1]);
                    });

                    failureModes.sort((a, b) => {
                        return a[1] - b[1];
                    });
                    const len = failureModes.length;
                    let ShortName = failureModes[len - 1];
                    let Mode = this.FailureModeNamesList.find(a => a.ShortName === ShortName[0]).FullName;
                    let failureMode = Library.find(a => a['Failure mode'] === Mode);
                    event.node.years = failureMode['Failure rate Upper'];
                    event.node.hours = failureMode['Repair (manhours) Mean'];
                    this.changeDetectorRef.detectChanges();
                }
            });
    }

    private GetFailureModeNames() {
        this.commonBL.GetFailureModeNames()
            .subscribe((res: any) => {
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(res);
                fileReader.onload = (e) => {
                    var arrayBuffer: any = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    this.FailureModeNamesList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                }
            });
    }

    ClearRCAQualitiveTree(){
        this.files = [{
            id: this.itemCount,
            label: '',
            addTree: true,
            currentStage: 'add',
            update: '',
            operationalData: '',
            disable: false,
            designData: '',
            isParent: 'Yes',
            children: []
        }];
        this.itemCount = 100;
    }
    ClearRCAQuantiveTree(){
        this.ANDORLOGICTREE = [];
        this.ANDORLOGICTREE = [
            {
                id: this.andOrItemCount,
                label: 'Top Event',
                text: '',
                years: 0,
                hours: 0,
                expanded: true,
                ANDORLogic: true,
                children: [],
                nodeType: "TopEvent"
            }
        ]
        this.andOrItemCount = 100;
    }
}