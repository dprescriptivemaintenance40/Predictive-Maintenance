import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { Router } from '@angular/router';
import { CentrifugalPumpPrescriptiveModel } from '../prescriptive-add/prescriptive-model';
import { CanComponentDeactivate } from 'src/app/auth.guard';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-prescriptive-update',
  templateUrl: './prescriptive-update.component.html',
  styleUrls: ['./prescriptive-update.component.scss'],
  providers: [MessageService]
})
export class PrescriptiveUpdateComponent implements OnInit, CanComponentDeactivate {

  public prescriptiveTree: boolean = true;
  public CPPrescriptiveUpdateData: any = [];
  public data1: any = []
  public data2: any = []
  public FMTree: any = []
  public MachineType = "";
  public EquipmentType = "";
  public dropDownData: any = []
  public functionFailureData: any = []
  public functionModeData: any = []
  public UpdateModal: boolean = false;
  public FluidType = "";
  public RatedHead = "";
  public PeriodType = "";
  public failuerMode: any = []
  public dropedMode: any = []
  public dragedFunctionMode = null;
  public failuerModeLocalEffects = "";
  public failuerModeSystemEffects = "";
  public LSFailureMode: string = ""
  public Functiondiv: any;
  public FailureModediv: any;
  public FMdiv: any;
  public LSEdiv: any;
  public finalConsequence: string = "";
  public UpdatedFailureModeWithLSETree: string = ""
  public FinalUpdate: boolean = false;
  public FinalDelete: boolean = false;
  public AddFailureMode: boolean = true;
  public Consequences1: boolean = false;
  public Consequences2: boolean = false;
  public Consequences3: boolean = false;
  public Consequences4: boolean = false;
  public ConsequencesTree: boolean = false;
  public SaveConcequencesEnable: boolean = false;
  public ConsequencesAnswer: any = [];
  public ConsequenceTreeADDConsequenceEnable: boolean = false;
  public ConsequenceTreeEditConsequenceEnable: boolean = false;
  private consequenceTreeColorNodeA = 'p-person1'
  private consequenceTreeColorNodeB = 'p-person'
  private consequenceTreeColorNodeC = 'p-person'
  private consequenceTreeColorNodeD = 'p-person'
  private consequenceA;
  private consequenceB;
  private consequenceC;
  private consequenceD;
  private consequenceE;
  public ConsequenceNode: any = []
  public draggedConsequencesYesNO: any = ['YES', 'NO']
  public droppedYesNo = null;
  public dropedConsequenceFailureMode = []
  public droppedYesNo1 = null;
  public dropedConsequenceEffectFailureMode = []
  public droppedYesNo2 = null;
  public dropedConsequenceCombinationFailureMode = []
  public droppedYesNo3 = null;
  public dropedConsequenceAffectFailureMode = []
  public UpdateFailureMode: string = ""
  public UpdateFailureModeLocalEffect: string = "";
  public UpdateFailureModeSystemEffect: string = ""
  public UpdateFailureModeConsequence: string = ""
  public EditFM: boolean = false;
  public EditFailureModeInsideTree: string = "";
  public EditDownTimeFactor: number = 0;
  public EditScrapeFactor: number = 0;
  public EditSafetyFactor: number = 0;
  public EditProtectionFactor: number = 0;
  public EditFrequencyFactor: number = 0;
  public ADDDownTimeFactor: number = 0;
  public ADDScrapeFactor: number = 0;
  public ADDSafetyFactor: number = 0;
  public ADDProtectionFactor: number = 0;
  public ADDFrequencyFactor: number = 0;
  private IndexCount: number = 0;
  public EditfullPath: string = "";
  public EditdbPath: string = "";
  public EditdbPathURL: SafeUrl;
  public extensionPDF: boolean = false;
  public extensionImage: boolean = false;
  public UploadFileDataResponse: any = [];
  public UploadFileDataUpdateResponse: any = [];
  public dbPath: string = "";
  public fullPath: string = "";
  public dbPathUpdate: string = "";
  public fullPathUpdate: string = "";
  public fileAttachmentEnable: boolean = false;
  public fileUpload: string = "";
  public Remark: string = "";
  public AttachmentADD: boolean = false;
  public FreshUploadUpdate: boolean = false;
  public DeleteFMDataFromTree;
  public DeleteFMName: string = "";

