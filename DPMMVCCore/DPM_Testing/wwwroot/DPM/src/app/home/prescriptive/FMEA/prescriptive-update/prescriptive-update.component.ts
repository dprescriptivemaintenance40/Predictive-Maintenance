import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { Router } from '@angular/router';
import { CentrifugalPumpPrescriptiveModel } from '../prescriptive-add/prescriptive-model';
import { CanComponentDeactivate } from 'src/app/auth.guard';
import { Observable } from 'rxjs';
import * as Chart from 'chart.js';
import { ExcelFormatService } from 'src/app/home/Services/excel-format.service';
import * as XLSX from 'xlsx';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Component({
  selector: 'app-prescriptive-update',
  templateUrl: './prescriptive-update.component.html',
  styleUrls: ['./prescriptive-update.component.scss','../../../../../assets/orgchart.scss'],
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
  public ADDdbPathURL: SafeUrl;
  public extensionPDF: boolean = false;
  public extensionAddImage: boolean = false;
  public extensionAddPDF: boolean = false;
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
  public UpdatedAttachmentInFMDBPath: string = ""
  public UpdatedAttachmentInFMFullPath: string = ""
  public ADDUpdatedAttachmentInFMDBPath: string = ""
  public ADDUpdatedAttachmentInFMFullPath: string = ""
  public AttaRemarks: string = "" 
  public FMAttachmentADD: boolean = false
  public uploadedAttachmentList: any[] = [];
  public FileId;
  public AddUploadedAttachmentList: any[] = [];
  public AddFileId;

  private SavedconsequenceTreeColorNodeA = 'p-person1'
  private SavedconsequenceTreeColorNodeB = 'p-person'
  private SavedconsequenceTreeColorNodeC = 'p-person'
  private SavedconsequenceTreeColorNodeD = 'p-person'
  public SavedfinalConsequence: string = "";
  private SavedconsequenceA;
  private SavedconsequenceB;
  private SavedconsequenceC;
  private SavedconsequenceD;
  private SavedconsequenceE;
  public SavedConsequenceNode: any = []
  public ChangeConsequenceforUpdate: boolean = false;
  public ColoredTreeForUpdate: boolean = false;
  public UpdateColorTreeEnable: boolean = false;

  public FCAViewEnabled : boolean = false
  public FCAViewTreeEnabled : boolean = false
  public FCAView:any;
  public FCAPatternTree : any;
  public FCAdata1: any;
  public PattenNode1: string;
  public PattenNode2: string;
  public PattenNode4: string;
  public PattenAnsNode4: string;
  public PattenNode7: string;
  public PattenAnsNode6P1: string;
  public PattenAnsNode5: string;
  public PattenNode5: string;
  public PattenAnsNode3P1: string;
  public PattenAnsNode2P1: string;
  public PattenNode3: string;
  public PattenAnsNode1: string;
  public PattenNode6: string;
  public PattenAnsNode2P2: string;
  public PattenNode8: string;
  public PattenAnsNode6P2: string;
  public PattenAnsNode3P2: string;
  public Pattern: string;
  public PatternPathEnable : boolean = false;
  public PatternPath: string;
  public FailureModePatternTree : boolean = false;
  public FCAChangeData : any
  public PatternBack: string;
  private nodePath : number = 0;
  public AddFMPatternAddEnable : boolean = false;
  public UpdatePatternAddEnable : boolean = false;
  public ADDFailureModePatternTree: boolean = false;
  public FailureModeMSSPatternTree: boolean = false;
  public UpdateMSSAddEnable: boolean = false;
  public AddFMMSSAddEnable: boolean = false;

  public ADDinterval: string = ""
  public ADDintervalValue: number = 0;

  public ADDffInterval: string = ""
  public ADDffIntervalValue: number = 0;
  public ADDMSSIntervalSelectionCriteria : string = ""
  public ADDFailuerRate: boolean = false
  public ADDFailureWarning: boolean = false
  public ADDWarningSign: boolean = false
  public ADDIntervalDeteacting: boolean = false
  public ADDFailuerEvident: boolean = false
  public ADDFailuerMaintenance: boolean = false
  public ADDFailuerComments: boolean = false

  public ADDfailuerrate: boolean = true
  public ADDfailurewarning: boolean = true
  public ADDwarningsign: boolean = true
  public ADDintervaldeteacting: boolean = true
  public ADDfailuerevident: boolean = true
  public ADDfailuermaintenance: boolean = true
  public ADDfailuercomments: boolean = true

  public ADDVibration: string = ""
  public ADDNoice: string = ""
  public ADDLeakage: string = ""
  public ADDPerformanceDrop: string = ""
  public ADDTempratureChange: string = ""
  public ADDEmmisionChange: string = ""
  public ADDIncreaseLubricantConsumption: string = ""
  public ADDOther: string = ""

  public ADDHumanSenses: string = ""
  public ADDExistingInstumentation: string = ""
  public ADDNewInstumentation: string = ""
  public ADDProcessCondtions: string = ""
  public ADDSampleAnyalysis: string = ""

  public FCAInterval : number = 0
  public FCAComment : any = []
  public FCACondition : any = []
  public FCAFFInterval : number = 0

  public ADDCommentFIEYN: string = ""
  public ADDCommentFIEYN2: string = ""
  public ADDInterval: boolean = true;
  public ADDCondition: boolean = true;
  public ADDFCAFFI: boolean = true;
  public ADDSafeUsefulLife: boolean = false
  public ADDSafeLife: number = 0
  public ADDUsefulLife: number =0
  public ADDFCAFreeText : string = ""
  public ADDalphaBeta: boolean = false
  public ADDalpha: number = 0
  public ADDbeta: number = 0
  public ADDConsequenceFM: string = ""
  public ADDWebalYN: string = ""
  public ADDFCAFreeTextCancel1: boolean  = true
  public ADDFCAFreeTextSave1: boolean  = true
  public ADDpatternaddshow: boolean  = false
  public ADDPatternFailuerAll: boolean  = false

  public file : any;
  public arrayBuffer: any;
  public daysList: any;
  public ADDMSSView: boolean  = false
  public ADDMSSAvailabilityY : string = ""
  public MSSAvailabilityYN : string = ""
  public MSSAvailabilityN : string = ""
  public ADDMSSAvailabilityCheck: number = 0;

  public MSSAvailabilityCalculations: boolean = false
  public ADDMSSAvailabilityYNCheck: boolean = false
  public MSSAvailabilityTaskObj : any =[]

 public ADDMSSexpectedAvailability: boolean = false
 public ADDMSSAvailabilityPlantStoppage: boolean = false
 public ADDMSSAvailabilityPlantStoppageTime: boolean = false

 public MSSAvailabilityResult : number = 0
 public ADDMSSstoppageDays: string = "";
 public ADDMSSstoppageDaysValue: number = 0;
 public ADDMSSstoppageDaysTime: string = "";
 public ADDMSSstoppageDaysTimeValue: number = 0;
 public MSSTreeButton : boolean = false 
 public MSSstoppageValue : number
 public MSSstoppageDuration : number

 public PlantStoppage: boolean  = true
 public PlantStoppageTime: boolean  = true
 public MSSLibraryData : any = []
 public ConsequenceBasedMSS: string = ""
 public MSSADDCounter: number = 0
 public MSSStratergy: string = ""
 public TreeUptoFCA: any = [];
 public data1Clone: any;
 public MSSTaskObj : any =[]
 public SelectedPrescriptiveTree: any = [];
 public FailureModeName: string = ""
 public AddBtnEnable: boolean = true
 public SaveBtnEnable: boolean = false
 public MSSViewEnabled: boolean = false
 public MSSViewTreeEnabled: boolean = false
 public MSSViewShow: boolean = false;
 public ADDFCAUpdateIntervals: string = ""
 public ADDFCAUpdateConditions: string = ""
 public UpdateFCACondition : any = []
public UpdateFCAIntervals : any = []

public UpdateMSSIntervalSelectionCriteria : string = ""
public UpdateFCAFreeText : string = ""
public UpdateVibration : string = ""
public UpdateNoice : string = ""
public UpdateLeakage : string = ""
public UpdatePerformanceDrop : string = ""
public UpdateTempratureChange : string = ""
public UpdateEmmisionChange : string = ""
public UpdateIncreaseLubricantConsumption : string = ""
public UpdateOther : string = ""
public UpdateHumanSenses : string = ""
public UpdateExistingInstumentation : string = ""
public UpdateNewInstumentation : string = ""
public UpdateProcessCondtions : string = ""
public UpdateSampleAnyalysis : string = ""
public UpdateCommentFIEYN : string = ""
public UpdateCommentFIEYN2 : string = ""
public Updateinterval : string = ""
public UpdateintervalValue : number  = 0
public UpdateffInterval : string =""
public UpdateffIntervalValue : number  = 0
public FCAUpdatePageEnable : boolean = false
public MSSLibraryJsonData : any ;

public UpdateAlpha : number = 0
public UpdateBeta : number = 0
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
 
  centrifugalPumpPrescriptiveOBJ: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();

  public UpdateFinalFCACondition : any = [] 
  public UpdateFinalFCAInterval : number = 0; 
  public UpdateFinalFCAFFIInterval : number = 0;
  public UpdateFinalSafeUsefulLife : number = 0; 
  public UpdateSafeLife : number = 0; 
  public UpdateUsefulLife : number = 0; 
  public UpdateFCAConditionsFINAL : any = []
  public UpdateFCAIntervalsFINAL : any = []
  public UpdateFCACommentFINAL : any = []
  public UpdateWebalYN : string =""
  public UpdateMSSConsequence : string =""
  public UpdateMSSImagePath : string = ""
  public UpdateMSSImageFlag : boolean = false
  public UpdateMSSImageValues : any = []
  public UpdateMSSTaskObj : any = []
  public UpdatedMSSStartegy : string = ""
  private UpdateMSSTreeLabel : number = 0
  private UpdateMSSAvailability : number = 0
  public UpdateMSSAvailabilityY : string = ""
  public UpdateMSSstoppageDaysValue : number = 0
  public UpdateMSSstoppageDays : string = ""
  public UpdateMSSstoppageDaysTimeValue : number = 0
  public UpdateMSSstoppageDaysTime : string = ""
  public UpdateMSSAvailabilityCheck : number = 0
  public UpdateMSSDirectAvailability : boolean = false
  public UpdateMSSIndirectAvailability : boolean = false
  public ADDMSSFinalAvailability : any = []


  constructor(private messageService: MessageService,
    public formBuilder: FormBuilder,
    public title: Title,
    public commonLoadingDirective: CommonLoadingDirective,
    private router: Router,
    private http: HttpClient,
    private excelFormatService : ExcelFormatService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private prescriptiveBLService : CommonBLService,
    private prescriptiveContantAPI : PrescriptiveContantAPI) {
      this.title.setTitle('Prescriptive Update | Dynamic Prescriptive Maintenence')
     }

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
    this.getData();
    this.getMSSLibraryDataInJSon()
  }

  getMSSLibraryDataInJSon(){
    this.http.get<any>('dist/DPM/assets/MSS_Library/mss_library.json').subscribe(
      res => {
       this.MSSLibraryJsonData = res;
      }, error =>{ console.log(error.error)}
    )
  }
  getData(){
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
  }

  async ngOnDestroy() {
    await localStorage.removeItem('PrescriptiveUpdateObject');
  }

 async SelectNodeToUpdate(p) {
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
    const element = document.querySelector("#PatternForFailureMode")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start'})
   
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
    var LE = p.children[0].children[0].data.name
    var SE = p.children[0].children[1].data.name
    this.UpdateFailureMode = p.data.name
    this.UpdateFailureModeLocalEffect = p.children[0].children[0].data.name
    this.UpdateFailureModeSystemEffect = p.children[0].children[1].data.name
    this.UpdateFailureModeConsequence = p.children[0].children[2].data.name
    this.EditFailureModeInsideTree = this.UpdateFailureMode 
    this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
      if (element.FunctionMode == FM && element.LocalEffect == LE && element.SystemEffect == SE) {
        this.EditDownTimeFactor = element.DownTimeFactor
        this.EditScrapeFactor = element.ScrapeFactor
        this.EditSafetyFactor = element.SafetyFactor
        this.EditProtectionFactor = element.ProtectionFactor
        this.EditFrequencyFactor = element.FrequencyFactor
        this.EditdbPath = element.AttachmentDBPath;
        this.AttaRemarks = this.EditdbPath .replace(/^.*[\\\/]/, '')
        this.EditdbPathURL = this.sanitizer.bypassSecurityTrustResourceUrl(element.AttachmentDBPath);
        this.UpdatedAttachmentInFMDBPath = element.AttachmentDBPath;
        this.UpdatedAttachmentInFMFullPath = element.AttachmentFullPath;
        this.EditfullPath = element.AttachmentFullPath
        if (this.EditdbPathURL == '') {
          this.AttachmentADD = false;
        } else { this.AttachmentADD = true; }
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
    this.AttachmentADD = false;
    this.extensionPDF = false;
    this.extensionImage = false;
    this.EditdbPathURL = ""
    const params = new HttpParams()
      .set("fullPath", this.UpdatedAttachmentInFMFullPath)
    var url : string =  this.prescriptiveContantAPI.FMEADeleteFileUpload;
    this.prescriptiveBLService.DeleteWithParam(url, params).subscribe()
  //  this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe()
    this.UpdatedAttachmentInFMDBPath = "";
    this.UpdatedAttachmentInFMFullPath = "";

  }
  
  public uploadAttachmentFile(event) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].type === 'application/pdf'
        || event.target.files[0].type === 'image/png'
        || event.target.files[0].type === 'image/jpeg') {
        let filedata = this.uploadedAttachmentList.find(a => a.FileId === this.FileId);
        let fileToUpload = event.target.files[0];
        if (this.EditdbPath != "") {
          filedata = []
          var dbPath = this.EditdbPath
          filedata.dbPath = dbPath
          this.EditdbPath = ""
        }
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        formData.append('removePath', !!filedata ? filedata.dbPath : "");
        this.fileUpload = fileToUpload.name;
        var url : string =  this.prescriptiveContantAPI.FMEAFileUpload;
        this.prescriptiveBLService.postWithoutHeaders(url, formData)
      //  this.http.post('api/PrescriptiveAPI/UploadFile', formData)
          .subscribe((res: any) => {
            this.dbPath = res.dbPath;
            this.EditdbPathURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.dbPath);
            this.fullPath = res.fullPath;
            this.fileUpload = res.fileName;
            this.UpdatedAttachmentInFMDBPath = res.dbPath;
            this.UpdatedAttachmentInFMFullPath = res.fullPath;
            this.FileId = res.FileId;
            this.uploadedAttachmentList.push(res)
            var ext = this.getFileExtension(this.dbPath)
            if (ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'png') {
              this.extensionPDF = false
              this.extensionImage = true
            } else if (ext.toLowerCase() == 'pdf') {
              this.extensionPDF = true
              this.extensionImage = false
            }
          }, err => { console.log(err.err) });

      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "Only Pdf's and Images are allowed" })
      }
    }
  }



  public AddUploadAttachmentFile(event) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].type === 'application/pdf'
        || event.target.files[0].type === 'image/png'
        || event.target.files[0].type === 'image/jpeg') {
        let filedata = this.AddUploadedAttachmentList.find(a => a.FileId === this.FileId);
        let fileToUpload = event.target.files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        formData.append('removePath', !!filedata ? filedata.dbPath : "");
        var url : string =  this.prescriptiveContantAPI.FMEAFileUpload;
        this.prescriptiveBLService.postWithoutHeaders(url, formData)
      //  this.http.post('api/PrescriptiveAPI/UploadFile', formData)
          .subscribe((res: any) => {
            // this.dbPath = res.dbPath;
            this.ADDdbPathURL = this.sanitizer.bypassSecurityTrustResourceUrl(res.dbPath);
            // this.fullPath = res.fullPath;
            // this.fileUpload = res.fileName;
            this.ADDUpdatedAttachmentInFMDBPath = res.dbPath;
            this.ADDUpdatedAttachmentInFMFullPath = res.fullPath;
            this.AddFileId = res.FileId;
            this.AddUploadedAttachmentList.push(res)
            this.FMAttachmentADD = true
            var ext = this.getFileExtension(res.dbPath)
            if (ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'png') {
              this.extensionAddPDF = false
              this.extensionAddImage = true
            } else if (ext.toLowerCase() == 'pdf') {
              this.extensionAddPDF = true
              this.extensionAddImage = false
            }
          }, err => { console.log(err.err) });

      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "Only Pdf's and Images are allowed" })
      }
    }
  }


  DeleteADDAttachment() {
    this.FMAttachmentADD = false
    this.extensionAddPDF = false;
    this.extensionAddImage = false;
    this.ADDdbPathURL = ""
    const params = new HttpParams()
      .set("fullPath", this.ADDUpdatedAttachmentInFMFullPath)
    var url : string =  this.prescriptiveContantAPI.FMEADeleteFileUpload
    this.prescriptiveBLService.DeleteWithParam(url, params).subscribe()
  //  this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe()
    this.ADDUpdatedAttachmentInFMDBPath = "";
    this.ADDUpdatedAttachmentInFMFullPath = "";

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

  async ReplaceConsequence() {
    this.LSFailureMode = ""
    this.LSFailureMode = this.UpdateFailureMode
    this.Consequences1 = false
    this.FailureModediv.style.display = 'none'
    this.prescriptiveTree = true
    this.ColoredTreeForUpdate = true
    this.ChangeConsequenceforUpdate = true
    await this.colorForUpdateTree()
    this.changeDetectorRef.detectChanges();
    const element = document.querySelector("#ScrollUpdateTree")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })  
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
    this.ColoredTreeForUpdate = false
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



  CloseAttachmentModalUpdate() {
    const params = new HttpParams()
      .set("fullPath", this.fullPathUpdate)
    var url : string =  this.prescriptiveContantAPI.FMEADeleteFileUpload
    this.prescriptiveBLService.DeleteWithParam(url, params).subscribe()
    //this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe()

  }

  SaveFailureModeUpdate() {
    this.FailureModediv.style.display = 'none'
    var i = this.IndexCount - 1
    var local = this.data1[0].children[0].children[0].children[i].children[0].children[0].data.name
    var system = this.data1[0].children[0].children[0].children[i].children[0].children[1].data.name
    var consequence = this.data1[0].children[0].children[0].children[i].children[0].children[2].data.name

    this.data1[0].children[0].children[0].children.forEach(element => {
      if (element.data.name == this.EditFailureModeInsideTree
        && element.children[0].children[0].data.name == local
        && element.children[0].children[1].data.name == system
        && element.children[0].children[2].data.name == consequence) {

    this.data1[0].children[0].children[0].FMEA[0].children[0].children[0].children[element.label - 1].children[0].data.name = this.UpdateFailureModeLocalEffect
    this.data1[0].children[0].children[0].FMEA[0].children[0].children[0].children[element.label - 1].children[1].data.name = this.UpdateFailureModeSystemEffect
    this.data1[0].children[0].children[0].FMEA[0].children[0].children[0].children[element.label - 1].children[2].data.name = this.UpdateFailureModeConsequence
    this.data1[0].children[0].children[0].FMEA[0].children[0].children[0].children[element.label - 1].data.name = this.UpdateFailureMode
       
        element.data.name = this.UpdateFailureMode
        element.children[0].children[0].data.name = this.UpdateFailureModeLocalEffect
        element.children[0].children[1].data.name = this.UpdateFailureModeSystemEffect
        element.children[0].children[2].data.name = this.UpdateFailureModeConsequence

      }
    });
    this.data2[0].children[0].children[0].children.forEach(element => {
      if (element.data.name == this.EditFailureModeInsideTree
        && element.children[0].children[0].data.name == local
        && element.children[0].children[1].data.name == system) {

        element.data.name = this.UpdateFailureMode
        element.children[0].children[0].data.name = this.UpdateFailureModeLocalEffect
        element.children[0].children[1].data.name = this.UpdateFailureModeSystemEffect

      }
    });

    var index = this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes.findIndex(std => std.FunctionMode == this.EditFailureModeInsideTree);
    this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = this.CPPrescriptiveUpdateData.CFPPrescriptiveId
    this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = JSON.stringify(this.data2)
    this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = JSON.stringify(this.data1)


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
    obj['AttachmentDBPath'] = this.UpdatedAttachmentInFMDBPath
    obj['AttachmentFullPath'] = this.UpdatedAttachmentInFMFullPath
    obj['Remark'] = this.Remark
    this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    this.Remark = ""
    var url : string =  this.prescriptiveContantAPI.SaveFailureModeUpdate
    this.prescriptiveBLService.PutData(url, this.centrifugalPumpPrescriptiveOBJ).subscribe(
   // this.http.put('api/PrescriptiveAPI/EditConsequenceTree', this.centrifugalPumpPrescriptiveOBJ).subscribe(
      res => {
        console.log(res)
        this.FailureModediv.style.display = 'none'
        this.UpdateFailureMode = ""
        this.UpdateFailureModeLocalEffect = ""
        this.UpdateFailureModeSystemEffect = ""
        this.UpdateFailureModeConsequence = ""
        this.data1 = res
        this.router.navigateByUrl('/Home/Prescriptive/List')
      }, err => { console.log(err.err) }
    )
  }

  SaveFunction() {
    this.centrifugalPumpPrescriptiveOBJ.FunctionFluidType = this.FluidType
    var FunctionTree: string = "Function Type : " + this.FluidType 
    this.data1[0].data.name = FunctionTree
    this.data2[0].data.name = FunctionTree

    this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = JSON.stringify(this.data2)
    this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = JSON.stringify(this.data1);
    this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = this.CPPrescriptiveUpdateData.CFPPrescriptiveId;
    var url : string =  this.prescriptiveContantAPI.SaveFunction;
    this.prescriptiveBLService.PutData(url, this.centrifugalPumpPrescriptiveOBJ).subscribe(
 //   this.http.put('api/PrescriptiveAPI/FunctionUpdate', this.centrifugalPumpPrescriptiveOBJ).subscribe(
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
 async AddFailureModeToTree() {
    this.getDropDownLookMasterData();
    this.FMdiv = document.getElementById("FailureModeUpdate")
    this.FMdiv.style.display = 'block'
    this.FailureModePatternTree = false;
    this.FCAViewTreeEnabled = false;
    this.FCAViewEnabled = false;
    this.MSSViewEnabled = false;
    this.changeDetectorRef.detectChanges();
    const element = document.querySelector("#EditTheNode")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ADDSingleFailureModeToTree() {
  //   if (this.dropedMode.length > 0) {
  //     this.LSFailureMode = this.dropedMode[0].Description
  //     var index = this.FMTree.length
  //     var AddFMEA = {
  //       label: index + 1,
  //       type: "person",
  //       styleClass: "p-person",
  //       expanded: true,
  //       data: { name: this.LSFailureMode },
  //       children: [
  //         {
  //           label: index + 1,
  //           type: "person",
  //           styleClass: "p-person",
  //           expanded: true,
  //           data: { name: 'FMEA' },
  //           children: []
  //         }
  //       ]
  //     }
  //     var AddFCA = {
  //       label: index + 1,
  //       type: "person",
  //       styleClass: "p-person",
  //       expanded: true,
  //       data: { name: this.LSFailureMode },
  //       children: [
  //         {
  //           label: index + 1,
  //           type: "person",
  //           styleClass: "p-person",
  //           expanded: true,
  //           data: { name: 'FCA' },
  //           children: []
  //         }
  //       ]
  //     }
  //     var FMEA = {
  //       label: index + 1,
  //       type: "person",
  //       styleClass: "p-person",
  //       expanded: true,
  //       data: { name: this.LSFailureMode },
  //       children: []
  //     }

  //     var FCAFMEA = {
  //       label: index + 1,
  //       type: "person",
  //       styleClass: "p-person",
  //       expanded: true,
  //       data: { name: this.LSFailureMode },
  //       children: []
  //     }
      
  //     var FCATreeClone = {
  //       label: index + 1,
  //       type: "person",
  //       styleClass: 'p-person',
  //       editFCA: true,
  //       expanded: true,
  //       nodePath: 0,
  //       pattern: "pattern",
  //       data: { name: "FCA" },
  //       children: [
  //         {
  //           label: "Pattern",
  //           type: "person",
  //           styleClass: 'p-person',
  //           expanded: true,
  //           data: {
  //             name: this.Pattern
  //           }
  //         }
  //       ]
  //     }



  //     var FCATree = {
  //       label: index + 1,
  //       type: "person",
  //       styleClass: 'p-person',
  //       viewFCA: true,
  //       FCAData: FCATreeClone,
  //       data: { name: "FCA" }
  //     }

  //     this.data1[0].children[0].children[0].FMEA[0].children[0].children[0].children.push(FMEA)
  //     this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children.push(FCAFMEA)
  //     this.data1[0].children[0].children[0].children.push(AddFMEA)
  //     this.data1[0].children[0].children[0].children[index].children.push(FCATree)
  //     var temp: any = this.data1
  //     this.data1 = []
  //     this.data1 = temp
  //     this.FMdiv.style.display = 'none'
  //     this.dropedMode = []
  //     this.LSEdiv = document.getElementById("LSEffectUpdate")
  //     this.LSEdiv.style.display = 'block'
  //   } else {
  //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Please selct Failuer Modes' });
  //   }
  // }
  ADDSingleFailureModeToTree() {
    if (this.dropedMode.length > 0) {
      this.LSFailureMode = this.dropedMode[0].Description
      var index = this.FMTree.length
      var AddFMEA = {
        label: index + 1,
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: { name: this.LSFailureMode },
        children: [
          {
            label: index + 1,
            type: "person",
            styleClass: "p-person",
            expanded: true,
            data: { name: 'FMEA' },
            children: []
          }
        ]
      }
      var AddFCA = {
        label: index + 1,
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: { name: this.LSFailureMode },
        children: [
          {
            label: index + 1,
            type: "person",
            styleClass: "p-person",
            expanded: true,
            data: { name: 'FCA' },
            children: []
          }
        ]
      }
      var FMEA = {
        label: index + 1,
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: { name: this.LSFailureMode },
        children: []
      }

      var FCAFMEA = {
        label: index + 1,
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: { name: this.LSFailureMode },
        children: []
      }

      var FCATreeClone = {
        label: index + 1,
        type: "person",
        styleClass: 'p-person',
        editFCA: true,
        expanded: true,
        nodePath: 0,
        pattern: "pattern",
        data: { name: "FCA" },
        children: [
          {
            label: "Pattern",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.Pattern
            }
          },
          {
            label: "Condition",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.FCACondition
            }
          },
          {
            label: "Interval",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: `${this.FCAInterval}${" "}${"Hours"}`
            }
          },
          {
            label: "FFI",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: `${this.FCAFFInterval}${" "}${"Hours"}`
            }
          },
          {
            label: "Alpha",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.ADDalpha.toFixed(2)
            }
          },
          {
            label: "Beta",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.ADDbeta.toFixed(2)
            }
          },

        ]
      }
      var FCATree = {
        label: index + 1,
        type: "person",
        styleClass: 'p-person',
        viewFCA: true,
        FCAData: FCATreeClone,
        data: { name: "FCA" }
      }

      let MSSTREE = {
        label: index + 1,
        type: "person",
        styleClass: 'p-person',
        expanded: true,
        editMSS: true,
        data: { name: this.LSFailureMode  },
        children: [
          // {
          //   label: "Stratorgy",
          //   type: "person",
          //   styleClass: 'p-person',
          //   expanded: true,
          //   data: {
          //     name: this.MSSStratergy
          //   }
          // },

        ]

      }

      this.data1[0].children[0].children[0].FMEA[0].children[0].children[0].children.push(FMEA)
      this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children.push(FCAFMEA)
      this.data1[0].children[0].children[0].MSS[0].children[0].children[0].children.push(MSSTREE)
      this.data1[0].children[0].children[0].children.push(AddFMEA)
      this.data1[0].children[0].children[0].children[index].children.push(FCATree)
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


  CloseAttachmentModalAdd() {
    if (this.fullPath.length > 4) {
      const params = new HttpParams()
        .set("fullPath", this.fullPath)
      
    var url : string =  this.prescriptiveContantAPI.FMEADeleteFileUpload
    this.prescriptiveBLService.DeleteWithParam(url, params).subscribe(
   //   this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe(
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

      this.data1[0].children[0].children[0].FMEA[0].children[0].children[0].children[index - 1].children.push(LNode)
      this.data1[0].children[0].children[0].FMEA[0].children[0].children[0].children[index - 1].children.push(ENode)
      this.data1[0].children[0].children[0].children[index - 1].children[0].children.push(LNode)
      this.data1[0].children[0].children[0].children[index - 1].children[0].children.push(ENode)
      this.UpdatedFailureModeWithLSETree = JSON.stringify(this.data1)
      this.LSEdiv.style.display = 'none'

      this.prescriptiveTree = false
      this.Consequences1 = true;
    } else if(this.ADDDownTimeFactor == 0  ) {
      this.messageService.add({ severity: 'info', summary: 'info', detail: 'DownTime Factor is Missing' });
    }else if(this.ADDScrapeFactor == 0  ){
      this.messageService.add({ severity: 'info', summary: 'info', detail: 'Scrape Factor is Missing' });
    }else if(this.ADDSafetyFactor == 0  ){
      this.messageService.add({ severity: 'info', summary: 'info', detail: 'Safety Factor is Missing' });
    }else if(this.ADDProtectionFactor == 0  ){
      this.messageService.add({ severity: 'info', summary: 'info', detail: 'Protection Factor is Missing' });
    }else if(this.ADDFrequencyFactor == 0  ){
      this.messageService.add({ severity: 'info', summary: 'info', detail: 'Frequency Factor is Missing' });
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
    this.ConsequenceBasedMSS =this.finalConsequence
    this.prescriptiveTree = false; 
    this.ADDMSSAvailabilityYNCheck = true
    this.MSSAvailabilityCalculations = false
    this.data1[0].children[0].children[0].FMEA[0].children[0].children[0].children[index - 1].children.push(CNode)
    this.data1[0].children[0].children[0].children[index - 1].children[0].children.push(CNode)
    this.Consequences1 = false
    this.Consequences2 = false
    this.Consequences3 = false
    this.Consequences4 = false
    this.prescriptiveTree = false
    this.ConsequencesTree = false;
    this.FinalUpdate = false;
    this.FailureModePatternTree = true;
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
    this.Pattern = ""
    this.PatternPath = ""
    this.changeDetectorRef.detectChanges();
    this.PattenNode1 = 'p-person'
    this.PattenNode2 = 'p-person'
    this.PattenNode3 = 'p-person'
    this.PattenNode4 = 'p-person'
    this.PattenNode5 = 'p-person'
    this.PattenNode6 = 'p-person'
    this.PattenNode7 = 'p-person'
    this.PattenNode8 = 'p-person'
    this.PattenAnsNode1 = 'p-person'
    this.PattenAnsNode2P2 = 'p-person'
    this.PattenAnsNode2P1 = 'p-person'
    this.PattenAnsNode3P1 = 'p-person'
    this.PattenAnsNode3P2 = 'p-person'
    this.PattenAnsNode4 = 'p-person'
    this.PattenAnsNode5 = 'p-person'
    this.PattenAnsNode6P1 = 'p-person'
    this.PattenAnsNode6P2 = 'p-person'
    this.AddFMPatternAddEnable = true;
    this.UpdatePatternAddEnable = false;
    this.AddFMMSSAddEnable = true;
    this.UpdateMSSAddEnable = false
     this.MSSViewEnabled = false;
    this.changeDetectorRef.detectChanges();
    this.PatternTree()
    this.GetChartData();

  }

async AddPatternToNewFM() {

  if (this.Pattern === 'Pattern 2' || this.Pattern === 'Pattern 3' || this.Pattern === 'Pattern 6') {
    if ((this.Pattern === 'Pattern 2' || this.Pattern === 'Pattern 3'
      || this.Pattern === 'Pattern 6')
      && this.PatternPath != "") {
      var path, pattern
      if (this.Pattern === 'Pattern 2' && this.PatternPath == "1") {
        path = 1;
        pattern = 'Pattern 2'
      } else if (this.Pattern === 'Pattern 2' && this.PatternPath == "2") {
        path = 2;
        pattern = 'Pattern 2'
      } else if (this.Pattern === 'Pattern 3' && this.PatternPath == "1") {
        path = 1;
        pattern = 'Pattern 3'

      } else if (this.Pattern === 'Pattern 3' && this.PatternPath == "2") {
        path = 2;
        pattern = 'Pattern 3'

      } else if (this.Pattern === 'Pattern 6' && this.PatternPath == "1") {
        path = 1;
        pattern = 'Pattern 6'
      } else if (this.Pattern === 'Pattern 6' && this.PatternPath == "2") {
        path = 2;
        pattern = 'Pattern 6'
      }

      let Pattern = {
        label: "Pattern",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.Pattern
        }
      }
      
     let Condition = {
      label: "Condition",
      type: "person",
      styleClass: "p-person",
      expanded: true,
      data: {
        name: this.FCACondition
      }
    }
    let Interval = {
      label: "Interval",
      type: "person",
      styleClass: "p-person",
      expanded: true,
      data: {
      name: `${this.FCAInterval}${" "}${"Hours"}`
      }
    }
    let FFI = {
      label: "FFI",
      type: "person",
      styleClass: "p-person",
      expanded: true,
      data: {
        name: `${this.FCAFFInterval}${" "}${"Hours"}`
      }
    }
    let Alpha = {
      label: "Alpha",
      type: "person",
      styleClass: "p-person",
      expanded: true,
      data: {
        name: this.ADDalpha
      }
    }
    let Beta = {
      label: "Beta",
      type: "person",
      styleClass: "p-person",
      expanded: true,
      data: {
        name: this.ADDbeta
      }
    }

      this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(Pattern)
      this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(Condition)
      this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(Interval)
      this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(FFI)
      this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(Alpha)
      this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(Beta)

        if( this.ConsequenceBasedMSS == 'A' || this.ConsequenceBasedMSS == 'B' ){
          // this.ADDUsefulLife = 0;
          let SafeLife  = {
            label: "SafeLife",
            type: "person",
            styleClass: "p-person",
            expanded: true,
            data: {
              name: this.ADDSafeLife    
            }
          }
          this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(SafeLife)
          this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children.push(SafeLife)
          this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[6].data.name = this.ADDSafeLife

      }else if(this.ConsequenceBasedMSS == 'D' || this.ConsequenceBasedMSS == 'E' || this.ConsequenceBasedMSS == 'C'){
        // this.ADDSafeLife = 0;
        let UsefulLife = {
            label: "UsefulLife",
            type: "person",
            styleClass: "p-person",
            expanded: true,
            data: {
              name: this.ADDUsefulLife
            }
          }
          
          this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(UsefulLife)
          this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children.push(UsefulLife)
          this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[6].data.name = this.ADDUsefulLife
      }
      
      this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].pattern = this.Pattern;
      this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].nodePath = path;
      this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.nodePath = path
      this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.pattern = this.Pattern
      this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[0].data.name = this.Pattern
      this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[1].data.name = `${this.FCACondition}${" "}${"Hours"}`
      this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[2].data.name =`${this.FCAInterval}${" "}${"Hours"}`
      this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[3].data.name = `${this.FCAFFInterval}${" "}${"Hours"}`
      this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[4].data.name = this.ADDalpha.toFixed(2)
      this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[5].data.name = this.ADDbeta.toFixed(2)
     
    

      
      this.prescriptiveTree = true
      this.FinalUpdate = true;
      this.FailureModePatternTree = false;
      this.PatternPath = ""
      this.Pattern = ""
      this.AddFMPatternAddEnable = false;
      this.UpdatePatternAddEnable = false;
      this.AddFMMSSAddEnable = false
      this.UpdateMSSAddEnable = false
      this.MSSViewEnabled = true
      this.ADDMSSView = true
      this.MSSViewShow = true;
      this.prescriptiveTree = false

    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please Select any one color path" })
    }

  } else if (this.Pattern === 'Pattern 1' || this.Pattern === 'Pattern 4' || this.Pattern === 'Pattern 5') {

    if (this.Pattern === 'Pattern 1') {
      path = 0;
      pattern = 'Pattern 1'

    } else if (this.Pattern === 'Pattern 4') {
      path = 0;
      pattern = 'Pattern 4'

    } else if (this.Pattern === 'Pattern 5') {
      path = 0;
      pattern = 'Pattern 5'

    }

   
    let Pattern = {
      label: "Pattern",
      type: "person",
      styleClass: "p-person",
      expanded: true,
      data: {
        name: this.Pattern
      }
    }
    
   let Condition = {
    label: "Condition",
    type: "person",
    styleClass: "p-person",
    expanded: true,
    data: {
      name: this.FCACondition
    }
  }
  let Interval = {
    label: "Interval",
    type: "person",
    styleClass: "p-person",
    expanded: true,
    data: {
      name: `${this.FCAInterval}${" "}${"Hours"}`
    }
  }
  let FFI = {
    label: "FFI",
    type: "person",
    styleClass: "p-person",
    expanded: true,
    data: {
      name: `${this.FCAFFInterval}${" "}${"Hours"}`
    }
  }
  let Alpha = {
    label: "Alpha",
    type: "person",
    styleClass: "p-person",
    expanded: true,
    data: {
      name: this.ADDalpha
    }
  }
  let Beta = {
    label: "Beta",
    type: "person",
    styleClass: "p-person",
    expanded: true,
    data: {
      name: this.ADDbeta
    }
  }

  

    this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(Pattern)
    this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(Condition)
    this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(Interval)
    this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(FFI)
    this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(Alpha)
    this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(Beta)
   

      if( this.ConsequenceBasedMSS == 'C' || this.ConsequenceBasedMSS == 'D' || this.ConsequenceBasedMSS == 'E' ){
        // this.ADDSafeLife = 0;
        let UsefulLife = {
          label: "UsefulLife",
          type: "person",
          styleClass: "p-person",
          expanded: true,
          data: {
            name: this.ADDUsefulLife
          }
        }
     
        this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(UsefulLife)
        this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children.push(UsefulLife)
        this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[6].data.name = this.ADDUsefulLife

    }else if(this.ConsequenceBasedMSS == 'A' || this.ConsequenceBasedMSS == 'B'){
      // this.ADDUsefulLife = 0; 
      let SafeLife = {
          label: "SafeLife",
          type: "person",
          styleClass: "p-person",
          expanded: true,
          data: {
            name: this.ADDSafeLife
          }
        }

        this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children.push(SafeLife)
        this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children.push(SafeLife)
        this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[6].data.name = this.ADDSafeLife
    }
    
    this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].pattern = this.Pattern;
    this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].nodePath = path;
    this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.nodePath = path
    this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.pattern = this.Pattern
    this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[0].data.name = this.Pattern
    this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[1].data.name = `${this.FCACondition}${" "}${"Hours"}`
    this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[2].data.name =`${this.FCAInterval}${" "}${"Hours"}`
    this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[3].data.name =`${this.FCAFFInterval}${" "}${"Hours"}`
    this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[4].data.name = this.ADDalpha
    this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[5].data.name = this.ADDbeta
   

    
    this.prescriptiveTree = true
    this.FinalUpdate = true;
    this.FailureModePatternTree = false;
    this.PatternPath = ""
    this.Pattern = ""
    this.AddFMPatternAddEnable = false;
    this.UpdatePatternAddEnable = false;
    this.UpdateMSSAddEnable = false
    this.AddFMMSSAddEnable = false;
    this.MSSViewEnabled = true
    this.prescriptiveTree = false
    const element = document.querySelector("#ViewtoAddPattern")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  else {
    this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please Select any Pattern" })
  }
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
    Data['AttachmentDBPath'] = this.ADDUpdatedAttachmentInFMDBPath
    Data['AttachmentFullPath'] = this.ADDUpdatedAttachmentInFMFullPath
    Data['Remark'] = this.Remark
    Data['Pattern'] = this.data1[0].children[0].children[0].children[this.data1[0].children[0].children[0].children.length - 1].children[1].FCAData.children[0].data.name
    Data['FCACondition'] = JSON.stringify(this.FCACondition)
    Data['FCAInterval'] = this.FCAInterval
    Data['FCAFFI'] = this.FCAFFInterval
    Data['FCAAlpha'] = this.ADDalpha
    Data['FCABeta'] = this.ADDbeta
    Data['FCASafeLife'] = this.ADDSafeLife
    Data['FCAUsefulLife'] = this.ADDUsefulLife
    Data['FCAComment'] = JSON.stringify(this.FCAComment)
    Data['MSSMaintenanceInterval'] = this.MSSTaskObj[0].MSSMaintenanceInterval
    Data['MSSStartergy'] = this.MSSTaskObj[0].MSSStartergy
    Data['MSSMaintenanceTask'] = this.MSSTaskObj[0].MSSMaintenanceTask
    Data['MSSAvailability'] = this.MSSTaskObj[0].MSSAvailability
    Data['MSSIntervalSelectionCriteria'] = this.MSSTaskObj[0].MSSIntervalSelectionCriteria
    Data['FCAUpdateIntervals'] = JSON.stringify(this.UpdateFCAIntervals)
    Data['FCAUpdateConditions'] = JSON.stringify(this.UpdateFCACondition)
    this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(Data)
    this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = this.CPPrescriptiveUpdateData.CFPPrescriptiveId
    var url : string =  this.prescriptiveContantAPI.UpdateChanges;
    this.prescriptiveBLService.PutData(url, this.centrifugalPumpPrescriptiveOBJ).subscribe(
  //  this.http.put('api/PrescriptiveAPI/FunctionModeAndConsequenceUpdate', this.centrifugalPumpPrescriptiveOBJ).subscribe(
      res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully updated' });
        this.FinalUpdate = false;
        this.AddFailureMode = true;
        this.router.navigateByUrl('/Home/Prescriptive/List')
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
    var url : string =  this.prescriptiveContantAPI.FMEADropdownData;
    this.prescriptiveBLService.getWithParameters(url, params).subscribe(
  //  this.http.get('api/PrescriptiveLookupMasterAPI/GetRecords', { params }).subscribe(
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

    var FMEAList =  this.data1[0].children[0].children[0].FMEA[0].children[0].children[0].children
    var index5 = FMEAList.findIndex(std => std.data.name == this.DeleteFMDataFromTree.data.name);
    this.data1[0].children[0].children[0].FMEA[0].children[0].children[0].children.splice(index5,1)

    var FCAList =  this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children
    var index6 = FCAList.findIndex(std => std.data.name == this.DeleteFMDataFromTree.data.name);
    this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children.splice(index6,1)

    FailureModeWithLSETree[0].children[0].children[0].children.splice(index3, 1);

    this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = JSON.stringify(FailureModeWithLSETree)
    this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = JSON.stringify(this.data1)
    let obj = {}
    obj['CPPFMId'] = id
    this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    var url : string =  this.prescriptiveContantAPI.DeleteFailureModeFrommTree;
    this.prescriptiveBLService.PutData(url, this.centrifugalPumpPrescriptiveOBJ).subscribe(
  //  this.http.put('api/PrescriptiveAPI/FailureModeDelete', this.centrifugalPumpPrescriptiveOBJ).subscribe(
    res => {
      console.log(res)
      this.FinalDelete = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete Successfully' });
      this.router.navigateByUrl('/Home/Prescriptive/List');
    }, err => {
      console.log(err);
    }
    )
  }


  SavedConsequenceTree() {
    this.SavedConsequenceNode = [
      {
        label: "Consequences",
        type: "person",
        styleClass: this.SavedconsequenceTreeColorNodeA,
        expanded: true,
        data: {
          name:
            "Will the occurance of the failuer mode be evidient to operational stuff during normal operation of the plant?"
        },
        children: [
          {
            label: "Yes",
            type: "person",
            styleClass: this.SavedconsequenceTreeColorNodeB,
            expanded: true,
            data: {
              name:
                "Does the effect of the failure mode(or the secondary effect resulting from the failuer) have direct adverse effect on operational safety or the environment?"
            },
            children: [
              {
                label: "Yes",
                type: "person",
                styleClass: this.SavedconsequenceB,
                expanded: true,
                data: {
                  name: "B"
                }
              },
              {
                label: "No",
                type: "person",
                styleClass: this.SavedconsequenceTreeColorNodeD,
                expanded: true,
                data: {
                  name:
                    "Does the Failure mode adversily affect operational capabilities of the plant? "
                },
                children: [
                  {
                    label: "Yes",
                    type: "person",
                    styleClass: this.SavedconsequenceC,
                    expanded: true,
                    data: {
                      name: "C"
                    }
                  },
                  {
                    label: "No",
                    type: "person",
                    styleClass: this.SavedconsequenceD,
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
            styleClass: this.SavedconsequenceTreeColorNodeC,
            expanded: true,
            data: {
              name:
                "Does the combination of the failure mode and one additonal failure or event result in an adverse effect safety of the environment?  "
            },
            children: [
              {
                label: "Yes",
                type: "person",
                styleClass: this.SavedconsequenceA,
                expanded: true,
                data: {
                  name: "A "
                }
              },
              {
                label: "No",
                type: "person",
                styleClass: this.SavedconsequenceE,
                expanded: true,
                data: {
                  name: "E"
                }
              }
            ]
          }
        ]
      }
    ]

  }
  colorForUpdateTree() {
    if (this.UpdateFailureModeConsequence == "E") {
      this.SavedconsequenceTreeColorNodeA = 'p-person1'
      this.SavedconsequenceTreeColorNodeB = 'p-person'
      this.SavedconsequenceTreeColorNodeC = 'p-person1'
      this.SavedconsequenceTreeColorNodeD = 'p-person'
      this.SavedconsequenceA = 'p-person'
      this.SavedconsequenceB = 'p-person'
      this.SavedconsequenceC = 'p-person'
      this.SavedconsequenceD = 'p-person'
      this.SavedconsequenceE = 'p-person1'
      this.SavedConsequenceTree();
    } else if (this.UpdateFailureModeConsequence == 'B') {
      this.SavedconsequenceTreeColorNodeA = 'p-person1'
      this.SavedconsequenceTreeColorNodeB = 'p-person1'
      this.SavedconsequenceTreeColorNodeC = 'p-person'
      this.SavedconsequenceTreeColorNodeD = 'p-person'
      this.SavedconsequenceA = 'p-person'
      this.SavedconsequenceB = 'p-person1'
      this.SavedconsequenceC = 'p-person'
      this.SavedconsequenceD = 'p-person'
      this.SavedconsequenceE = 'p-person'
      this.SavedConsequenceTree();
    } else if (this.UpdateFailureModeConsequence == 'C') {
      this.SavedconsequenceTreeColorNodeA = 'p-person1'
      this.SavedconsequenceTreeColorNodeB = 'p-person'
      this.SavedconsequenceTreeColorNodeC = 'p-person1'
      this.SavedconsequenceTreeColorNodeD = 'p-person'
      this.SavedconsequenceA = 'p-person'
      this.SavedconsequenceB = 'p-person'
      this.SavedconsequenceC = 'p-person1'
      this.SavedconsequenceD = 'p-person'
      this.SavedconsequenceE = 'p-person'
      this.SavedConsequenceTree();
    } else if (this.UpdateFailureModeConsequence == 'D') {
      this.SavedconsequenceTreeColorNodeA = 'p-person1'
      this.SavedconsequenceTreeColorNodeB = 'p-person1'
      this.SavedconsequenceTreeColorNodeC = 'p-person'
      this.SavedconsequenceTreeColorNodeD = 'p-person1'
      this.SavedconsequenceA = 'p-person'
      this.SavedconsequenceB = 'p-person'
      this.SavedconsequenceC = 'p-person'
      this.SavedconsequenceD = 'p-person1'
      this.SavedconsequenceE = 'p-person'
      this.SavedConsequenceTree();
    } else if (this.UpdateFailureModeConsequence == 'A') {
      this.SavedconsequenceTreeColorNodeA = 'p-person1'
      this.SavedconsequenceTreeColorNodeB = 'p-person'
      this.SavedconsequenceTreeColorNodeC = 'p-person'
      this.SavedconsequenceTreeColorNodeD = 'p-person'
      this.SavedconsequenceA = 'p-person1'
      this.SavedconsequenceB = 'p-person'
      this.SavedconsequenceC = 'p-person'
      this.SavedconsequenceD = 'p-person'
      this.SavedconsequenceE = 'p-person'
      this.SavedConsequenceTree();

    }
  }
  async ChangeConsequence() {
    this.Consequences1 = true
    this.UpdateColorTreeEnable = true;
    this.changeDetectorRef.detectChanges();
    const element = document.querySelector("#ScrollUpdateTree4")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  PatternUpdateCancel(){
    this.FailureModePatternTree = false;
  }
  

 async SelectNodeToView(p){
    this.UpdateMSSImageFlag = false;
    this.FailureModePatternTree = false
    this.PatternBack = p.pattern;
    this.nodePath = p.nodePath;
    this.FCAViewEnabled = true
    this.MSSViewEnabled = false
    this.FCAViewTreeEnabled = true
    this.FCAView = []
    this.FCAView.push(p.FCAData)
    const element = document.querySelector("#viewFCAPatterns")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'end' })
    // this.FCAViewEnabled = true
    this.FCAViewTreeEnabled = true
    this.changeDetectorRef.detectChanges();
    await this.GetChartToView(this.FCAView[0].children[0].data.name)
    await this.ColorPatternTreUpdate(p.pattern, p.nodePath)
    this.GetChartData();
    // const element = document.querySelector("#viewFCA")
    // if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

  
  }

  ColorPatternTreUpdate(value , nodePath){
    this.Pattern = value;
    this.changeDetectorRef.detectChanges();
    this.PattenNode1 = 'p-person'
    this.PattenNode2 = 'p-person'
    this.PattenNode3 = 'p-person'
    this.PattenNode4 = 'p-person'
    this.PattenNode5 = 'p-person'
    this.PattenNode6 = 'p-person'
    this.PattenNode7 = 'p-person'
    this.PattenNode8 = 'p-person'
    this.PattenAnsNode1 = 'p-person'
    this.PattenAnsNode2P2 = 'p-person'
    this.PattenAnsNode2P1 = 'p-person'
    this.PattenAnsNode3P1 = 'p-person'
    this.PattenAnsNode3P2 = 'p-person'
    this.PattenAnsNode4 = 'p-person'
    this.PattenAnsNode5 = 'p-person'
    this.PattenAnsNode6P1 = 'p-person'
    this.PattenAnsNode6P2 = 'p-person'

    if (value === 'Pattern 1') {
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'p-person'
      this.PattenNode3 = 'StylePattern'
      this.PattenNode4 = 'p-person'
      this.PattenNode5 = 'p-person'
      this.PattenNode6 = 'p-person'
      this.PattenNode7 = 'p-person'
      this.PattenNode8 = 'p-person'
      this.PattenAnsNode1 = 'StylePattern'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()

    } else if (value === 'Pattern 2') {
      if(nodePath == 1){
        this.PattenNode1 = 'StylePattern1'
        this.PattenNode2 = 'StylePattern1'
        this.PattenNode5 = 'StylePattern1'
        this.PattenAnsNode2P1 = 'StylePattern1'
      }
      if(nodePath == 2){
      this.PattenNode1 = 'StylePattern2'
      this.PattenNode3 = 'StylePattern2'
      this.PattenNode4 = 'p-person'
      this.PattenNode6 = 'StylePattern2'
      this.PattenNode7 = 'p-person'
      this.PattenNode8 = 'p-person'
      this.PattenAnsNode2P2 = 'StylePattern2'
      }
      this.changeDetectorRef.detectChanges();
      this.PatternTree()



    } else if (value === 'Pattern 3') {
      if(nodePath == 1){
      this.PattenNode1 = 'StylePattern1'
      this.PattenNode2 = 'StylePattern1'
      this.PattenNode5 = 'StylePattern1'
      this.PattenAnsNode3P1 = 'StylePattern1'
      }
      if(nodePath == 2){
      this.PattenNode1 = 'StylePattern2'
      this.PattenNode3 = 'StylePattern2'
      this.PattenNode6 = 'StylePattern2'
      this.PattenNode8 = 'StylePattern2'
      this.PattenAnsNode3P2 = 'StylePattern2'
      }
      this.changeDetectorRef.detectChanges();
      this.PatternTree()


    } else if (value === 'Pattern 4') {
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'StylePattern'
      this.PattenNode4 = 'StylePattern'
      this.PattenAnsNode4 = 'StylePattern'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()

    } else if (value === 'Pattern 5') {
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'StylePattern'
      this.PattenNode4 = 'StylePattern'
      this.PattenNode7 = 'StylePattern'
      this.PattenAnsNode5 = 'StylePattern'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()

    } else if (value === 'Pattern 6') {
      if(nodePath == 1){
      this.PattenNode1 = 'StylePattern1'
      this.PattenNode2 = 'StylePattern1'
      this.PattenNode4 = 'StylePattern1'
      this.PattenNode7 = 'StylePattern1'
      this.PattenAnsNode6P1 = 'StylePattern1'
      }
      if(nodePath == 2){
      this.PattenNode1 = 'StylePattern2'
      this.PattenNode3 = 'StylePattern2'
      this.PattenNode6 = 'StylePattern2'
      this.PattenNode8 = 'StylePattern2'
      this.PattenAnsNode6P2 = 'StylePattern2'
      }
      this.changeDetectorRef.detectChanges();
      this.PatternTree()

    } 
  }

async SelectNodeToEdit(p){
  const element = document.querySelector("#ViewPatternForEdit")
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'end' })

 }

 async CloseFCAUpdateView(){
  this.FCAViewEnabled = false
  this.FCAViewTreeEnabled = false
  const element = document.querySelector("#prescriptive")
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async UpdatePattern(){
  this.FCAViewTreeEnabled = false
  this.FCAUpdatePageEnable = true
  this.FailureModePatternTree = true
  this.AddFMPatternAddEnable = false;
  // this.UpdatePatternAddEnable = true;
  this.UpdateMSSImageFlag = false;
  this.changeDetectorRef.detectChanges();
  this.GetChartData();
  const element = document.querySelector("#ViewtoAddPattern")
   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start'}) 

  // const element = document.querySelector("#ViewPatternForEdit")
  // if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start'}) 
}
 
 GetChartToView(p : string){
  this.FCAViewEnabled = true
  if (p == 'Pattern 1') {
    const patternLabel1 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData1 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 20];
    this.getChartTree(patternLabel1, patternData1, 'ViewPattern',p);
  } else if (p == 'Pattern 2') {
    const patternLabel2 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData2 = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 8, 10, 20];
    this.getChartTree(patternLabel2, patternData2, 'ViewPattern',p);
  } else if (p == 'Pattern 3') {
    const patternLabel3 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData3 = [0, 0, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 14, 15, 20];
    this.getChartTree(patternLabel3, patternData3, 'ViewPattern',p);
  } else if (p == 'Pattern 4') {
    const patternLabel4 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData4 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1, 1, 1, 1];
    this.getChartTree(patternLabel4, patternData4,'ViewPattern',p);
  } else if (p == 'Pattern 5') {
    const patternLabel5 = ["20", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "20"];
    const patternData5 = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    this.getChartTree(patternLabel5, patternData5, 'ViewPattern',p);
  } else if (p == 'Pattern 6') {
    const patternLabel6 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData6 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
    this.getChartTree(patternLabel6, patternData6, 'ViewPattern', p);
  }
}


