import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { Router } from '@angular/router';
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { PrescriptiveContantAPI } from "../Shared/prescriptive.constant";
import { ChangeDetectorRef } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import panzoom from 'panzoom';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFDocument } from 'pdf-lib';
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
export class RCAComponent  {
    // @ViewChild('scene', { static: false }) scene: ElementRef;
    // @ViewChild('scene1', { static: false }) scene1: ElementRef;
    // @ViewChild('scene3', { static: false }) scene3: ElementRef;
    @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
    
    panZoomController;
    panZoomController1;
    panZoomController2;
    files: any = [];
    Updatefiles: any[];
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
    zoomLevels: number[];
    zoomLevels1: number[];
    zoomLevels2: number[];
    public RCAReportData : any = []
    public RCAReportTree : any = []
    public RCAReportDate : string = ""
    public RCAReportRecommadtion : string = ""
    public RCAReportinputs : string = ""
    public RCAReportBodyEnabled : boolean = false
    public RCAReportfileds : boolean = false
    constructor(private messageService: MessageService,
        public commonLoadingDirective: CommonLoadingDirective,
        private changeDetectorRef: ChangeDetectorRef,
        public router: Router,
        private commonBL: CommonBLService,
        private RCAAPIName: PrescriptiveContantAPI,
    ) {}
    ngOnInit() {
        this.addStartup();
        this.getRecordsList();
        this.getHeatExchangerData();
    }
    
    addStartup(){
        this.files = [{
            id: this.itemCount,
            label: '',
            addTree: true,
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
                addTree: true,
                isParent: 'Yes',
                disable: false,
                children: []
            }
        )
    }

    // zoom(xz) {
    //     const isSmooth = true;
    //     const scale = this.currentZoomLevel;
    //      var transform1
    //     if (scale) {
    //         if(xz== 'scene'){
    //              transform1 = this.panZoomController.getTransform();
              
    //         }else  if(xz== 'scene1'){
    //             transform1 = this.panZoomController1.getTransform();

    //         } else  if(xz== 'scene3'){
    //             transform1 = this.panZoomController2.getTransform();
    //         }
    //       const transform = transform1;
    //       const deltaX = transform.x;
    //       const deltaY = transform.y;
    //       const offsetX = scale + deltaX;
    //       const offsetY = scale + deltaY;
    
    //       if (isSmooth) {
    //         if(xz== 'scene'){
    //             this.panZoomController.smoothZoom(0, 0, scale);
    //        }else  if(xz== 'scene1'){
    //            this.panZoomController1.smoothZoom(0, 0, scale);
    //        } else  if(xz== 'scene3'){
    //            this.panZoomController2.smoothZoom(0, 0, scale);
    //        }
          
    //       } else {
    //         if(xz== 'scene'){
    //          this.panZoomController.zoomTo(offsetX, offsetY, scale);
    //        }else  if(xz== 'scene1'){
    //         this.panZoomController1.zoomTo(offsetX, offsetY, scale);
    //        } else  if(xz== 'scene3'){
    //         this.panZoomController2.zoomTo(offsetX, offsetY, scale);
    //        }
            
    //       }
    //     }
    //   }
    
//       zoomToggle(zoomIn: boolean, abc) {
//         var idxvalue
//         if (abc == 'scene') {
//             idxvalue = this.zoomLevels.indexOf(this.currentZoomLevel);

//         } else if (abc == 'scene1') {
//             idxvalue = this.zoomLevels1.indexOf(this.currentZoomLevel);

//         } else if (abc == 'scene3') {
//             idxvalue =this.zoomLevels2.indexOf(this.currentZoomLevel);
//         }
//    const idx = idxvalue
//         if (abc == 'scene') {
//             if (zoomIn) {
//                 if (typeof this.zoomLevels[idx + 1] !== 'undefined') {
//                  this.currentZoomLevel = this.zoomLevels[idxvalue + 1];
//                 }
//             } else {
//                 if (typeof this.zoomLevels[idx - 1] !== 'undefined') {
//                     this.currentZoomLevel = this.zoomLevels[idxvalue - 1];
//                 }
//             }

//         } else if (abc == 'scene1') {
//             if (zoomIn) {
//                 if (typeof this.zoomLevels1[idx + 1] !== 'undefined') {
//                     this.currentZoomLevel = this.zoomLevels1[idx + 1];
//                 }
//             } else {
//                 if (typeof this.zoomLevels1[idx - 1] !== 'undefined') {
//                     this.currentZoomLevel = this.zoomLevels1[idx - 1];
//                 }
//             }
//         } else if (abc == 'scene3') {
//             if (zoomIn) {
//                 if (typeof this.zoomLevels2[idx + 1] !== 'undefined') {
//                     this.currentZoomLevel = this.zoomLevels2[idx + 1];
//                 }
//             } else {
//                 if (typeof this.zoomLevels2[idx - 1] !== 'undefined') {
//                     this.currentZoomLevel = this.zoomLevels2[idx - 1];
//                 }
//             }
//         }

//         if (this.currentZoomLevel === 1) {
//             if (abc == 'scene') {
//                 this.panZoomController.moveTo(0, 0);
//                 this.panZoomController.zoomAbs(0, 0, 1);
//             } else if (abc == 'scene1') {
//                 this.panZoomController1.moveTo(0, 0);
//                 this.panZoomController1.zoomAbs(0, 0, 1);
//             } else if (abc == 'scene3') {
//                 this.panZoomController2.moveTo(0, 0);
//                 this.panZoomController2.zoomAbs(0, 0, 1);
//             }

//         } else {
//             this.zoom(abc);
//         }
//     }