  centrifugalPumpPrescriptiveOBJ: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();

  constructor(private messageService: MessageService,
    public formBuilder: FormBuilder,
    public title: Title,
    public commonLoadingDirective: CommonLoadingDirective,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer) { }
  private isNewEntity: boolean = false;
  CanDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.isNewEntity) {
      if (confirm('Are you sure you want to go back. You have have pending changes')) {
        // save changes logic
        return true;
      } else {
        return true;
      };
    } else {
      return true;
    }
  };

  ngOnInit() {
    this.CPPrescriptiveUpdateData = JSON.parse(localStorage.getItem('PrescriptiveUpdateObject'))
    this.data1 = JSON.parse(this.CPPrescriptiveUpdateData.FMWithConsequenceTree)
    var FailureModeWithLSETree = JSON.parse(this.CPPrescriptiveUpdateData.FailureModeWithLSETree)
    this.data2 = FailureModeWithLSETree
    this.data1[0].edit = true;
    this.data1[0].children[0].children[0].children.forEach(mode => {
      mode.edit = true;
      mode.delete = true;
    });
    this.FMTree = this.data1[0].children[0].children[0].children

    setInterval(() => {
      this.dynamicDroppedPopup();
    }, 2000);

  }

  async ngOnDestroy() {
    await localStorage.removeItem('PrescriptiveUpdateObject');
  }

  dynamicDroppedPopup() {
    //faliure droped popup
    if (this.dropedMode.length > 1) {
      for (let index = 0; index < this.dropedMode.length - 1; index++) {
        var elementIndex = this.dropedMode[this.dropedMode.length];
        this.dropedMode.splice(elementIndex, 1)
      }
    }
  }
  SelectNodeToUpdate(p) {
    console.log(p.data.name)
    console.log(p.label)
    this.UpdateModal = true;
    if (p.label == 'Function') {
      this.FluidType = this.CPPrescriptiveUpdateData.FunctionFluidType
      this.RatedHead = this.CPPrescriptiveUpdateData.FunctionRatedHead
      this.PeriodType = this.CPPrescriptiveUpdateData.FunctionPeriodType
      this.Functiondiv = document.getElementById("FunctionUpdate")
      this.Functiondiv.style.display = 'block'
    } else if (p.label == 'Function Failure') {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'No Update For Function Failure' });
    } else if (p.label == "Local Effect" || p.label == "System Effect" || p.label == "Consequence") {
    } else { this.EditFailureMode(p) }
  }

  CloseFailureModeUpdate() {
    this.UpdateFailureModeConsequence = ""
    this.FailureModediv.style.display = 'none'
  }

  findIndex(key, value) {
    return (item, i) => item[key] === value

  }
  EditFailureMode(p) {
    this.FreshUploadUpdate = false;
    this.FailureModediv = document.getElementById("FailureModeUpdate2")
    this.FailureModediv.style.display = 'block'
    this.IndexCount = p.label
    var FM = p.data.name
    var LE = p.children[0].data.name
    var SE = p.children[1].data.name
    this.UpdateFailureMode = p.data.name
    this.UpdateFailureModeLocalEffect = p.children[0].data.name
    this.UpdateFailureModeSystemEffect = p.children[1].data.name
    this.UpdateFailureModeConsequence = p.children[2].data.name
    this.EditFailureModeInsideTree = this.UpdateFailureMode
    this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
      if (element.FunctionMode == FM && element.LocalEffect == LE && element.SystemEffect == SE) {
        this.EditDownTimeFactor = element.DownTimeFactor
        this.EditScrapeFactor = element.ScrapeFactor
        this.EditSafetyFactor = element.SafetyFactor
        this.EditProtectionFactor = element.ProtectionFactor
        this.EditFrequencyFactor = element.FrequencyFactor
        this.EditdbPath = element.AttachmentDBPath;
        this.EditdbPathURL = this.sanitizer.bypassSecurityTrustResourceUrl(element.AttachmentDBPath);
        this.EditfullPath = element.AttachmentFullPath
        this.Remark = element.Remark

      }
    });

    if (this.EditdbPath !== null) {
      this.FreshUploadUpdate = false
      const extension = this.getFileExtension(this.EditdbPath);
      if (extension.toLowerCase() == 'jpg' || extension.toLowerCase() == 'jpeg' || extension.toLowerCase() == 'png') {
        this.extensionImage = true;
        this.extensionPDF = false;
      } else if (extension.toLowerCase() == 'pdf') {
        this.extensionImage = false;
        this.extensionPDF = true;
      }
    }
  }


  getFileExtension(filename) {
    const extension = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
    return extension;
  }


  DeleteAttachment() {
    this.AttachmentADD = true;
    this.extensionPDF = false;
    this.extensionImage = false;

    const params = new HttpParams()
      .set("fullPath", this.EditfullPath)
    this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe()
  }


  UpdateFM() {
    this.getDropDownLookMasterData()
    this.EditFM = true
  }

  CancelFM() {
    this.dropedMode = []
    this.EditFM = false
  }
  SaveFMToTreee() {
    this.EditFailureModeInsideTree = this.UpdateFailureMode
    this.UpdateFailureMode = this.dropedMode[0].Description
    this.dropedMode = []
    this.EditFM = false
  }

  ReplaceConsequence() {
    this.LSFailureMode = ""
    this.LSFailureMode = this.UpdateFailureMode
    this.Consequences1 = true
    this.FailureModediv.style.display = 'none'
    this.prescriptiveTree = false
  }

  EditConsequenceToTree() {
    this.ConsequenceTreeEditConsequenceEnable = false
    this.FailureModediv.style.display = 'block'
    this.prescriptiveTree = true
    this.dropedConsequenceAffectFailureMode = [];
    this.dropedConsequenceCombinationFailureMode = [];
    this.dropedConsequenceFailureMode = [];
    this.dropedConsequenceEffectFailureMode = [];
    this.ConsequencesTree = false
    this.UpdateFailureModeConsequence = this.finalConsequence
    this.finalConsequence = ""
    this.LSFailureMode = ""

    this.consequenceTreeColorNodeA = 'p-person1'
    this.consequenceTreeColorNodeB = 'p-person'
    this.consequenceTreeColorNodeC = 'p-person'
    this.consequenceTreeColorNodeD = 'p-person'
    this.consequenceA = 'p-person'
    this.consequenceB = 'p-person'
    this.consequenceC = 'p-person'
    this.consequenceD = 'p-person'
    this.consequenceE = 'p-person'
  }


  public uploadFileUpdate = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();

    formData.append('file', fileToUpload, fileToUpload.name);
    this.fileUpload = fileToUpload.name;

    this.http.post('api/PrescriptiveAPI/UploadFile', formData).subscribe(
      res => {
        this.UploadFileDataUpdateResponse = res;
        this.dbPathUpdate = this.UploadFileDataUpdateResponse.dbPath;
        this.fullPathUpdate = this.UploadFileDataUpdateResponse.fullPath;
        this.FreshUploadUpdate = true
      }, err => { console.log(err.err) }
    )

  }




  CloseAttachmentModalUpdate() {
    const params = new HttpParams()
      .set("fullPath", this.fullPathUpdate)
    this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe()

  }

  SaveFailureModeUpdate() {
    this.FailureModediv.style.display = 'none'
    var i = this.IndexCount - 1
    var local = this.data1[0].children[0].children[0].children[i].children[0].data.name
    var system = this.data1[0].children[0].children[0].children[i].children[1].data.name
    var consequence = this.data1[0].children[0].children[0].children[i].children[2].data.name

    this.data1[0].children[0].children[0].children.forEach(element => {
      if (element.data.name == this.EditFailureModeInsideTree
        && element.children[0].data.name == local
        && element.children[1].data.name == system
        && element.children[2].data.name == consequence) {

        element.data.name = this.UpdateFailureMode
        element.children[0].data.name = this.UpdateFailureModeLocalEffect
        element.children[1].data.name = this.UpdateFailureModeSystemEffect
        element.children[2].data.name = this.UpdateFailureModeConsequence

      }
    });
    this.data2[0].children[0].children[0].children.forEach(element => {
      if (element.data.name == this.EditFailureModeInsideTree
        && element.children[0].data.name == local
        && element.children[1].data.name == system) {

        element.data.name = this.UpdateFailureMode
        element.children[0].data.name = this.UpdateFailureModeLocalEffect
        element.children[1].data.name = this.UpdateFailureModeSystemEffect

      }
    });

    var index = this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes.findIndex(std => std.FunctionMode == this.EditFailureModeInsideTree);
    this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = this.CPPrescriptiveUpdateData.CFPPrescriptiveId
    this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = JSON.stringify(this.data2)
    this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = JSON.stringify(this.data1)

    var dbPath, fullPath;
    if (this.dbPathUpdate.length > 4) {
      dbPath = this.dbPathUpdate
      fullPath = this.fullPathUpdate
    } else {
      dbPath = this.EditdbPath
      fullPath = this.EditfullPath

    }

    let obj = {};
    obj['CPPFMId'] = this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes[index].CPPFMId
    obj['CFPPrescriptiveId'] = this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes[index].CFPPrescriptiveId
    obj['FunctionMode'] = this.UpdateFailureMode
    obj['LocalEffect'] = this.UpdateFailureModeLocalEffect
    obj['SystemEffect'] = this.UpdateFailureModeSystemEffect
    obj['Consequence'] = this.UpdateFailureModeConsequence
    obj['DownTimeFactor'] = this.EditDownTimeFactor
    obj['ScrapeFactor'] = this.EditScrapeFactor
    obj['SafetyFactor'] = this.EditSafetyFactor
    obj['ProtectionFactor'] = this.EditProtectionFactor
    obj['FrequencyFactor'] = this.EditFrequencyFactor
    obj['AttachmentDBPath'] = dbPath
    obj['AttachmentFullPath'] = fullPath
    obj['Remark'] = this.Remark
    this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    this.Remark = ""
    this.http.put('api/PrescriptiveAPI/EditConsequenceTree', this.centrifugalPumpPrescriptiveOBJ).subscribe(
      res => {
        console.log(res)
        this.FailureModediv.style.display = 'none'
        this.UpdateFailureMode = ""
        this.UpdateFailureModeLocalEffect = ""
        this.UpdateFailureModeSystemEffect = ""
        this.UpdateFailureModeConsequence = ""
        this.data1 = res
        this.router.navigateByUrl('/Home/Dashboard')
      }, err => { console.log(err.err) }
    )
  }

  SaveFunction() {
    this.centrifugalPumpPrescriptiveOBJ.FunctionFluidType = this.FluidType
    this.centrifugalPumpPrescriptiveOBJ.FunctionRatedHead = this.RatedHead
    this.centrifugalPumpPrescriptiveOBJ.FunctionPeriodType = this.PeriodType


    var FunctionTree: string = "Fluid Type : " + this.FluidType + ", Rated Head : " + this.RatedHead + " m," + " Duration Of :" + this.PeriodType + " days"
    this.data1[0].data.name = FunctionTree
    this.data2[0].data.name = FunctionTree

    this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = JSON.stringify(this.data2)
    this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = JSON.stringify(this.data1);
    this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = this.CPPrescriptiveUpdateData.CFPPrescriptiveId;

    this.http.put('api/PrescriptiveAPI/FunctionUpdate', this.centrifugalPumpPrescriptiveOBJ).subscribe(
      res => {
        console.log(res)
        this.Functiondiv.style.display = 'none'
      }, err => { console.log(err.err) }
    )
  }

  closeFunctionmodal() {
    this.Functiondiv.style.display = 'none';
    this.dropedMode = [];
  }
  closeFMmodal() {
    this.FMdiv.style.display = 'none';
    this.dropedMode = [];
  }

  closeLSmodal() {
    this.LSEdiv.style.display = 'none'
  }
  AddFailureModeToTree() {
    this.getDropDownLookMasterData();
    this.FMdiv = document.getElementById("FailureModeUpdate")
    this.FMdiv.style.display = 'block'

  }

  ADDSingleFailureModeToTree() {
    if (this.dropedMode.length > 0) {
      this.LSFailureMode = this.dropedMode[0].Description
      var index = this.FMTree.length
      var Add = {
        label: index + 1,
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: { name: this.LSFailureMode },
        children: []
      }
      this.data1[0].children[0].children[0].children.push(Add)
      var temp: any = this.data1
      this.data1 = []
      this.data1 = temp
      this.FMdiv.style.display = 'none'
      this.dropedMode = []
      this.LSEdiv = document.getElementById("LSEffectUpdate")
      this.LSEdiv.style.display = 'block'
    } else {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Please selct Failuer Modes' });
    }
  }




  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();

    formData.append('file', fileToUpload, fileToUpload.name);
    this.fileUpload = fileToUpload.name;

    this.http.post('api/PrescriptiveAPI/UploadFile', formData).subscribe(
      res => {
        this.UploadFileDataResponse = res;
        this.dbPath = this.UploadFileDataResponse.dbPath;
        this.fullPath = this.UploadFileDataResponse.fullPath;
        this.fileAttachmentEnable = true;
      }, err => { console.log(err.err) }
    )

  }








  CloseAttachmentModalAdd() {
    if (this.fullPath.length > 4) {
      const params = new HttpParams()
        .set("fullPath", this.fullPath)
      this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe(
        res => {
          this.fileUpload = ""
          this.fileAttachmentEnable = false
        }
      )
    }

  }

  AttachmentDoneModal() {
    this.fileAttachmentEnable = false;
    this.fileUpload = ""
  }



  LSEffectToTree() {
    if (this.failuerModeLocalEffects.length > 0 && this.failuerModeSystemEffects.length > 0 && this.ADDDownTimeFactor > 0 && this.ADDScrapeFactor > 0 && this.ADDSafetyFactor > 0 && this.ADDProtectionFactor > 0 && this.ADDFrequencyFactor > 0) {
      var index = this.FMTree.length
      var LNode = {
        label: "Local Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeLocalEffects
        }
      }
      var ENode = {
        label: "System Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeSystemEffects
        }
      }

      this.data1[0].children[0].children[0].children[index - 1].children.push(LNode)
      this.data1[0].children[0].children[0].children[index - 1].children.push(ENode)
      this.UpdatedFailureModeWithLSETree = JSON.stringify(this.data1)
      this.LSEdiv.style.display = 'none'

      this.prescriptiveTree = false
      this.Consequences1 = true;
    } else {
      this.messageService.add({ severity: 'info', summary: 'info', detail: 'Please fill all Fields' });
    }
  }


  ADDConsequenceToTree() {
    var index = this.FMTree.length
    var CNode = {
      label: "Consequence",
      type: "person",
      styleClass: "p-person",
      expanded: true,
      data: {
        name: this.finalConsequence
      }
    }
    this.data1[0].children[0].children[0].children[index - 1].children.push(CNode)
    this.Consequences1 = false
    this.Consequences2 = false
    this.Consequences3 = false
    this.Consequences4 = false
    this.prescriptiveTree = true
    this.ConsequencesTree = false;
    this.FinalUpdate = true;
    this.FinalDelete = true
    this.ConsequenceTreeADDConsequenceEnable = false
    this.AddFailureMode = false;
    this.consequenceTreeColorNodeA = 'p-person1'
    this.consequenceTreeColorNodeB = 'p-person'
    this.consequenceTreeColorNodeC = 'p-person'
    this.consequenceTreeColorNodeD = 'p-person'
    this.consequenceA = 'p-person'
    this.consequenceB = 'p-person'
    this.consequenceC = 'p-person'
    this.consequenceD = 'p-person'
    this.consequenceE = 'p-person'
  }

  UpdateChanges() {
    this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = JSON.stringify(this.data1);
    this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = JSON.stringify(this.data1);
    var Data = {}
    Data['CPPFMId'] = 0
    Data['CFPPrescriptiveId'] = this.CPPrescriptiveUpdateData.CFPPrescriptiveId
    Data['FunctionMode'] = this.LSFailureMode
    Data['LocalEffect'] = this.failuerModeLocalEffects
    Data['SystemEffect'] = this.failuerModeSystemEffects
    Data['Consequence'] = this.finalConsequence
    Data['DownTimeFactor'] = this.ADDDownTimeFactor
    Data['ScrapeFactor'] = this.ADDScrapeFactor
    Data['SafetyFactor'] = this.ADDSafetyFactor
    Data['ProtectionFactor'] = this.ADDProtectionFactor
    Data['FrequencyFactor'] = this.ADDFrequencyFactor
    Data['AttachmentDBPath'] = this.dbPath
    Data['AttachmentFullPath'] = this.fullPath
    Data['Remark'] = this.Remark

    this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(Data)
    this.Remark = ""
    this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = this.CPPrescriptiveUpdateData.CFPPrescriptiveId
    this.http.put('api/PrescriptiveAPI/FunctionModeAndConsequenceUpdate', this.centrifugalPumpPrescriptiveOBJ).subscribe(
      res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully updated' });
        this.FinalUpdate = false;
        this.AddFailureMode = true;
      }
    )

  }
  getDropDownLookMasterData() {
    this.failuerMode = [];
    this.MachineType = this.CPPrescriptiveUpdateData.MachineType
    this.EquipmentType = this.CPPrescriptiveUpdateData.EquipmentType
    const params = new HttpParams()
      .set('MachineType', this.MachineType)
      .set('EquipmentType', this.EquipmentType)

    this.http.get('api/PrescriptiveLookupMasterAPI/GetRecords', { params }).subscribe(
      res => {
        console.log(res)
        this.dropDownData = res;
        let functionModeData = [];
        this.dropDownData.forEach(element => {
          if (element.Function == "Function Failure") {
            this.functionFailureData.push(element)
          } else {
            functionModeData.push(element)
          }
        });
        this.failuerMode = functionModeData;
      });
  }

  FailureModeDropped(c) {
    var findIndexOF = c.PrescriptiveLookupMasterId

    var index = -1;
    var filteredObj = this.dropedMode.find(function (item, i) {
      if (item.PrescriptiveLookupMasterId === findIndexOF) {
        index = i;
        return i;
      }
    });
    this.dropedMode.splice(index, 1)
  }

  Consequence1Next() {
    if (this.dropedConsequenceFailureMode.length == 1) {
      if (this.dropedConsequenceFailureMode[0] == 'YES') {
        this.ConsequencesAnswer.push(this.dropedConsequenceFailureMode[0])
        console.log(this.ConsequencesAnswer)
        this.Consequences2 = true;
        this.Consequences1 = false;
        this.Consequences3 = false;
        this.Consequences4 = false;
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceFailureMode[0])
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = true;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field' });
    }

  }
  Consequence2Back() {
    this.Consequences1 = true;
    this.Consequences2 = false;

  }
  Consequence2Next() {
    if (this.dropedConsequenceEffectFailureMode.length == 1) {
      if (this.dropedConsequenceEffectFailureMode[0] == 'YES') {
        this.ConsequencesAnswer.push(this.dropedConsequenceEffectFailureMode[0])
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person1'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person'
        this.finalConsequence = ""
        this.finalConsequence = "B"
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        if (this.UpdateFailureModeConsequence == "") {
          this.ConsequenceTreeADDConsequenceEnable = true
        }

        if (this.UpdateFailureModeConsequence.length > 0) {
          this.ConsequenceTreeEditConsequenceEnable = true
        }
        this.colorConsequenceTree()
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceEffectFailureMode[0])
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = true;
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field' });
    }

  }
  Consequence3Back() {
    this.Consequences1 = true
    this.Consequences3 = false;
  }
  Consequence3Next() {
    if (this.dropedConsequenceCombinationFailureMode.length == 1) {
      if (this.dropedConsequenceCombinationFailureMode[0] == 'YES') {
        this.ConsequencesAnswer.push(this.dropedConsequenceCombinationFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "A"
        this.consequenceA = 'p-person1'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person'
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        if (this.UpdateFailureModeConsequence == "") {
          this.ConsequenceTreeADDConsequenceEnable = true
        }

        if (this.UpdateFailureModeConsequence.length > 0) {
          this.ConsequenceTreeEditConsequenceEnable = true
        }
        this.colorConsequenceTree()
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceCombinationFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "E"
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person1'
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        if (this.UpdateFailureModeConsequence == "") {
          this.ConsequenceTreeADDConsequenceEnable = true
        }

        if (this.UpdateFailureModeConsequence.length > 0) {
          this.ConsequenceTreeEditConsequenceEnable = true
        }
        this.colorConsequenceTree()
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field' });
    }

  }
  Consequence4Back() {
    this.Consequences2 = true
    this.Consequences4 = false;
  }
  Consequence4Next() {
    if (this.dropedConsequenceAffectFailureMode.length == 1) {
      if (this.dropedConsequenceAffectFailureMode[0] == 'YES') {
        this.ConsequencesAnswer.push(this.dropedConsequenceAffectFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "C"
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person1'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person'
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        if (this.UpdateFailureModeConsequence == "") {
          this.ConsequenceTreeADDConsequenceEnable = true
        }

        if (this.UpdateFailureModeConsequence.length > 0) {
          this.ConsequenceTreeEditConsequenceEnable = true
        }
        this.colorConsequenceTree()
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceAffectFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "D"
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person1'
        this.consequenceE = 'p-person'
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        if (this.UpdateFailureModeConsequence == "") {
          this.ConsequenceTreeADDConsequenceEnable = true
        }

        if (this.UpdateFailureModeConsequence.length > 0) {
          this.ConsequenceTreeEditConsequenceEnable = true
        }
        this.colorConsequenceTree()
      }
    } else {

      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field' });
    }

  }

  ConsequenceTreeBack() {
    this.dropedConsequenceAffectFailureMode = [];
    this.dropedConsequenceCombinationFailureMode = [];
    this.dropedConsequenceFailureMode = [];
    this.dropedConsequenceEffectFailureMode = [];
    this.ConsequencesTree = false
    this.Consequences1 = true;
    this.Consequences2 = false;
    this.Consequences3 = false;
    this.Consequences4 = false;
    this.consequenceTreeColorNodeA = 'p-person1'
    this.consequenceTreeColorNodeB = 'p-person'
    this.consequenceTreeColorNodeC = 'p-person'
    this.consequenceTreeColorNodeD = 'p-person'
    this.consequenceA = 'p-person'
    this.consequenceB = 'p-person'
    this.consequenceC = 'p-person'
    this.consequenceD = 'p-person'
    this.consequenceE = 'p-person'
  }

  colorConsequenceTree() {
    if (this.ConsequencesAnswer[0] == 'YES') {
      this.consequenceTreeColorNodeB = 'p-person1'
    }
    else {
      this.consequenceTreeColorNodeC = 'p-person1'
    }
    if (this.ConsequencesAnswer[0] == 'YES' && this.ConsequencesAnswer[1] == 'NO') {
      this.consequenceTreeColorNodeD = 'p-person1'
    }
    this.ConsequenceTreeGeneration();
    this.ConsequencesAnswer = []

  }

  ConsequenceTreeGeneration() {
    this.ConsequenceNode = [
      {
        label: "Consequences",
        type: "person",
        styleClass: this.consequenceTreeColorNodeA,
        expanded: true,
        data: {
          name:
            "Will the occurance of the failuer mode be evidient to operational stuff during normal operation of the plant?"
        },
        children: [
          {
            label: "Yes",
            type: "person",
            styleClass: this.consequenceTreeColorNodeB,
            expanded: true,
            data: {
              name:
                "Does the effect of the failure mode(or the secondary effect resulting from the failuer) have direct adverse effect on operational safety or the environment?"
            },
            children: [
              {
                label: "Yes",
                type: "person",
                styleClass: this.consequenceB,
                expanded: true,
                data: {
                  name: "B"
                }
              },
              {
                label: "No",
                type: "person",
                styleClass: this.consequenceTreeColorNodeD,
                expanded: true,
                data: {
                  name:
                    "Does the Failure mode adversily affect operational capabilities of the plant? "
                },
                children: [
                  {
                    label: "Yes",
                    type: "person",
                    styleClass: this.consequenceC,
                    expanded: true,
                    data: {
                      name: "C"
                    }
                  },
                  {
                    label: "No",
                    type: "person",
                    styleClass: this.consequenceD,
                    expanded: true,
                    data: {
                      name: "D"
                    }
                  }
                ]
              }
            ]
          },

          {
            label: "No",
            type: "person",
            styleClass: this.consequenceTreeColorNodeC,
            expanded: true,
            data: {
              name:
                "Does the combination of the failure mode and one additonal failure or event result in an adverse effect safety of the environment?  "
            },
            children: [
              {
                label: "Yes",
                type: "person",
                styleClass: this.consequenceA,
                expanded: true,
                data: {
                  name: "A "
                }
              },
              {
                label: "No",
                type: "person",
                styleClass: this.consequenceE,
                expanded: true,
                data: {
                  name: "E"
                }
              }
            ]
          }
        ]
      }
    ];
  }


  SelectNodeToDelete(p) {
    this.DeleteFMDataFromTree = p;
    this.DeleteFMName = p.data.name;
    this.data1
  }


  DeleteFailureModeFrommTree() {

    var DeletedFMTree = JSON.stringify(this.DeleteFMDataFromTree)
      
    // Here deleted failure mode has taken and send data from Function failure to backend
    this.centrifugalPumpPrescriptiveOBJ.FunctionFailure = DeletedFMTree;
    
    var FMList = this.data1[0].children[0].children[0].children
    var index = FMList.findIndex(std => std.data.name == this.DeleteFMDataFromTree.data.name);
    this.data1[0].children[0].children[0].children.splice(index, 1);

    var index2 = this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes.findIndex(std => std.FunctionMode == this.DeleteFMDataFromTree.data.name);
    var id = this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes[index2].CPPFMId

    this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = this.CPPrescriptiveUpdateData.CFPPrescriptiveId

    var FailureModeWithLSETree = JSON.parse(this.CPPrescriptiveUpdateData.FailureModeWithLSETree)
    var abc2 = FailureModeWithLSETree[0].children[0].children[0].children
    var index3 = abc2.findIndex(std => std.data.name == this.DeleteFMDataFromTree.data.name);
  
    FailureModeWithLSETree[0].children[0].children[0].children.splice(index3, 1);

    this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = JSON.stringify(FailureModeWithLSETree)
    this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = JSON.stringify(this.data1)
    let obj = {}
    obj['CPPFMId'] = id
    this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    this.http.put('api/PrescriptiveAPI/FailureModeDelete', this.centrifugalPumpPrescriptiveOBJ).subscribe(res => {
      console.log(res)
      this.FinalDelete = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete Successfully' });
      this.router.navigateByUrl('/Home/Dashboard');
    }, err => {
      console.log(err);
    }
    )
  }


  dragStartC1(e, con1) {
    this.droppedYesNo = con1;
  }

  dragEndC1(e) { }


  dropC1(e) {
    if (this.droppedYesNo) {
      this.dropedConsequenceFailureMode = [];
      this.dropedConsequenceFailureMode.push(this.droppedYesNo);
      this.droppedYesNo = null;
    }
  }


  dragStartC2(e, con2) {
    this.droppedYesNo1 = con2;
  }

  dragEndC2(e) { }


  dropC2(e) {
    if (this.droppedYesNo1) {
      this.dropedConsequenceEffectFailureMode = [];
      this.dropedConsequenceEffectFailureMode.push(this.droppedYesNo1);
      this.droppedYesNo1 = null;
    }
  }



  dragStartC3(e, con3) {
    this.droppedYesNo2 = con3;
  }

  dragEndC3(e) { }


  dropC3(e) {
    if (this.droppedYesNo2) {
      this.dropedConsequenceCombinationFailureMode = [];
      this.dropedConsequenceCombinationFailureMode.push(this.droppedYesNo2);
      this.droppedYesNo2 = null;
    }
  }


  dragStartC4(e, con4) {
    this.droppedYesNo3 = con4;
  }

  dragEndC4(e) { }


  dropC4(e) {
    if (this.droppedYesNo3) {
      this.dropedConsequenceAffectFailureMode = [];
      this.dropedConsequenceAffectFailureMode.push(this.droppedYesNo3);
      this.droppedYesNo3 = null;
    }
  }

  drop1(e) {
    if (this.dragedFunctionMode) {
      this.dropedMode.push(this.dragedFunctionMode);
      this.dragedFunctionMode = null;
    }
  }

  dragEnd1(e) { }
  dragStart1(e, c) {
    this.dragedFunctionMode = c;
  }
}