private getChartTree(labels: any[], data: any[], id: string, title: string) {
  let patternCharts = new Chart(id, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Time',
        data: data,
        fill: true,
        borderColor: '#2196f3',
        backgroundColor: '#2196f3',
        borderWidth: 1
      }]
    },
    options: {
      elements: {
        point: {
          radius: 0
        }
      },
      title: {
        display: true,
        text: title
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }],
        yAxes: [{
          gridLines: {
            display: true,
            color: 'rgba(219,219,219,0.3)',
            zeroLineColor: 'rgba(219,219,219,0.3)',
            drawBorder: false,
            lineWidth: 27,
            zeroLineWidth: 1
          },
          ticks: {
            beginAtZero: true,
            display: false
          },
          scaleLabel: {
            display: true,
            labelString: 'Failure probability'
          }
        }]
      }
    }
  });
  this.changeDetectorRef.detectChanges();
}


PatternTree() {
 var Abc = [
    {
      label: "Pattern",
      type: "person",
      styleClass: this.PattenNode1,
      // node:"Node1",
      expanded: true,
      data: { name: "Are Failures caused by wear elments" },
      children: [
        {
          label: "No",
          type: "person",
          styleClass: this.PattenNode2,
          // node:"Node2",
          expanded: true,
          data: {
            name:
              "Are failures caused by envrionmental chemical or stress reaction?"
          },
          children: [
            {
              label: "No",
              type: "person",
              styleClass: this.PattenNode4,
              // node:"Node4",
              expanded: true,
              data: {
                name:
                  "Are failures mostly random with only a few early life failures"
              },
              children: [
                {
                  label: "Yes",
                  type: "person",
                  styleClass: this.PattenAnsNode4,
                  expanded: true,
                  data: {
                    name: "Pattern 4"
                  }
                },
                {
                  label: "No",
                  type: "person",
                  styleClass: this.PattenNode7,
                  // node:"Node7",
                  expanded: true,
                  data: {
                    name:
                      "Do more failures Occur Shortly after Installation repair or overhaul"
                  },
                  children: [
                    {
                      label: "Yes",
                      type: "person",
                      styleClass: this.PattenAnsNode6P1,
                      expanded: true,
                      data: {
                        name: "Pattern 6"
                      }
                    },
                    {
                      label: "No",
                      type: "person",
                      styleClass: this.PattenAnsNode5,
                      expanded: true,
                      data: {
                        name: "Pattern 5"
                      }
                    }
                  ]
                }
              ]
            },
            {
              label: "Yes",
              type: "person",
              styleClass: this.PattenNode5,
              // node:"Node5",
              expanded: true,
              data: {
                name:
                  "Do failures increase steadily with time but without a discernable sudden increase?"
              },
              children: [
                {
                  label: "Yes",
                  type: "person",
                  styleClass: this.PattenAnsNode3P1,
                  expanded: true,
                  data: {
                    name: "Pattern 3"
                  }
                },
                {
                  label: "No",
                  type: "person",
                  styleClass: this.PattenAnsNode2P1,
                  expanded: true,
                  data: {
                    name: "Pattern 2"
                  }
                }
              ]
            }
          ]
        },
        {
          label: "Yes",
          type: "person",
          styleClass: this.PattenNode3,
          // node:"Node3",
          expanded: true,
          data: {
            name:
              "Are failures a combination Of early life random and late life"
          },
          children: [
            {
              label: "Yes",
              type: "person",
              styleClass: this.PattenAnsNode1,
              expanded: true,
              data: {
                name: "Pattern 1"
              }
            },
            {
              label: "No",
              type: "person",
              styleClass: this.PattenNode6,
              // node:"Node6",
              expanded: true,
              data: {
                name:
                  "Do high Percentage failures occuer at a reasonably consistent age"
              },
              children: [
                {
                  label: "Yes",
                  type: "person",
                  styleClass: this.PattenAnsNode2P2,
                  expanded: true,
                  data: {
                    name: "Pattern 2"
                  }
                },
                {
                  label: "No",
                  type: "person",
                  styleClass: this.PattenNode8,
                  expanded: true,
                  data: {
                    name:
                      "Do more failures Occur Shortly after Installation repair or overhaul"
                  },
                  children: [
                    {
                      label: "Yes",
                      type: "person",
                      styleClass: this.PattenAnsNode6P2,
                      expanded: true,
                      data: {
                        name: "Pattern 6"
                      }
                    },
                    {
                      label: "No",
                      type: "person",
                      styleClass: this.PattenAnsNode3P2,
                      expanded: true,
                      data: {
                        name: "Pattern 3"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  this.FCAdata1 = Abc
  this.FCAChangeData = Abc
}

private GetChartData() {
  const patternLabel1 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
  const patternData1 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 20];
  this.getChartTree(patternLabel1, patternData1, 'pattern1', 'Pattern 1');

  const patternLabel2 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
  const patternData2 = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 8, 10, 20];
  this.getChartTree(patternLabel2, patternData2, 'pattern2', 'Pattern 2');

  const patternLabel3 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
  const patternData3 = [0, 0, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 14, 15, 20];
  this.getChartTree(patternLabel3, patternData3, 'pattern3', 'Pattern 3');

  const patternLabel4 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
  const patternData4 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1, 1, 1, 1];
  this.getChartTree(patternLabel4, patternData4, 'pattern4', 'Pattern 4');

  const patternLabel5 = ["20", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "20"];
  const patternData5 = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
  this.getChartTree(patternLabel5, patternData5, 'pattern5', 'Pattern 5');

  const patternLabel6 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
  const patternData6 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
  this.getChartTree(patternLabel6, patternData6, 'pattern6', 'Pattern 6');
}

PatternUpdateBack(){
  this.FailureModePatternTree = false;
  this.FCAViewTreeEnabled = true
  this.ColorPatternTreUpdate(this.PatternBack, this.nodePath )
}

 async PatternUpdateAdd(){
  var FCAIntervalDWY : any, FCAIntervalDWYValues : any;
  if(this.Updateinterval == 'Days'){ 
    FCAIntervalDWY = 'Days';
    FCAIntervalDWYValues = this.UpdateintervalValue;
    this.UpdateFCAIntervalsFINAL.push({FCAIntervalDWY}) 
    this.UpdateFCAIntervalsFINAL.push({FCAIntervalDWYValues})
    this.UpdateFinalFCAInterval = this.UpdateintervalValue * 1 * 24
  } else if(this.Updateinterval == 'Week'){ 
    FCAIntervalDWY = 'Week';
    FCAIntervalDWYValues = this.UpdateintervalValue;
    this.UpdateFCAIntervalsFINAL.push({FCAIntervalDWY}) 
    this.UpdateFCAIntervalsFINAL.push({FCAIntervalDWYValues})
    this.UpdateFinalFCAInterval = this.UpdateintervalValue * 7 * 24
  } else if(this.Updateinterval == 'Month'){ 
    FCAIntervalDWY = 'Month';
    FCAIntervalDWYValues = this.UpdateintervalValue;
    this.UpdateFCAIntervalsFINAL.push({FCAIntervalDWY}) 
    this.UpdateFCAIntervalsFINAL.push({FCAIntervalDWYValues})
    this.UpdateFinalFCAInterval = this.UpdateintervalValue * 30 * 24
  } else if(this.Updateinterval == 'Year'){ 
    FCAIntervalDWY = 'Year';
    FCAIntervalDWYValues = this.UpdateintervalValue;
    this.UpdateFCAIntervalsFINAL.push({FCAIntervalDWY}) 
    this.UpdateFCAIntervalsFINAL.push({FCAIntervalDWYValues}) 
    this.UpdateFinalFCAInterval = this.UpdateintervalValue * 365 * 24
  }

  var FCAFFIIntervalDWY : any, FCAFFIIntervalDWYValues : any;
  if(this.UpdateffInterval == 'Days'){ 
    FCAFFIIntervalDWY = 'Days';
    FCAFFIIntervalDWYValues = this.UpdateffIntervalValue;
    this.UpdateFCAIntervalsFINAL.push({FCAFFIIntervalDWY}) 
    this.UpdateFCAIntervalsFINAL.push({FCAFFIIntervalDWYValues})
    this.UpdateFinalFCAFFIInterval = this.UpdateffIntervalValue * 1 * 24
  } else if(this.UpdateffInterval == 'Week'){ 
    FCAFFIIntervalDWY = 'Week';
    FCAFFIIntervalDWYValues = this.UpdateffIntervalValue;
    this.UpdateFCAIntervalsFINAL.push({FCAFFIIntervalDWY}) 
    this.UpdateFCAIntervalsFINAL.push({FCAFFIIntervalDWYValues})
    this.UpdateFinalFCAFFIInterval = this.UpdateffIntervalValue * 7 * 24
  } else if(this.UpdateffInterval == 'Month'){ 
    FCAFFIIntervalDWY = 'Month';
    FCAFFIIntervalDWYValues = this.UpdateffIntervalValue;
    this.UpdateFCAIntervalsFINAL.push({FCAFFIIntervalDWY}) 
    this.UpdateFCAIntervalsFINAL.push({FCAFFIIntervalDWYValues})
    this.UpdateFinalFCAFFIInterval = this.UpdateffIntervalValue * 30 * 24
  } else if(this.UpdateffInterval == 'Year'){  
    FCAFFIIntervalDWY = 'Year';
    FCAFFIIntervalDWYValues = this.UpdateffIntervalValue;
    this.UpdateFCAIntervalsFINAL.push({FCAFFIIntervalDWY}) 
    this.UpdateFCAIntervalsFINAL.push({FCAFFIIntervalDWYValues})
    this.UpdateFinalFCAFFIInterval = this.UpdateffIntervalValue * 365 * 24
  }

  var Vibration : string = "", Noice : string = "", Leakage : string = "",
  PerformanceDrop : string = "", TempratureChange : string = "",
  EmmisionChange : string = "", IncreaseLubricantConsumption : string = "", 
  Other: string = "";
  
  Vibration = this.UpdateVibration
  Noice = this.UpdateNoice
  Leakage = this.UpdateLeakage
  PerformanceDrop = this.UpdatePerformanceDrop
  TempratureChange = this.UpdateTempratureChange
  EmmisionChange = this.UpdateEmmisionChange
  IncreaseLubricantConsumption = this.UpdateIncreaseLubricantConsumption
  Other = this.UpdateOther

  if(this.UpdateVibration != ""){
  this.UpdateVibration = "Vibration"
  Vibration = "Vibration"
  this.UpdateFinalFCACondition.push(this.UpdateVibration)
  }
  if(this.UpdateNoice != ""){
  this.UpdateNoice = "Noice"
  Noice = "Noice"
  this.UpdateFinalFCACondition.push(this.UpdateNoice)
  }
  if(this.UpdateLeakage != ""){
  this.UpdateLeakage = "Leakage"
  this.UpdateFinalFCACondition.push(this.UpdateLeakage)
  Leakage = "Leakage"

  }
  if(this.UpdatePerformanceDrop != ""){
  this.UpdatePerformanceDrop = "Performance Drop"
  this.UpdateFinalFCACondition.push(this.UpdatePerformanceDrop)
  PerformanceDrop = "Performance Drop"
  }
  if(this.UpdateTempratureChange != ""){
  this.UpdateTempratureChange = "Temprature Change"
  this.UpdateFinalFCACondition.push(this.UpdateTempratureChange)
  TempratureChange = "Temprature Change"
  }
  if(this.UpdateEmmisionChange != ""){
  this.UpdateEmmisionChange = "Emmision Change"
  this.UpdateFinalFCACondition.push(this.UpdateEmmisionChange)
  EmmisionChange = "Emmision Change"
  }
  if(this.UpdateIncreaseLubricantConsumption != ""){
  this.UpdateIncreaseLubricantConsumption = "Increase Lubricant Consumption"
  this.UpdateFinalFCACondition.push(this.UpdateIncreaseLubricantConsumption)
  IncreaseLubricantConsumption = "Increase Lubricant Consumption"
  }
  if(this.UpdateOther != ""){
  this.UpdateOther = "Other"
  this.UpdateFinalFCACondition.push(this.UpdateOther)
  Other = "Other"
  }

this.UpdateFCAConditionsFINAL.push({Vibration})
this.UpdateFCAConditionsFINAL.push({Noice})
this.UpdateFCAConditionsFINAL.push({Leakage})
this.UpdateFCAConditionsFINAL.push({PerformanceDrop})
this.UpdateFCAConditionsFINAL.push({TempratureChange})
this.UpdateFCAConditionsFINAL.push({EmmisionChange})
this.UpdateFCAConditionsFINAL.push({IncreaseLubricantConsumption})
this.UpdateFCAConditionsFINAL.push({Other})

var HumanSenses : string = "",  ExistingInstumentation : string = "",  NewInstumentation : string = "",  ProcessCondtions : string = "",  SampleAnyalysis : string = ""
HumanSenses = this.UpdateHumanSenses
ExistingInstumentation = this.UpdateExistingInstumentation
NewInstumentation = this.UpdateNewInstumentation
ProcessCondtions = this.UpdateProcessCondtions
SampleAnyalysis = this.UpdateSampleAnyalysis
if(this.UpdateHumanSenses != ""){
this.UpdateHumanSenses = "Human Senses"
HumanSenses = "Human Senses"
this.UpdateFinalFCACondition.push(this.UpdateHumanSenses)

}
if(this.UpdateExistingInstumentation != ""){
this.UpdateExistingInstumentation = "Existing Instumentation(portable or fixed)"
ExistingInstumentation = "Existing Instumentation(portable or fixed)"
this.UpdateFinalFCACondition.push(this.UpdateExistingInstumentation)

}
if(this.UpdateNewInstumentation != ""){
this.UpdateNewInstumentation = "New Instumentation(portable or fixed)"
NewInstumentation = "New Instumentation(portable or fixed)"
this.UpdateFinalFCACondition.push(this.UpdateNewInstumentation)

}
if(this.UpdateProcessCondtions != ""){
this.UpdateProcessCondtions = "Process Condtions"
ProcessCondtions = "Process Condtions"
this.UpdateFinalFCACondition.push(this.UpdateProcessCondtions)
}
if(this.UpdateSampleAnyalysis != ""){
this.UpdateSampleAnyalysis = "Sample Anyalysis"
SampleAnyalysis = "Sample Anyalysis"
this.UpdateFinalFCACondition.push(this.UpdateSampleAnyalysis)
}


this.UpdateFCAConditionsFINAL.push({HumanSenses})
this.UpdateFCAConditionsFINAL.push({ExistingInstumentation})
this.UpdateFCAConditionsFINAL.push({NewInstumentation})
this.UpdateFCAConditionsFINAL.push({ProcessCondtions})
this.UpdateFCAConditionsFINAL.push({SampleAnyalysis})

if(this.UpdateSafeLife != 0 ){
  this.UpdateSafeLife = this.UpdateFinalSafeUsefulLife
}else if(this.UpdateUsefulLife != 0 ){
  this.UpdateUsefulLife = this.UpdateFinalSafeUsefulLife
}

this.UpdateFCACommentFINAL.push(this.UpdateCommentFIEYN)
this.UpdateFCACommentFINAL.push(this.UpdateCommentFIEYN2)
this.UpdateFCACommentFINAL.push(this.UpdateFCAFreeText)

  this.FCAUpdatePageEnable = false
  this.FCAView[0].children[0].data.name = this.Pattern
  this.FCAView[0].children[1].data.name = this.UpdateFinalFCACondition
  this.FCAView[0].children[2].data.name = this.UpdateFinalFCAInterval
  this.FCAView[0].children[3].data.name = this.UpdateFinalFCAFFIInterval
  this.FCAView[0].children[4].data.name = this.UpdateAlpha.toFixed(2)
  this.FCAView[0].children[5].data.name = this.UpdateBeta.toFixed(2)
  this.FCAView[0].children[6].data.name = this.UpdateFinalSafeUsefulLife
  this.data1[0].children[0].children[0].children[this.FCAView[0].label -1].children[1].pattern = this.Pattern
  this.data1[0].children[0].children[0].children[this.FCAView[0].label -1].children[1].nodePath = 0
  this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.FCAView[0].label -1].children[0].data.name = this.Pattern
  this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.FCAView[0].label -1].children[1].data.name = this.UpdateFinalFCACondition
  this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.FCAView[0].label -1].children[2].data.name = this.UpdateFinalFCAInterval
  this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.FCAView[0].label -1].children[3].data.name = this.UpdateFinalFCAFFIInterval
  this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.FCAView[0].label -1].children[4].data.name = this.UpdateAlpha.toFixed(2)
  this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.FCAView[0].label -1].children[5].data.name = this.UpdateBeta.toFixed(2)
  this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children[this.FCAView[0].label -1].children[6].data.name = this.UpdateFinalSafeUsefulLife
  this.FCAViewEnabled = false
  this.FCAViewTreeEnabled = false
  this.changeDetectorRef.detectChanges()
  this.FCAViewEnabled = true
  this.FCAViewTreeEnabled = true
 
  this.FCAView[0].pattern = this.Pattern
  this.FCAView[0].nodePath = 0
  this.EnabledPatternUpdate = true;
  this.AddFMPatternAddEnable = false;
  this.UpdatePatternAddEnable = false;

  if (this.Pattern == 'Pattern 1') {
    const patternLabel1 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData1 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 20];
    this.getChartTree(patternLabel1, patternData1, 'ViewPattern',this.Pattern);
  } else if (this.Pattern == 'Pattern 2') {
    const patternLabel2 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData2 = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 8, 10, 20];
    this.getChartTree(patternLabel2, patternData2, 'ViewPattern',this.Pattern);
  } else if (this.Pattern == 'Pattern 3') {
    const patternLabel3 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData3 = [0, 0, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 14, 15, 20];
    this.getChartTree(patternLabel3, patternData3, 'ViewPattern',this.Pattern);
  } else if (this.Pattern == 'Pattern 4') {
    const patternLabel4 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData4 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1, 1, 1, 1];
    this.getChartTree(patternLabel4, patternData4,'ViewPattern',this.Pattern);
  } else if (this.Pattern == 'Pattern 5') {
    const patternLabel5 = ["20", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "20"];
    const patternData5 = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    this.getChartTree(patternLabel5, patternData5, 'ViewPattern', this.Pattern);
  } else if (this.Pattern == 'Pattern 6') {
    const patternLabel6 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData6 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
    this.getChartTree(patternLabel6, patternData6, 'ViewPattern', this.Pattern);
  }
  if (this.Pattern === 'Pattern 2' || this.Pattern === 'Pattern 3' || this.Pattern === 'Pattern 6') {
    if(this.PatternPath == '1'){
      this.ColorPatternTreUpdate(this.Pattern, 1)
      this.FCAView[0].nodePath = 1
      this.data1[0].children[0].children[0].children[this.FCAView[0].label -1].children[1].nodePath = 1
    }else if(this.PatternPath == '2'){
        this.ColorPatternTreUpdate(this.Pattern, 2)
        this.FCAView[0].nodePath = 2
        this.data1[0].children[0].children[0].children[this.FCAView[0].label -1].children[1].nodePath = 2
    }
   
  }else if (this.Pattern === 'Pattern 1' || this.Pattern === 'Pattern 4' || this.Pattern === 'Pattern 5') {
    this.ColorPatternTreUpdate(this.Pattern, 0)
  }
  this.changeDetectorRef.detectChanges();
  // const element = document.querySelector("#FCAViewTreeEnable")
  // if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' }) 
  
  const element = document.querySelector("#viewFCAPatterns")
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start'})
  this.FailureModePatternTree = false;
  this.FCAViewTreeEnabled = true
}