    // ngAfterViewInit() {
    //     this.zoomLevels = [0.1, 0.25, 0.5, 0.75, 1];
    //     this.currentZoomLevel = this.zoomLevels[4];

    //     this.zoomLevels1 = [0.1, 0.25, 0.5, 0.75, 1];
    //     this.currentZoomLevel = this.zoomLevels1[4];

    //     this.zoomLevels2 = [0.1, 0.25, 0.5, 0.75, 1];
    //     this.currentZoomLevel = this.zoomLevels2[4];

    //     this.panZoomController = panzoom(this.scene.nativeElement);
    //     this.panZoomController1 = panzoom(this.scene1.nativeElement);
    //     this.panZoomController2 = panzoom(this.scene3.nativeElement);
    //     this.changeDetectorRef.detectChanges();
    // }

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
            addTree: true,
            deleteTree: true,
            disable: false,
            children: []
        }
        var id = obj.id;
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
        if (event.RCAFILE !== '') {
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
                this.SelectBoxEnabled = false
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


    RCAADDSave() {
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

    SaveAddRCAToDatabase() {
        if (this.ADDRCAMachineType.length > 0 && this.ADDRCAFailureMode.length > 0) {
            let RCAOBJ = {
                RCAID: 0,
                TagNumber: this.TagNumber,
                RCALabel: this.RCALabel,
                RCATree: JSON.stringify(this.files),
                RCAFailureMode: this.ADDRCAFailureMode,
                RCAEquipment: this.ADDRCAMachineType
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
                        this.addStartup();
                        this.messageService.add({ severity: 'success', summary: 'Sucess', detail: 'Successfully Done' });
                    }, error => { console.log(error.error) }
                )

        } else {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Fill all details' })
        }

    }

    DeleteRCARecord(p) {
        var j = JSON.parse(p.RCATree)
        if(j[0].update != ''){
            var data = JSON.parse(j[0].update)
 
            for (let index = 0; index < data.length; index++) {
                if (data[index].RCAFILE !== '' && data[index].RCAFILE !== undefined) {
                    var fileDetails : any = []
                    fileDetails = JSON.parse(data[index].RCAFILE)
                    const params = new HttpParams()
                        .set('fullPath', fileDetails.dbPath)
                    this.commonBL.DeleteWithParam(this.RCAAPIName.RCAUpdateAttachment, params)
                    .subscribe()
                }
            }
          
        }
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

    RCAHandleChange(e){
        if(e.index === 1){
            this.Updatefiles = []
            this.cancelRCAUpdate();
        }else if(e.index === 2){
            this.files = []
            this.CancelADDRCA();
        }
    }

    UpdateTagNumberSelect() {
        if (this.UpdateSelectedLabel.length > 0) {
            this.RCAListRecords.forEach(element => {
                if (element.RCALabel == this.UpdateSelectedLabel) {
                    this.Updatefiles = JSON.parse(element.RCATree)
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
        if (event.RCAFILE !== '') {
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
                        this.UpdateSelectedLabel = ""
                        this.Updatefiles = []
                        this.UpdateRCADataForSaveAuth = []
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

    uploadRCAAttachment(event) {
        var FileEvent = event[0]
        var TreeNode = event[1]
        if (FileEvent.target.files.length > 0) {
            if (FileEvent.target.files[0].type === 'application/pdf'
                || FileEvent.target.files[0].type === 'image/png'
                || FileEvent.target.files[0].type === 'image/jpeg') {
                let fileToUpload = FileEvent.target.files[0];
                const formData = new FormData();
                formData.append('file', fileToUpload, fileToUpload.name);
                var url: string = this.RCAAPIName.FMEAFileUpload
                this.commonBL.postWithoutHeaders(url, formData)
                    .subscribe(
                        (res: any) => {
                            TreeNode.RCAFILE = JSON.stringify(res)
                            if (this.Treeshow) {
                                this.Treeshow = false
                                this.changeDetectorRef.detectChanges()
                                this.Treeshow = true
                                this.messageService.add({ severity: 'success', summary: 'success', detail: "Sucessfully attached" })

                            } else if (this.UpdateTreeshow) {
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

    RCATreeDisplay(p) {
        this.RCADisplayLabel = p.RCALabel
        this.RCADisplayFile = JSON.parse(p.RCATree)
        this.TraverseNestedJson(this.RCADisplayFile)
    }

    CloseRCATreeDisplay() {
        this.RCADisplayFile = []
    }


    TraverseNestedJson(val: any) {
        for (let index = 0; index < val.length; index++) {
            val[index].addTree = false;
            val[index].deleteTree = false;
            val[index].disable = true;
            if (val[index].children.length > 0) {
                var Data: any = val[index].children;
                for (let index1 = 0; index1 < Data.length; index1++) {
                    Data[index1].addTree = false;
                    Data[index1].deleteTree = false;
                    Data[index1].disable = true;
                    if (Data[index1].children.length > 0) {
                        var Data2 = Data[index1].children
                        for (let index3 = 0; index3 < Data2.length; index3++) {
                            var d = []
                            d.push(Data2[index3])
                            this.TraverseNestedJson(d)
                        }
                    }
                }
            }

        }

    }

    RCAReport(p){
       this.RCAReportfileds = false
       this.RCAReportDate = moment().format('YYYY-MM-DD');
       this.RCAReportBodyEnabled = false
       this.RCAReportData = []
       this.RCAReportTree = []
       this.RCAReportData = p
       this.RCAReportTree = JSON.parse(p.RCATree)
       this.TraverseNestedJson(this.RCAReportTree)
       this.RCAReportBodyEnabled = true
       this.changeDetectorRef.detectChanges()
    }


    RCAReportDownload() {
        this.changeDetectorRef.detectChanges()
        this.commonLoadingDirective.showLoading(true, 'Downloading....');
        if (this.RCAReportRecommadtion.length > 0 && this.RCAReportinputs.length > 0) {
            const doc = new jsPDF('p', 'pt','a4', true);
            this.RCAReportfileds = true
            this.changeDetectorRef.detectChanges()
             const specialElementHandlers = {
               '#editor':  (element, renderer) =>{
                 return true;
               }
             };
             const pdfTable = this.pdfTable.nativeElement;
             doc.fromHTML(pdfTable.innerHTML, 15, 15, {
               'width': 560,
               'elementHandlers': specialElementHandlers
             });
             let imageData= document.getElementById('image');
             html2canvas(imageData).then( (canvas) =>
             {
                doc.addPage('a4', 'p');
               var img = canvas.toDataURL('image/png', 1.5,);
                doc.addImage(img, 'PNG', 20, 200, 600, 230);
                doc.setFontSize(22);
                doc.setTextColor(0, 0, 0);
                doc.text(20, 20, 'Annexures');
                 doc.save('RCA Report');
                 this.commonLoadingDirective.showLoading(false, 'Downloading....');
               this.changeDetectorRef.detectChanges()
             })
             this.RCAReportinputs = ""
             this.RCAReportRecommadtion = ""
             this.RCAReportfileds = false
             this.RCAReportBodyEnabled = true
        }else{
            this.messageService.add({ severity: 'warn', summary: 'warn', detail:'Please fill the details'})
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
             documentContent += '<body onload="window.print()">'+ printContents + '</body></html>'
             popupWinindow.document.write(documentContent);
             popupWinindow.document.close();
             this.RCAReportfileds = false;
            this.changeDetectorRef.detectChanges();
        }else{
            this.messageService.add({ severity: 'warn', summary: 'warn', detail:'Please fill the details'})
        }
    }

}