public EnabledPatternUpdate : boolean = false
 async SaveUpdatedPattern(){
    var CPObj : CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();
    CPObj.CFPPrescriptiveId =  this.CPPrescriptiveUpdateData.CFPPrescriptiveId;
    CPObj.FMWithConsequenceTree = JSON.stringify(this.data1)
    var FM, LE, SE, Con

    this.data1[0].children[0].children[0].FCA[0].children[0].children[0].children.forEach(element => {
      if(element.data.name == FM && element.label == this.FCAView[0].label){
        element.children[0].data.name = this.Pattern
        element.children[1].data.name = this.UpdateFinalFCACondition
        element.children[2].data.name = this.UpdateFinalFCAInterval
        element.children[3].data.name = this.UpdateFinalFCAFFIInterval
        element.children[4].data.name = this.UpdateAlpha
        element.children[5].data.name = this.UpdateBeta
        if(this.UpdateSafeLife != 0){
          element.children[6].data.name = this.UpdateSafeLife
        }else if(this.UpdateUsefulLife != 0){
        element.children[6].data.name = this.UpdateUsefulLife
        }
      }
    })
    
    this.data1[0].children[0].children[0].children.forEach(element => {
            if(element.label == this.FCAView[0].label ){
               FM = element.data.name
               LE = element.children[0].children[0].data.name
               SE = element.children[0].children[1].data.name
               Con = element.children[0].children[2].data.name
            }
    });

    this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
          if(element.FunctionMode == FM && element.LocalEffect == LE && element.SystemEffect == SE && element.Consequence == Con){
            element.Pattern = this.Pattern
            element.FCACondition = JSON.stringify(this.UpdateFinalFCACondition)
            element.FCAInterval = this.UpdateFinalFCAInterval
            element.FCAFFI = this.UpdateFinalFCAFFIInterval
            element.FCAAlpha = this.UpdateAlpha
            element.FCABeta = this.UpdateBeta
            element.FCASafeLife = this.UpdateSafeLife
            element.FCAUsefulLife = this.UpdateUsefulLife
            element.FCAUpdateIntervals = JSON.stringify(this.UpdateFCAIntervalsFINAL)
            element.FCAUpdateConditions = JSON.stringify(this.UpdateFCAConditionsFINAL)
            element.FCAComment = JSON.stringify(this.UpdateFCACommentFINAL)
            CPObj.centrifugalPumpPrescriptiveFailureModes.push(element)
          }
    });
    var url : string =  this.prescriptiveContantAPI.SaveUpdatedPattern;
    this.prescriptiveBLService.PutData(url, CPObj).subscribe(
  //  this.http.put('api/PrescriptiveAPI/UpdatePrespectivePattern', CPObj).subscribe(
      res => {
        this.router.navigateByUrl('/Home/Prescriptive/List')
      }, err => { console.log(err.error)}
    )

}

SelectPatternForFailureMode(value: string) {
  this.Pattern = value;
  this.ADDFailureModePatternTree = true
  this.changeDetectorRef.detectChanges();
  this.changeDetectorRef.detectChanges();
  this.PattenNode1 = 'p-person'
  this.PattenNode2 = 'p-person'
  this.PattenNode3 = 'p-person'
  this.PattenNode4 = 'p-person'
  this.PattenNode5 = 'p-person'
  this.PattenNode6 = 'p-person'
  this.PattenNode7 = 'p-person'
  this.PattenNode8 = 'p-person'
  this.PattenAnsNode1 = 'p-person'
  this.PattenAnsNode2P2 = 'p-person'
  this.PattenAnsNode2P1 = 'p-person'
  this.PattenAnsNode3P1 = 'p-person'
  this.PattenAnsNode3P2 = 'p-person'
  this.PattenAnsNode4 = 'p-person'
  this.PattenAnsNode5 = 'p-person'
  this.PattenAnsNode6P1 = 'p-person'
  this.PattenAnsNode6P2 = 'p-person'
  this.PatternPathEnable = false

  if (value === 'Pattern 1') {
    this.PattenNode1 = 'StylePattern'
    this.PattenNode2 = 'p-person'
    this.PattenNode3 = 'StylePattern'
    this.PattenNode4 = 'p-person'
    this.PattenNode5 = 'p-person'
    this.PattenNode6 = 'p-person'
    this.PattenNode7 = 'p-person'
    this.PattenNode8 = 'p-person'
    this.PattenAnsNode1 = 'StylePattern'
    this.changeDetectorRef.detectChanges();
    this.PatternTree()

  } else if (value === 'Pattern 2') {
    this.PatternPathEnable = true
    this.PattenNode2 = 'StylePattern1'
    this.PattenNode5 = 'StylePattern1'
    this.PattenAnsNode2P1 = 'StylePattern1'

    this.PattenNode1 = 'StylePattern'
    this.PattenNode3 = 'StylePattern2'
    this.PattenNode4 = 'p-person'
    this.PattenNode6 = 'StylePattern2'
    this.PattenNode7 = 'p-person'
    this.PattenNode8 = 'p-person'
    this.PattenAnsNode2P2 = 'StylePattern2'
    this.changeDetectorRef.detectChanges();
    this.PatternTree()



  } else if (value === 'Pattern 3') {
    this.PatternPathEnable = true
    this.PattenNode1 = 'StylePattern'
    this.PattenNode2 = 'StylePattern1'
    this.PattenNode5 = 'StylePattern1'
    this.PattenAnsNode3P1 = 'StylePattern1'
    this.PattenNode3 = 'StylePattern2'
    this.PattenNode6 = 'StylePattern2'
    this.PattenNode8 = 'StylePattern2'
    this.PattenAnsNode3P2 = 'StylePattern2'
    this.changeDetectorRef.detectChanges();
    this.PatternTree()


  } else if (value === 'Pattern 4') {
    this.PattenNode1 = 'StylePattern'
    this.PattenNode2 = 'StylePattern'
    this.PattenNode4 = 'StylePattern'
    this.PattenAnsNode4 = 'StylePattern'
    this.changeDetectorRef.detectChanges();
    this.PatternTree()

  } else if (value === 'Pattern 5') {
    this.PattenNode1 = 'StylePattern'
    this.PattenNode2 = 'StylePattern'
    this.PattenNode4 = 'StylePattern'
    this.PattenNode7 = 'StylePattern'
    this.PattenAnsNode5 = 'StylePattern'
    this.changeDetectorRef.detectChanges();
    this.PatternTree()

  } else if (value === 'Pattern 6') {
    this.PatternPathEnable = true
    this.PattenNode1 = 'StylePattern'
    this.PattenNode2 = 'StylePattern1'
    this.PattenNode4 = 'StylePattern1'
    this.PattenNode7 = 'StylePattern1'
    this.PattenAnsNode6P1 = 'StylePattern1'

    this.PattenNode3 = 'StylePattern2'
    this.PattenNode6 = 'StylePattern2'
    this.PattenNode8 = 'StylePattern2'
    this.PattenAnsNode6P2 = 'StylePattern2'

    this.changeDetectorRef.detectChanges();
    this.PatternTree()

  } else if (value === "") {
    this.PattenNode1 = 'p-person'
    this.PattenNode2 = 'p-person'
    this.PattenNode3 = 'p-person'
    this.PattenNode4 = 'p-person'
    this.PattenNode5 = 'p-person'
    this.PattenNode6 = 'p-person'
    this.PattenNode7 = 'p-person'
    this.PattenNode8 = 'p-person'
    this.PattenAnsNode1 = 'p-person'
    this.PattenAnsNode2P2 = 'p-person'
    this.PattenAnsNode2P1 = 'p-person'
    this.PattenAnsNode3P1 = 'p-person'
    this.PattenAnsNode3P2 = 'p-person'
    this.PattenAnsNode4 = 'p-person'
    this.PattenAnsNode5 = 'p-person'
    this.PattenAnsNode6P1 = 'p-person'
    this.PattenAnsNode6P2 = 'p-person'
    this.PatternPathEnable = false
    this.Pattern = ""
    this.PatternPath = ""
    this.changeDetectorRef.detectChanges();
  }
  this.ADDFailureModePatternTree = true
  this.ADDFailuerRate = true
  this.ADDFailureWarning = true
  this.ADDWarningSign = true
  this.ADDIntervalDeteacting = true
  this.ADDFailuerEvident = true
  this.ADDFailuerMaintenance = true
  this.ADDFailuerComments = true
  this.ADDSafeUsefulLife = true
  this.ADDalphaBeta = true
  // const element = document.querySelector("#ScrollToFCATree")
  // if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

}


CompleteUpdateFCA(p){
 console.log(p.label)
 var FMName , LocalEffect , SystemEffect, Consequence;
 
 this.data1[0].children[0].children[0].children.forEach(element => {
    if (element.label === p.label){
      FMName = element.data.name;
      LocalEffect  = element.children[0].children[0].data.name
      SystemEffect = element.children[0].children[1].data.name
      Consequence  = element.children[0].children[2].data.name

      var UpdateData = this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes.find(a => a['FunctionMode'] == FMName && a['LocalEffect'] == LocalEffect && a['SystemEffect'] == SystemEffect && a['Consequence'] == Consequence)
      var FCAComment = JSON.parse(UpdateData.FCAComment)
      var FCAUpdateConditions = JSON.parse(UpdateData.FCAUpdateConditions)
      var FCAUpdateIntervals = JSON.parse(UpdateData.FCAUpdateIntervals)
      
      
      this.UpdateAlpha = UpdateData.FCAAlpha
      this.UpdateBeta = UpdateData.FCABeta
      this.UpdateSafeLife = UpdateData.FCASafeLife
      if(this.UpdateSafeLife != 0){
        this.UpdateFinalSafeUsefulLife = this.UpdateSafeLife
      }
      this.UpdateUsefulLife = UpdateData.FCAUsefulLife
      
      if(this.UpdateUsefulLife != 0){
        this.UpdateFinalSafeUsefulLife = this.UpdateUsefulLife
      }
      this.UpdateVibration = FCAUpdateConditions[0].Vibration
      this.UpdateNoice = FCAUpdateConditions[1].Noice
      this.UpdateLeakage = FCAUpdateConditions[2].Leakage
      this.UpdatePerformanceDrop = FCAUpdateConditions[3].PerformanceDrop
      this.UpdateTempratureChange = FCAUpdateConditions[4].TempratureChange
      this.UpdateEmmisionChange = FCAUpdateConditions[5].EmmisionChange
      this.UpdateIncreaseLubricantConsumption = FCAUpdateConditions[6].IncreaseLubricantConsumption
      this.UpdateOther = FCAUpdateConditions[7].Other
      this.UpdateHumanSenses = FCAUpdateConditions[8].HumanSenses
      this.UpdateExistingInstumentation = FCAUpdateConditions[9].ExistingInstumentation
      this.UpdateNewInstumentation = FCAUpdateConditions[10].NewInstumentation
      this.UpdateProcessCondtions = FCAUpdateConditions[11].ProcessCondtions
      this.UpdateSampleAnyalysis = FCAUpdateConditions[12].SampleAnyalysis

      this.UpdateCommentFIEYN = FCAComment[0]
      this.UpdateCommentFIEYN2 = FCAComment[1]
      this.UpdateFCAFreeText = FCAComment[2]

      this.Updateinterval = FCAUpdateIntervals[0].FCAIntervalDWY
      this.UpdateintervalValue = FCAUpdateIntervals[1].FCAIntervalDWYValues
      this.UpdateffInterval = FCAUpdateIntervals[2].FCAFFIIntervalDWY
      this.UpdateffIntervalValue =  FCAUpdateIntervals[3].FCAFFIIntervalDWYValues
    }
 })
this.ADDWarningSign = false

}


UpdateWebal(event){
  var file = event.target.files[0];
  let fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);
  fileReader.onload = (e) => {
    var arrayBuffer : any = fileReader.result;
    var data = new Uint8Array(arrayBuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
    var daysList : any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    var Data : any = []
    daysList.forEach(element => {
      Data.push(element.Days)
    });
    var headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    var url : string =  this.prescriptiveContantAPI.FCAWebal;
    this.prescriptiveBLService.postWithHeaders(url, Data).subscribe(
  //  this.http.post<any>('api/PrescriptiveAPI/WebalAlgo', JSON.stringify(Data), headers).subscribe(
      res =>{
          var ab : any = res;
          this.UpdateAlpha =ab.alpha;
          this.UpdateBeta =ab.beta;
          this.changeDetectorRef.detectChanges();
      }, err => {console.log(err.error)}
    )
  }

}

  SelectNodeToEditMSS(p){
    this.FCAUpdatePageEnable = false
    this.FailureModePatternTree = false
    this.FCAViewEnabled = false
    this.UpdateMSSTreeLabel = p.label
   this.UpdatedMSSStartegy = p.children[0].data.name
   this.UpdateMSSConsequence = this.UpdatedMSSStartegy.split('-')[0]
   var Data : any, FMName, LocalEffect, SystemEffect, Consequence;
   if(this.UpdateMSSConsequence == 'A'){
    Data = ['A-OCM', 'A-SO', 'A-SR', 'A-FFT', 'A-RED']
    this.UpdateMSSImagePath = "/dist/DPM/assets/MSS/A.JPG"
   }else if(this.UpdateMSSConsequence == 'B'){
    Data = ['B-OCM', 'B-SO', 'B-SR', 'B-RED']
      this.UpdateMSSImagePath = "/dist/DPM/assets/MSS/B.JPG"
   }else if(this.UpdateMSSConsequence == 'C'){
    Data = ['C-OCM', 'C-SO', 'C-SR', 'C-OFM', 'C-RED']
    this.UpdateMSSImagePath = "/dist/DPM/assets/MSS/C.JPG"
  }else if(this.UpdateMSSConsequence == 'D'){
    Data = ['D-OCM', 'D-SO', 'D-SR','D-OFM', 'D-RED']
    this.UpdateMSSImagePath = "/dist/DPM/assets/MSS/D.JPG"
  }else if(this.UpdateMSSConsequence == 'E'){
    Data = ['E-OCM', 'E-SO', 'E-SR', 'E-FFT', 'E-OFM', 'E-RED']
    this.UpdateMSSImagePath = "/dist/DPM/assets/MSS/E.JPG"
 }
    this.UpdateMSSImageValues = Data;
    this.data1[0].children[0].children[0].children.forEach(element => {
      if (element.label === p.label){
        FMName = element.data.name;
        LocalEffect  = element.children[0].children[0].data.name
        SystemEffect = element.children[0].children[1].data.name
        Consequence  = element.children[0].children[2].data.name
  
        var UpdateData = this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes.find(a => a['FunctionMode'] == FMName && a['LocalEffect'] == LocalEffect && a['SystemEffect'] == SystemEffect && a['Consequence'] == Consequence)
        var d = JSON.parse(UpdateData.MSSAvailability)
        if(d.length > 4){
          this.UpdateMSSAvailabilityY = d[0]
          this.UpdateMSSstoppageDays = d[1]
          this.UpdateMSSstoppageDaysValue = d[2]
          this.UpdateMSSstoppageDaysTime = d[3]
          this.UpdateMSSstoppageDaysTimeValue = d[4]
          this.UpdateMSSAvailability = d[5]
          this.UpdateMSSIndirectAvailability = true
          this.UpdateMSSDirectAvailability = false
        }else{
          this.UpdateMSSAvailabilityY = d[0]
          this.UpdateMSSAvailabilityCheck = d[1]
          this.UpdateMSSAvailability = d[2]
          this.UpdateMSSstoppageDays = ""
          this.UpdateMSSstoppageDaysValue = 0
          this.UpdateMSSstoppageDaysTime = ""
          this.UpdateMSSstoppageDaysTimeValue = 0
          this.UpdateMSSIndirectAvailability = false
          this.UpdateMSSDirectAvailability = true
        }
       // this.UpdateMSSAvailability = d.MSSAvailability
        this.UpdateMSSIntervalSelectionCriteria = UpdateData.MSSIntervalSelectionCriteria
      }
    })

    this.changeDetectorRef.detectChanges()
    this.UpdateMSSImageFlag = true
  }

  UpdateMSSAvailabilityYN(){
   if(this.UpdateMSSAvailabilityY == "Yes"){
    this.UpdateMSSIndirectAvailability = false
    this.UpdateMSSDirectAvailability = true
   }else{
    this.UpdateMSSIndirectAvailability = true
    this.UpdateMSSDirectAvailability = false
   }
  }

  UpdateMSSToTree(){
    var availablilityCal1,availablilityCal2, AVAL, FinalAvailability : any = []
    
    this.data1[0].children[0].children[0].children[this.UpdateMSSTreeLabel - 1].children[2].children[0].data.name = this.UpdatedMSSStartegy
    this.data1[0].children[0].children[0].MSS[0].children[0].children[0].children[this.UpdateMSSTreeLabel - 1].children[0].data.name = this.UpdatedMSSStartegy
     
      FinalAvailability.push(this.UpdateMSSAvailabilityY)
      if(this.UpdateMSSAvailabilityY == "No"){
          if(this.UpdateMSSstoppageDays == 'Days'){
            availablilityCal1 = this.UpdateMSSstoppageDaysValue * 1 
            FinalAvailability.push('Days')
          } else if(this.UpdateMSSstoppageDays == 'Week'){ 
            availablilityCal1 =  this.UpdateMSSstoppageDaysValue * 7 
            FinalAvailability.push('Week')
          } else if(this.UpdateMSSstoppageDays == 'Month'){ 
            availablilityCal1 =  this.UpdateMSSstoppageDaysValue * 30 
            FinalAvailability.push('Month')
          } else if(this.UpdateMSSstoppageDays == 'Year'){ 
            availablilityCal1 =  this.UpdateMSSstoppageDaysValue * 365 
            FinalAvailability.push('Year')
          }
          FinalAvailability.push(this.UpdateMSSstoppageDaysValue)
        
          if (this.UpdateMSSstoppageDaysTime == 'Days') {
            availablilityCal2 = this.UpdateMSSstoppageDaysTimeValue * 1
            FinalAvailability.push('Days')
          } else if (this.UpdateMSSstoppageDaysTime == 'Week') {
            availablilityCal2 = this.UpdateMSSstoppageDaysTimeValue * 7
            FinalAvailability.push('Week')
          } else if (this.UpdateMSSstoppageDaysTime == 'Month') {
            availablilityCal2 = this.UpdateMSSstoppageDaysTimeValue * 30
            FinalAvailability.push('Month')
          } else if (this.UpdateMSSstoppageDaysTime == 'Year') {
            availablilityCal2 = this.UpdateMSSstoppageDaysTimeValue * 365
            FinalAvailability.push('Year')
          }
          FinalAvailability.push(this.UpdateMSSstoppageDaysTimeValue)
          AVAL = (1-(availablilityCal2 / availablilityCal1  ))*100
          this.UpdateMSSAvailability = AVAL;
          FinalAvailability.push(AVAL)
      }else{
        FinalAvailability.push(this.UpdateMSSAvailabilityCheck)
        this.UpdateMSSAvailability = this.UpdateMSSAvailabilityCheck
      }
      var FMName = this.data1[0].children[0].children[0].children[this.UpdateMSSTreeLabel - 1].data.name ;
      var dataFromLibrary = this.MSSLibraryJsonData.find(a => a['name'] === FMName);
      var MTBF = dataFromLibrary.mtbf;
      var LN =  Math.log((2*(this.UpdateMSSAvailability/100))-1) 
      var INTERVAl : number =  -(MTBF*LN) 
      var intervalWeek = (INTERVAl*365)/7;
    
    if(this.UpdatedMSSStartegy == 'A-FFT'    ||  this.UpdatedMSSStartegy == 'A-OCM' || this.UpdatedMSSStartegy == 'A-SO'
        || this.UpdatedMSSStartegy == 'A-SR' ||  this.UpdatedMSSStartegy == 'A-RED' || this.UpdatedMSSStartegy == 'A-OFM'
        || this.UpdatedMSSStartegy == 'B-FFT'||  this.UpdatedMSSStartegy == 'B-OCM' || this.UpdatedMSSStartegy == 'B-SO'
        || this.UpdatedMSSStartegy == 'B-SR' ||  this.UpdatedMSSStartegy == 'B-RED' || this.UpdatedMSSStartegy == 'B-OFM' ){

          if(this.UpdatedMSSStartegy == 'A-OFM' ||     this.UpdatedMSSStartegy == 'B-FFT'){
            let obj = {}
            obj['MSSMaintenanceInterval'] = 'Not Applicable'
            obj['MSSMaintenanceTask'] = 'Not Applicable'
            obj['MSSStartergy'] = this.UpdatedMSSStartegy
            obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
            obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
            this.UpdateMSSTaskObj.push(obj)
          } else{

            var ocmHours = this.data1[0].children[0].children[0].children[this.UpdateMSSTreeLabel - 1].children[1].FCAData.children[2].data.name
            var ocmWeek : number = ocmHours.split(" ")[0]
                ocmWeek = Math.round((ocmWeek / 24) / 7)

            
              var strategy = this.UpdatedMSSStartegy.split('-')[1];
              let obj = {}
              if(this.MSSStratergy == 'A-FFT'){
                obj['MSSMaintenanceInterval'] = `${intervalWeek.toFixed(2)} weeks`;
                obj['MSSMaintenanceTask'] = 'Function Check'
                obj['MSSStartergy'] = this.UpdatedMSSStartegy
                obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                this.MSSTaskObj.push(obj)
              }else{
                 if(strategy == 'FFT'){
                   obj['MSSMaintenanceInterval'] = this.UpdateMSSAvailability;
                   obj['MSSMaintenanceTask'] = 'Function Check'
                   obj['MSSStartergy'] = this.UpdatedMSSStartegy
                   obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                   obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                   this.UpdateMSSTaskObj.push(obj)
   
                 }else if(strategy == 'OCM'){
                   obj['MSSMaintenanceInterval'] = `${ocmWeek}${" "}${"Week"}` 
                   obj['MSSMaintenanceTask'] = 'Carry out talks based on on-condition maintenance recommendation'
                   obj['MSSStartergy'] = this.UpdatedMSSStartegy
                   obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                   obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                   this.UpdateMSSTaskObj.push(obj)
   
                 }else if(strategy == 'SO'){
                   obj['MSSMaintenanceInterval'] = `${this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes[this.UpdateMSSTreeLabel - 1].FCASafeLife}${" "}${"Week"}` 
                   obj['MSSMaintenanceTask'] = 'Remove, overhaul, and rectify'
                   obj['MSSStartergy'] = this.UpdatedMSSStartegy
                   obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                   obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                   this.UpdateMSSTaskObj.push(obj)
   
                 }else if(strategy == 'SR'){
                   obj['MSSMaintenanceInterval'] = `${ this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes[this.UpdateMSSTreeLabel - 1].FCASafeLife}${" "}${"Week"}` 
                   obj['MSSMaintenanceTask'] = 'Remove, replace, and recommission'
                   obj['MSSStartergy'] = this.UpdatedMSSStartegy
                   obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                   obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                   this.UpdateMSSTaskObj.push(obj)
   
                 }else if(strategy == 'RED'){
                   obj['MSSMaintenanceInterval'] = 'NA'
                   obj['MSSMaintenanceTask'] = 'Modification, or redesign required since no task is effective'
                   obj['MSSStartergy'] = this.UpdatedMSSStartegy
                   obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                   obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                   this.UpdateMSSTaskObj.push(obj)
   
                 }
             }  
          }
      }else if(  this.UpdatedMSSStartegy == 'C-FFT'||  this.UpdatedMSSStartegy == 'C-OCM' || this.UpdatedMSSStartegy == 'C-SO'
              || this.UpdatedMSSStartegy == 'C-SR' ||  this.UpdatedMSSStartegy == 'C-RED' || this.UpdatedMSSStartegy == 'C-OFM'
              || this.UpdatedMSSStartegy == 'D-FFT'||  this.UpdatedMSSStartegy == 'D-OCM' || this.UpdatedMSSStartegy == 'D-SO'
              || this.UpdatedMSSStartegy == 'D-SR' ||  this.UpdatedMSSStartegy == 'D-RED' || this.UpdatedMSSStartegy == 'D-OFM'
              || this.UpdatedMSSStartegy == 'E-FFT'||  this.UpdatedMSSStartegy == 'E-OCM' || this.UpdatedMSSStartegy == 'E-SO'
              || this.UpdatedMSSStartegy == 'E-SR' ||  this.UpdatedMSSStartegy == 'E-RED' || this.UpdatedMSSStartegy == 'E-OFM'){

                if(this.UpdatedMSSStartegy == 'C-FFT' ||     this.UpdatedMSSStartegy == 'D-FFT'){
                  let obj = {}
                  obj['MSSMaintenanceInterval'] = 'Not Applicable'
                  obj['MSSMaintenanceTask'] = 'Not Applicable'
                  obj['MSSStartergy'] = this.UpdatedMSSStartegy
                  obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                  obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                  this.UpdateMSSTaskObj.push(obj)
                } else{

                    var ocmHours = this.data1[0].children[0].children[0].children[this.UpdateMSSTreeLabel - 1].children[1].FCAData.children[2].data.name
                    var ocmWeek : number = ocmHours.split(" ")[0]
                    ocmWeek = Math.round((ocmWeek / 24) / 7)

                   
              
                    var strategy = this.UpdatedMSSStartegy.split('-')[1];
                    let obj = {}
                    if(strategy == 'FFT'){
                      obj['MSSMaintenanceInterval'] = 'NA'
                      obj['MSSMaintenanceTask'] = 'Function check'
                      obj['MSSStartergy'] = this.UpdatedMSSStartegy
                      obj['MSSAvailability'] = this.UpdateMSSAvailability
                      obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                      this.UpdateMSSTaskObj.push(obj)
                    }else if(strategy == 'OCM'){
                      obj['MSSMaintenanceInterval'] = `${ocmWeek}${" "}${"Week"}` 
                      obj['MSSMaintenanceTask'] = 'Carry out talks based on on-condition maintenance recommendation'
                      obj['MSSStartergy'] = this.UpdatedMSSStartegy
                      obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                      obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                      this.UpdateMSSTaskObj.push(obj)

                    }else if(strategy == 'SO'){
                      obj['MSSMaintenanceInterval'] = `${this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes[this.UpdateMSSTreeLabel - 1].FCAUsefulLife}${" "}${"Week"}` 
                      obj['MSSMaintenanceTask'] = 'Remove, overhaul, and rectify'
                      obj['MSSStartergy'] = this.UpdatedMSSStartegy
                      obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                      obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                      this.UpdateMSSTaskObj.push(obj)

                    }else if(strategy == 'SR'){
                      obj['MSSMaintenanceInterval'] = `${this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes[this.UpdateMSSTreeLabel - 1].FCAUsefulLife}${" "}${"Week"}`  
                      obj['MSSMaintenanceTask'] = 'Remove, replace, and recommission'
                      obj['MSSStartergy'] = this.UpdatedMSSStartegy
                      obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                      obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                      this.UpdateMSSTaskObj.push(obj)

                    }else if(strategy == 'RED'){
                      obj['MSSMaintenanceInterval'] = 'NA'
                      obj['MSSMaintenanceTask'] = 'Modification, or redesign required since no task is effective'
                      obj['MSSStartergy'] = this.UpdatedMSSStartegy
                      obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                      obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                      this.UpdateMSSTaskObj.push(obj)

                    }
                    else if(strategy == 'OFM'){
                      obj['MSSMaintenanceInterval'] = 'NA'
                      obj['MSSMaintenanceTask'] = 'No Task'
                      obj['MSSStartergy'] = this.UpdatedMSSStartegy
                      obj['MSSAvailability'] = JSON.stringify(FinalAvailability)
                      obj['MSSIntervalSelectionCriteria'] = this.UpdateMSSIntervalSelectionCriteria
                      this.UpdateMSSTaskObj.push(obj)

                    }
              }
      }
 
      var CPObj: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();
      CPObj.CFPPrescriptiveId =  this.CPPrescriptiveUpdateData.CFPPrescriptiveId
      CPObj.FMWithConsequenceTree = JSON.stringify(this.data1)
      this.UpdateMSSTaskObj.forEach(element => {
        element.CPPFMId = this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes[this.UpdateMSSTreeLabel - 1].CPPFMId
      
      });
      CPObj.centrifugalPumpPrescriptiveFailureModes = this.UpdateMSSTaskObj
      var url : string =  this.prescriptiveContantAPI.UpdateMSSToTree;
      this.prescriptiveBLService.PutData(url, CPObj).subscribe(
    //  this.http.put<any>('api/PrescriptiveAPI/PrescriptiveUpdateSingleFMMSSUpdate', CPObj).subscribe(
        (res: any) =>{
         this.UpdateMSSImageFlag = false
         this.prescriptiveTree = false
         this.changeDetectorRef.detectChanges()
         this.prescriptiveTree = true
         this.UpdateMSSIntervalSelectionCriteria = ""
         localStorage.removeItem('PrescriptiveUpdateObject');
         localStorage.setItem('PrescriptiveUpdateObject', JSON.stringify(res.centrifugalPumpPrescriptiveModel[0]))
         this.getData();
        //  this.router.navigateByUrl('/Home/Prescriptive/List') 
         this.messageService.add({ severity: 'info', summary:'Info', detail: 'Successfully updated'})
        }, err => { console.log(err.error)}
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
      this.dropedMode = [];
      this.dropedMode.push(this.dragedFunctionMode);
      this.dragedFunctionMode = null;
    }
  }

  dragEnd1(e) { }
  dragStart1(e, c) {
    this.dragedFunctionMode = c;
  }
  async CloseMSSUpdateView() {
    this.MSSViewEnabled = false
    this.MSSViewTreeEnabled = false
  }
  async UpdateMSSPattern() {
    this.FCAViewTreeEnabled = false
    this.FailureModePatternTree = true
    this.AddFMMSSAddEnable = false;
    this.UpdateMSSAddEnable = true
    this.changeDetectorRef.detectChanges();
  }
  MSSUpdateCancel() {
    this.FailureModeMSSPatternTree = false;
  }

  ADDIntervalSave(){
  var FCAIntervalDWY : any, FCAIntervalDWYValues : any;
  if(this.ADDinterval != "" &&  this.ADDintervalValue != 0){
 if(this.ADDinterval == 'Days'){
   FCAIntervalDWY = 'Days';
   FCAIntervalDWYValues = this.ADDintervalValue;
   this.UpdateFCAIntervals.push({FCAIntervalDWY}) 
   this.UpdateFCAIntervals.push({FCAIntervalDWYValues}) 
   this.FCAInterval = this.ADDintervalValue * 1 * 24
 } else if(this.ADDinterval == 'Week'){ 
   this.FCAInterval = this.ADDintervalValue * 7 * 24
   FCAIntervalDWY = 'Week';
   FCAIntervalDWYValues = this.ADDintervalValue;
   this.UpdateFCAIntervals.push({FCAIntervalDWY}) 
   this.UpdateFCAIntervals.push({FCAIntervalDWYValues}) 
 } else if(this.ADDinterval == 'Month'){ 
   FCAIntervalDWY = 'Month';
   FCAIntervalDWYValues = this.ADDintervalValue;
   this.UpdateFCAIntervals.push({FCAIntervalDWY}) 
   this.UpdateFCAIntervals.push({FCAIntervalDWYValues}) 
   this.FCAInterval = this.ADDintervalValue * 30 * 24
 } else if(this.ADDinterval == 'Year'){ 
   FCAIntervalDWY = 'Year';
   FCAIntervalDWYValues = this.ADDintervalValue;
   this.UpdateFCAIntervals.push({FCAIntervalDWY}) 
   this.UpdateFCAIntervals.push({FCAIntervalDWYValues}) 
   this.FCAInterval = this.ADDintervalValue * 365 * 24
 }

this.changeDetectorRef.detectChanges()
this.ADDfailurewarning = !this.ADDfailurewarning;

const element = document.querySelector("#Patternfailurewarning")
if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}else{
this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Interval value is missing" })
}
   }


   ADDConditionFirst(){
    if(this.ADDVibration != "" || this.ADDNoice != "" || this.ADDLeakage != "" || this. ADDPerformanceDrop != "" || this.ADDTempratureChange != "" || this.ADDEmmisionChange != "" || this.ADDIncreaseLubricantConsumption != "" || this.ADDOther ){

      var Vibration : string = "", Noice : string = "", Leakage : string = "",
          PerformanceDrop : string = "", TempratureChange : string = "",
          EmmisionChange : string = "", IncreaseLubricantConsumption : string = "", 
          Other: string = "";
          
          Vibration = this.ADDVibration
          Noice = this.ADDNoice
          Leakage = this.ADDLeakage
          PerformanceDrop = this.ADDPerformanceDrop
          TempratureChange = this.ADDTempratureChange
          EmmisionChange = this.ADDEmmisionChange
          IncreaseLubricantConsumption = this.ADDIncreaseLubricantConsumption
          Other = this.ADDOther

    if(this.ADDVibration != ""){
      this.ADDVibration = "Vibration"
      Vibration = "Vibration"
      this.FCACondition.push(this.ADDVibration)
    }
    if(this.ADDNoice != ""){
      this.ADDNoice = "Noice"
      Noice = "Noice"
      this.FCACondition.push(this.ADDNoice)
    }
    if(this.ADDLeakage != ""){
      this.ADDLeakage = "Leakage"
      this.FCACondition.push(this.ADDLeakage)
      Leakage = "Leakage"
      
    }
    if(this.ADDPerformanceDrop != ""){
      this.ADDPerformanceDrop = "Performance Drop"
      this.FCACondition.push(this.ADDPerformanceDrop)
      PerformanceDrop = "Performance Drop"
    }
    if(this.ADDTempratureChange != ""){
      this.ADDTempratureChange = "Temprature Change"
      this.FCACondition.push(this.ADDTempratureChange)
      TempratureChange = "Temprature Change"
    }
    if(this.ADDEmmisionChange != ""){
      this.ADDEmmisionChange = "Emmision Change"
      this.FCACondition.push(this.ADDEmmisionChange)
      EmmisionChange = "Emmision Change"
    }
    if(this.ADDIncreaseLubricantConsumption != ""){
      this.ADDIncreaseLubricantConsumption = "Increase Lubricant Consumption"
      this.FCACondition.push(this.ADDIncreaseLubricantConsumption)
      IncreaseLubricantConsumption = "Increase Lubricant Consumption"
    }
    if(this.ADDOther != ""){
      this.ADDOther = "Other"
      this.FCACondition.push(this.ADDOther)
      Other = "Other"
    }
    
      this.UpdateFCACondition.push({Vibration})
      this.UpdateFCACondition.push({Noice})
      this.UpdateFCACondition.push({Leakage})
      this.UpdateFCACondition.push({PerformanceDrop})
      this.UpdateFCACondition.push({TempratureChange})
      this.UpdateFCACondition.push({EmmisionChange})
      this.UpdateFCACondition.push({IncreaseLubricantConsumption})
      this.UpdateFCACondition.push({Other})
      
      this.changeDetectorRef.detectChanges()
      this.ADDwarningsign = !this.ADDwarningsign;

     const element = document.querySelector("#PatternWarningSign")
     if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
     }
     else{
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Prior warnings before the failure occure are missing" })
     }

   }

   ADDConditionSecond(){
    if(this.ADDHumanSenses != ""|| this.ADDExistingInstumentation  != "" || this.ADDNewInstumentation  != "" || this.ADDProcessCondtions  != "" ||this.ADDSampleAnyalysis  != ""){
    
      var HumanSenses : string = "",  ExistingInstumentation : string = "",  NewInstumentation : string = "",  ProcessCondtions : string = "",  SampleAnyalysis : string = ""
          HumanSenses = this.ADDHumanSenses
          ExistingInstumentation = this.ADDExistingInstumentation
          NewInstumentation = this.ADDNewInstumentation
          ProcessCondtions = this.ADDProcessCondtions
          SampleAnyalysis = this.ADDSampleAnyalysis
      if(this.ADDHumanSenses != ""){
      this.ADDHumanSenses = "Human Senses"
      HumanSenses = "Human Senses"
      this.FCACondition.push(this.ADDHumanSenses)
    
    }
    if(this.ADDExistingInstumentation != ""){
      this.ADDExistingInstumentation = "Existing Instumentation(portable or fixed)"
      ExistingInstumentation = "Existing Instumentation(portable or fixed)"
      this.FCACondition.push(this.ADDExistingInstumentation)
    
    }
    if(this.ADDNewInstumentation != ""){
      this.ADDNewInstumentation = "New Instumentation(portable or fixed)"
      NewInstumentation = "New Instumentation(portable or fixed)"
      this.FCACondition.push(this.ADDNewInstumentation)
    
    }
    if(this.ADDProcessCondtions != ""){
      this.ADDProcessCondtions = "Process Condtions"
      ProcessCondtions = "Process Condtions"
      this.FCACondition.push(this.ADDProcessCondtions)
    }
    if(this.ADDSampleAnyalysis != ""){
      this.ADDSampleAnyalysis = "Sample Anyalysis"
      SampleAnyalysis = "Sample Anyalysis"
      this.FCACondition.push(this.ADDSampleAnyalysis)
    }

    
    this.UpdateFCACondition.push({HumanSenses})
    this.UpdateFCACondition.push({ExistingInstumentation})
    this.UpdateFCACondition.push({NewInstumentation})
    this.UpdateFCACondition.push({ProcessCondtions})
    this.UpdateFCACondition.push({SampleAnyalysis})

      this.changeDetectorRef.detectChanges()
      this.ADDintervaldeteacting = !this.ADDintervaldeteacting;    
      const element = document.querySelector("#PatternIntervalDeteacting")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }else{
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Warning signs are missing" })
    }

   }

   ADDFFInterval(){
    var FCAFFIIntervalDWY : any, FCAFFIIntervalDWYValues : any;

    if(this.ADDffInterval != "" &&  this.ADDffIntervalValue != 0){

    if(this.ADDffInterval == 'Days'){
      FCAFFIIntervalDWY = 'Days';
      FCAFFIIntervalDWYValues = this.ADDffIntervalValue;
      this.UpdateFCAIntervals.push({FCAFFIIntervalDWY}) 
      this.UpdateFCAIntervals.push({FCAFFIIntervalDWYValues})
      this.FCAFFInterval = this.ADDffIntervalValue * 1 * 24
    } else if(this.ADDffInterval == 'Week'){ 
      FCAFFIIntervalDWY = 'Week';
      FCAFFIIntervalDWYValues = this.ADDffIntervalValue;
      this.UpdateFCAIntervals.push({FCAFFIIntervalDWY}) 
      this.UpdateFCAIntervals.push({FCAFFIIntervalDWYValues})
      this.FCAFFInterval = this.ADDffIntervalValue * 7 * 24
    } else if(this.ADDffInterval == 'Month'){ 
      FCAFFIIntervalDWY = 'Month';
      FCAFFIIntervalDWYValues = this.ADDffIntervalValue;
      this.UpdateFCAIntervals.push({FCAFFIIntervalDWY}) 
      this.UpdateFCAIntervals.push({FCAFFIIntervalDWYValues})
      this.FCAFFInterval = this.ADDffIntervalValue * 30 * 24
    } else if(this.ADDffInterval == 'Year'){ 
      FCAFFIIntervalDWY = 'Year';
      FCAFFIIntervalDWYValues = this.ADDffIntervalValue;
      this.UpdateFCAIntervals.push({FCAFFIIntervalDWY}) 
      this.UpdateFCAIntervals.push({FCAFFIIntervalDWYValues})
      this.FCAFFInterval = this.ADDffIntervalValue * 365 * 24
    }

   
      this.changeDetectorRef.detectChanges()
      this.ADDfailuerevident = !this.ADDfailuerevident; 
      const element = document.querySelector("#PatternFailuerEvident")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }else{
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "FFIInterval is missing" });
    }

   }
  public SafeUsefulLife:boolean = true;
   ADDCommentThird(){
     this.FCAComment.push(this.ADDCommentFIEYN)
     this.ADDfailuermaintenance = !this.ADDfailuermaintenance;
     
     if( this.ADDCommentFIEYN.length>0 && this.ADDCommentFIEYN.length>0){
       this.changeDetectorRef.detectChanges()
       const element = document.querySelector("#PatternFailuerMaintenance")
       if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
     }else{
       this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
     }

   }

   ADDCommentFourth(){
     // this.patternaddshow = false
     this.FCAComment.push(this.ADDCommentFIEYN2)
     if( this.ADDCommentFIEYN2.length>0 && this.ADDCommentFIEYN2.length>0){
       this.changeDetectorRef.detectChanges()
       this.ADDfailuercomments = !this.ADDfailuercomments;
       const element = document.querySelector("#PatternFailuerComments")
       if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
     }else{
       this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
     }

   }

  async ADDFCAFreeTextSave() {
    // if (this.ADDFCAFreeText.length > 0) {
      this.ADDPatternFailuerAll = true
      this.FCAComment.push(this.ADDFCAFreeText)
      this.ADDSafeUsefulLife = true;
      this.changeDetectorRef.detectChanges()
      this.SafeUsefulLife = !this.SafeUsefulLife;
      const element = document.querySelector("#SafeUsefulLife")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // } else {
    //   this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Add Comment" })
    // }

   }

  async ADDFCAFreeTextCancel(){
     this.ADDPatternFailuerAll = true
     this.ADDFCAFreeText = ""
     this.ADDalphaBeta = true
     this.SafeUsefulLife = !this.SafeUsefulLife;
     this.changeDetectorRef.detectChanges();
     const element = document.querySelector("#alphaBeta")
     if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
   }

   ADDWebal(event){
     this.file = event.target.files[0];
     let fileReader = new FileReader();
     fileReader.readAsArrayBuffer(this.file);
     fileReader.onload = (e) => {
       this.arrayBuffer = fileReader.result;
       var data = new Uint8Array(this.arrayBuffer);
       var arr = new Array();
       for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
       var bstr = arr.join("");
       var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
       var first_sheet_name = workbook.SheetNames[0];
       var worksheet = workbook.Sheets[first_sheet_name];
       console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
       this.daysList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
       var Data : any = []
       this.daysList.forEach(element => {
         Data.push(element.Days)
       });
       var url : string =  this.prescriptiveContantAPI.FCAWebal;
       this.prescriptiveBLService.postWithHeaders(url, Data).subscribe(
      // this.http.post<any>('api/PrescriptiveAPI/WebalAlgo', JSON.stringify(Data), this.headers).subscribe(
         (res: any) =>{
             this.ADDalpha =res.alpha;
             this.ADDbeta =res.beta;
             this.changeDetectorRef.detectChanges();
         }, err => {console.log(err.error)}
       )
     }

 }


 async ADDSafeUsefulLifeSave(){
   if(this.ADDWebalYN == 'YES'  || this.ADDWebalYN == 'No'){
       if(this.ADDWebalYN == 'YES'){
         this.ADDalphaBeta = true
         this.ADDalpha = 0;
         this.ADDbeta = 0;
         this.changeDetectorRef.detectChanges();
         const element = document.querySelector("#alphaBeta")
         if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
       }else {
         this.ADDpatternaddshow = true
         this.changeDetectorRef.detectChanges();
         const element = document.querySelector("#ScrollToFCATree")
         if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

       }
   }else{
     this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please choose Yes or No for webal analysis"})
   }

 }

 async ADDalphaBetaSave(){
   this.ADDpatternaddshow = true
   this.changeDetectorRef.detectChanges();
   const element = document.querySelector("#ScrollToFCATree")
   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
 }

 ExcelDownload(){
   var ColumnsData : any = ["Days"];
   this.excelFormatService.GetExcelFormat( ColumnsData , 'Webal_Days_Format')
 }

 async Availability(){
  if( this.ADDMSSAvailabilityY == 'Yes' || this.ADDMSSAvailabilityY == 'No'){
    this.changeDetectorRef.detectChanges()

    if(this.ADDMSSAvailabilityY == 'Yes'){
      this.ADDMSSFinalAvailability = []
      this.ADDMSSFinalAvailability.push('Yes')
      this.ADDMSSstoppageDays = ""
      this.ADDMSSstoppageDaysValue = 0
      this.ADDMSSstoppageDaysTime = ""
      this.ADDMSSstoppageDaysTimeValue = 0
      // this.MSSTreeButton = true
      this.ADDMSSexpectedAvailability = true
      this.ADDMSSAvailabilityPlantStoppage = false
      this.ADDMSSAvailabilityPlantStoppageTime = false

     }else if(this.ADDMSSAvailabilityY == 'No') {
      this.ADDMSSFinalAvailability = []
      this.ADDMSSFinalAvailability.push('No')
      this.ADDMSSstoppageDays = ""
      this.ADDMSSstoppageDaysValue = 0
      this.ADDMSSstoppageDaysTime = ""
      this.ADDMSSstoppageDaysTimeValue = 0
      // this.MSSTreeButton = true
      this.ADDMSSexpectedAvailability = false
      this.ADDMSSAvailabilityPlantStoppage = true
      this.ADDMSSAvailabilityPlantStoppageTime = true
     }
     this.changeDetectorRef.detectChanges()
     const element = document.querySelector("#PlantStoppage")
     if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }else{
    this.messageService.add({ severity: 'warn', summary: 'warn', detail: " Availability value is missing" });
  }

 }

async AvailabilityYes(){
   if(this.ADDMSSAvailabilityCheck != 0){
     this.ADDMSSFinalAvailability.push(this.ADDMSSAvailabilityCheck)
     this.MSSTreeButton = true
   const element = document.querySelector("#Consequence")
   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
 
   }else{
    this.messageService.add({ severity: 'warn', summary: 'warn', detail: " Availability value is missing" })
   }
   }

async StoppageDays(){
  if(this.ADDMSSstoppageDays == 'Days'){
    this.MSSstoppageValue = this.ADDMSSstoppageDaysValue * 1
    this.ADDMSSFinalAvailability.push('Days')
  } else if(this.ADDMSSstoppageDays == 'Week'){
    this.MSSstoppageValue =  this.ADDMSSstoppageDaysValue * 7
    this.ADDMSSFinalAvailability.push('Week')
  } else if(this.ADDMSSstoppageDays == 'Month'){
    this.MSSstoppageValue =  this.ADDMSSstoppageDaysValue * 30
    this.ADDMSSFinalAvailability.push('Month')
  } else if(this.ADDMSSstoppageDays == 'Year'){
    this.MSSstoppageValue =  this.ADDMSSstoppageDaysValue * 365
    this.ADDMSSFinalAvailability.push('Year')
  }
  this.ADDMSSFinalAvailability.push(this.ADDMSSstoppageDaysValue)
  this.PlantStoppageTime = !this.PlantStoppageTime;
  const element = document.querySelector("#PlantStoppagetime")
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
 }

async StoppageDuration(){
  if (this.ADDMSSstoppageDaysTime == 'Days') {
    this.MSSstoppageDuration = this.ADDMSSstoppageDaysTimeValue * 1
    this.ADDMSSFinalAvailability.push('Days')
  } else if (this.ADDMSSstoppageDaysTime == 'Week') {
    this.MSSstoppageDuration = this.ADDMSSstoppageDaysTimeValue * 7
    this.ADDMSSFinalAvailability.push('Week')
  } else if (this.ADDMSSstoppageDaysTime == 'Month') {
    this.MSSstoppageDuration = this.ADDMSSstoppageDaysTimeValue * 30
    this.ADDMSSFinalAvailability.push('Month')
  } else if (this.ADDMSSstoppageDaysTime == 'Year') {
    this.MSSstoppageDuration = this.ADDMSSstoppageDaysTimeValue * 365
    this.ADDMSSFinalAvailability.push('Year')
  }
  this.ADDMSSFinalAvailability.push(this.ADDMSSstoppageDaysTimeValue)
 this.MSSAvailabilityResult = (1-(this.MSSstoppageDuration / this.MSSstoppageValue  ))*100
 this.MSSTreeButton = true
 const element = document.querySelector("#Consequence")
 if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

}

async ADDMSSToTree() {
  if(this.MSSStratergy.length >0){
  var index = this.FMTree.length
    let MSSTree = {
      label:  index,
      type: "person",
      styleClass: 'p-person',
      expanded: true,
      data: { name: "MSS" },
      children: [
        {
          label: "Stratergy",
          type: "person",
          styleClass: 'p-person',
          expanded: true,
          data: {
            name: this.MSSStratergy
          }
        }
      ]
    }   
 
    this.data1[0].children[0].children[0].children[index - 1].children.push(MSSTree)
  }else{
    this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Stratergy is Missing" }) 
  }

    var availablility: number = 0;
    if(this.MSSAvailabilityResult == 0){
        availablility = this.ADDMSSAvailabilityCheck
    }
    if(this.MSSAvailabilityResult != 0){
      availablility = this.MSSAvailabilityResult
    }
    this.ADDMSSFinalAvailability.push(availablility)
      var FMName = this.data1[0].children[0].children[0].children[index - 1].data.name ;
      var dataFromLibrary = this.MSSLibraryJsonData.find(a => a['name'] === FMName);
      var MTBF = dataFromLibrary.mtbf;
      var LN =  Math.log((2*(availablility/100))-1) 
      var INTERVAl : number =  -(MTBF*LN) 
      var intervalWeek = (INTERVAl*365)/7;

        if(this.MSSStratergy == 'A-FFT'    ||  this.MSSStratergy == 'A-OCM' || this.MSSStratergy == 'A-SO'
        || this.MSSStratergy == 'A-SR' ||  this.MSSStratergy == 'A-RED' || this.MSSStratergy == 'A-OFM'
        || this.MSSStratergy == 'B-FFT'||  this.MSSStratergy == 'B-OCM' || this.MSSStratergy == 'B-SO'
        || this.MSSStratergy == 'B-SR' ||  this.MSSStratergy == 'B-RED' || this.MSSStratergy == 'B-OFM' ){

          if(this.MSSStratergy == 'A-OFM' ||     this.MSSStratergy == 'B-FFT'){
            let obj = {}
            obj['MSSMaintenanceInterval'] = 'Not Applicable'
            obj['MSSMaintenanceTask'] = 'Not Applicable'
            obj['MSSStartergy'] = this.MSSStratergy
            obj['MSSAvailability'] = JSON.stringify( this.ADDMSSFinalAvailability)
            obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
            this.MSSTaskObj.push(obj)
          } else{

             var ocmweek:number  = this.FCAInterval
            var result = (ocmweek/ 24)
            var a= result/7

            
              var strategy = this.MSSStratergy.split('-')[1];
              let obj = {}
              if(this.MSSStratergy == 'A-FFT'){
                obj['MSSMaintenanceInterval'] = `${intervalWeek.toFixed(2)} weeks`;
                obj['MSSMaintenanceTask'] = 'Function Check'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                this.MSSTaskObj.push(obj)
              }else{
                if(strategy == 'FFT'){
                  obj['MSSMaintenanceInterval'] = 'Not Applicable';
                  obj['MSSMaintenanceTask'] = 'Not Applicable'
                  obj['MSSStartergy'] = this.MSSStratergy
                  obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                  obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                  this.MSSTaskObj.push(obj)

              }else if(strategy == 'OCM'){
                obj['MSSMaintenanceInterval'] = `${a}${" "}${"Week"}`
                obj['MSSMaintenanceTask'] = 'Carry out talks based on on-condition maintenance recommendation'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                this.MSSTaskObj.push(obj)

              }else if(strategy == 'SO'){
                //  obj['MSSMaintenanceInterval'] = `${this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCASafeLife}${" "}${"Week"}`
                obj['MSSMaintenanceInterval'] = `${this.ADDSafeLife}${" "}${"Week"}`
                obj['MSSMaintenanceTask'] = 'Remove, overhaul, and rectify'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                this.MSSTaskObj.push(obj)

              }else if(strategy == 'SR'){
                // obj['MSSMaintenanceInterval'] = `${ this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCASafeLife}${" "}${"Week"}`
                obj['MSSMaintenanceInterval'] = `${this.ADDSafeLife}${" "}${"Week"}`
                obj['MSSMaintenanceTask'] = 'Remove, replace, and recommission'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                this.MSSTaskObj.push(obj)

              }else if(strategy == 'RED'){
                obj['MSSMaintenanceInterval'] = 'NA'
                obj['MSSMaintenanceTask'] = 'Modification, or redesign required since no task is effective'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                this.MSSTaskObj.push(obj)

              }
          }
        }
      }else if(this.MSSStratergy == 'C-FFT'    ||  this.MSSStratergy == 'C-OCM' || this.MSSStratergy == 'C-SO'
              || this.MSSStratergy == 'C-SR' ||  this.MSSStratergy == 'C-RED' || this.MSSStratergy == 'C-OFM'
              || this.MSSStratergy == 'D-FFT'||  this.MSSStratergy == 'D-OCM' || this.MSSStratergy == 'D-SO'
              || this.MSSStratergy == 'D-SR' ||  this.MSSStratergy == 'D-RED' || this.MSSStratergy == 'D-OFM'
              || this.MSSStratergy == 'E-FFT'||  this.MSSStratergy == 'E-OCM' || this.MSSStratergy == 'E-SO'
              || this.MSSStratergy == 'E-SR' ||  this.MSSStratergy == 'E-RED' || this.MSSStratergy == 'E-OFM'){

                if(this.MSSStratergy == 'C-FFT' ||     this.MSSStratergy == 'D-FFT'){
                  let obj = {}
                  obj['MSSMaintenanceInterval'] = 'Not Applicable'
                  obj['MSSMaintenanceTask'] = 'Not Applicable'
                  obj['MSSStartergy'] = this.MSSStratergy
                  obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                  obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                  this.MSSTaskObj.push(obj)
                } else{
                    //  var ocmHours = this.TreeUptoFCA[0].children[0].children[0].children[this.MSSADDCounter - 1].children[1].FCAData.children[2].data.name
                    //  var ocmHours : number = this.FCAFFInterval
                    //   // var ocmWeek : number = ocmHours.split(" ")[0]
                    //   var ocmWeek = Math.round((ocmHours / 24) / 7)
                      var ocmHours:number  = this.FCAFFInterval
                      var result = (ocmHours/ 24)
                      var x= result/7
                    var strategy = this.MSSStratergy.split('-')[1];
                    let obj = {}
                    if(strategy == 'FFT'){
                      obj['MSSMaintenanceInterval'] = 'NA'
                      obj['MSSMaintenanceTask'] = 'Function check'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                      obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)
                    }else if(strategy == 'OCM'){
                      obj['MSSMaintenanceInterval'] = `${x}${" "}${"Week"}`
                      obj['MSSMaintenanceTask'] = 'Carry out talks based on on-condition maintenance recommendation'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                      obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)

                    }else if(strategy == 'SO'){
                      // obj['MSSMaintenanceInterval'] = `${this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCAUsefulLife}${" "}${"Week"}`
                      obj['MSSMaintenanceInterval'] = `${this.ADDUsefulLife}${" "}${"Week"}`
                      obj['MSSMaintenanceTask'] = 'Remove, overhaul, and rectify'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                      obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)

                    }else if(strategy == 'SR'){
                      // obj['MSSMaintenanceInterval'] = `${this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCAUsefulLife}${" "}${"Week"}`
                      obj['MSSMaintenanceInterval'] = `${this.ADDUsefulLife}${" "}${"Week"}`
                      obj['MSSMaintenanceTask'] = 'Remove, replace, and recommission'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                      obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)

                    }else if(strategy == 'RED'){
                      obj['MSSMaintenanceInterval'] = 'NA'
                      obj['MSSMaintenanceTask'] = 'Modification, or redesign required since no task is effective'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                      obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)

                    }
                    else if(strategy == 'OFM'){
                      obj['MSSMaintenanceInterval'] = 'NA'
                      obj['MSSMaintenanceTask'] = 'No Task'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = JSON.stringify(this.ADDMSSFinalAvailability)
                      obj['MSSIntervalSelectionCriteria'] = this.ADDMSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)

                    }
              }
      }
      this.ADDMSSFinalAvailability = []
      let MSSStrategy = {
        label: "Strategy",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.MSSStratergy,
        }
      }
      this.data1[0].children[0].children[0].MSS[0].children[0].children[0].children [ this.CPPrescriptiveUpdateData.centrifugalPumpPrescriptiveFailureModes.length  ].children.push(MSSStrategy)

      this.MSSTreeButton = true
      this.prescriptiveTree = true
      const element = document.querySelector("#MainScroll")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      this.MSSViewEnabled = false
      this.ADDMSSIntervalSelectionCriteria = ""

  } 
}

