import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Component({
  selector: 'app-skill-library',
  templateUrl: './skill-library.component.html',
  styleUrls: ['./skill-library.component.scss']
})
export class SkillLibraryComponent implements OnInit {
  public MachineType: string = "";
  public EquipmentType: string = "";
  public TagNumber: string = "";
  public EquipmentList: any = []
  public TagList: any = [];
  public SelectedTagNumber: string = "";
  public SelectionEnable: boolean = true;
  public PrescriptiveRecordsList: any = []
  public prescriptiveRecords: any = [];
  public MaintenanceTaskList: any = []
  public SkillLibrary: boolean = false;
  public SkillLibraryHeaders: any = [];
  public SkillLibraryRows: any = [];
  public SkillData: any = [];
  public MaintenanceTasks: any = [
    { Name: "Function Check", Strategy: "A-FFT, E-FFT", SkillPercent: 0 },
    { Name: "Carry out talks based on on-condition maintenance recommendation", Strategy: "OCM, B-OFM", SkillPercent: 0 },
    { Name: "Remove, overhaul, and rectify", Strategy: "SO", SkillPercent: 0 },
    { Name: "Remove, replace, and recommission", Strategy: "SR", SkillPercent: 0 },
    { Name: "Modification, or redesign required since no task is effective", Strategy: "RED", SkillPercent: 0 },
    { Name: "Not Applicable", Strategy: "B-FFT, C-FFT, D-FFT, A-OFM", SkillPercent: 0 },
    { Name: "No Task", Strategy: "OCM, C-OFM, D-OFM, E-OFM", SkillPercent: 0 }
  ]
  public showPSR: boolean = false;
  public PSRDetails: any = [];
  constructor(private http: HttpClient,
    private commonBLervice: CommonBLService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // this.getPrescriptiveRecords();
    // this.MachineEquipmentSelect();
    this.getPrescriptiveRecordsByEqui();
  }

  getPrescriptiveRecords() {
    this.http.get('api/PrescriptiveAPI/GetTagNumber')
      .subscribe((res: any) => {
        this.PrescriptiveRecordsList = res;
      });
  }


  MachineEquipmentSelect() {
    if (this.MachineType == "Pump") {
      this.EquipmentList = []
      this.EquipmentList = ["Centrifugal Pump"]
    }
    if (this.MachineType == "Compressor") {
      this.EquipmentList = []
      this.EquipmentList = ["Screw Compressor"]
    }
    this.TagList = []
    var rec: any = this.PrescriptiveRecordsList.filter(res => res.MachineType === this.MachineType && res.MSSAdded === "1")
    rec.forEach(element => {
      this.TagList.push(element.TagNumber)
    });
  }

  getPrescriptiveRecordsByEqui() {

    this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords')
      .subscribe((res: any) => {
        this.SkillLibraryRows = [];
        res.forEach(row => {
          let obj = {
            Craft: row.CraftSF,
            EmployeeCode: '',
            SkillPercent1: 0,
            SkillPercent2: 0,
            SkillPercent3: 0,
            SkillPercent4: 0,
            SkillPercent5: 0,
            SkillPercent6: 0,
            SkillPercent7: 0,
          }
          this.MaintenanceTasks.forEach((task, index) => {
            let test = {};
            test[`Strategy${index}`]= task.Strategy;
            Object.assign(obj, {test});
          });
          this.SkillLibraryRows.push(obj);
        });
        this.SelectionEnable = false;
        this.SkillLibrary = true;
        this.cdr.detectChanges();
      });
    // if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
    //   this.prescriptiveRecords = [];
    //   this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
    //     .subscribe((res: any) => {
    //       this.MaintenanceTaskList = []
    //       this.prescriptiveRecords = []
    //       this.prescriptiveRecords = res;
    //       this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(row => {

    //         row.CentrifugalPumpMssModel.forEach(mss => {
    //           this.MaintenanceTaskList.push(mss);
    //         });
    //       });

    //       // this.http.get('/api/MSSStartegyAPI/GetAllConfigurationRecords')
    //       //   .subscribe((res: any) => {
    //       //     this.SkillLibraryHeaders = [];
    //       //     var col: number = 3 // 3 because we have 2 fix columns 1- craft and 2- Employee
    //       //     this.MaintenanceTaskList.forEach(element => {
    //       //       var strategy = element.MSSStartergy.split(' ')[0]
    //       //       var abc: any = res.filter(r => r.Strategy == strategy)
    //       //       if (abc.length !== 0) {
    //       //         abc[0].CentrifugalPumpMssId = element.CentrifugalPumpMssId;
    //       //         abc[0].CFPPrescriptiveId = element.CFPPrescriptiveId;
    //       //         abc[0].CPPFMId = element.CPPFMId;
    //       //         abc[0].col = col;
    //       //         col = col + 1;
    //       //       }
    //       //       this.SkillLibraryHeaders.push(abc[0]);
    //       //     });
    //       //   })
    //       this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords')
    //         .subscribe((res: any) => {
    //           this.SkillLibraryRows = [];
    //           res.forEach(row => {
    //             this.SkillLibraryRows.push({
    //               Craft: row.CraftSF,
    //               EmployeeCode: '',
    //               Strategy: '',
    //               SkillPercent: 0
    //             });
    //           });
    //           this.SelectionEnable = false;
    //           this.SkillLibrary = true;
    //           this.cdr.detectChanges();
    //         });

    //     }, err => { console.log(err.error) })
    // }
  }

  BackSkillData() {
    this.SelectionEnable = true;
    this.SkillLibrary = false;
    this.cdr.detectChanges();
  }

  SaveSkillData() {
    this.SkillLibraryRows.forEach(skill => {
      this.MaintenanceTasks.forEach(task => {
      });
    });
    this.showPSR = true;
    this.SkillLibraryRows.forEach(row => {
      this.PSRDetails.push({
        Task: row.CraftSF,
        Craft: row.CraftSF,
        EmployeeCode: '',
        Strategy: '',
        SkillPercent1: 0,
        SkillPercent2: 0,
        SkillPercent3: 0,
        SkillPercent4: 0,
        SkillPercent5: 0,
        SkillPercent6: 0,
        SkillPercent7: 0,
      });
    });
    // this.commonBLervice.postWithHeaders('/PSRClientContractorAPI/PostSkillData', this.SkillData)
    //   .subscribe(
    //     res => {

    //     }, err => { console.log(err.error) }
    //   )

  }

  getSkillData(row: any, event, col: any) {

    var data: any = [];

    if (row !== undefined && col !== undefined && col.MSSStrategyModelId !== undefined && row.PSRClientContractorId !== undefined) {

      data = this.SkillData.filter(r => r.MSSStrategyModelId == col.MSSStrategyModelId || r.PSRClientContractorId == row.PSRClientContractorId)

    }

    if (col !== undefined && col.MSSStrategyModelId !== undefined) {

      data = this.SkillData.filter(r => r.MSSStrategyModelId == col.MSSStrategyModelId)

    }

    if (row !== undefined && row.PSRClientContractorId !== undefined) {

      data = this.SkillData.filter(r => r.PSRClientContractorId == row.PSRClientContractorId)

    }

    if (data.length !== 0) {

      var index = -1;

      index = this.SkillData.findIndex(r => r.CFPPrescriptiveId === data[0].CFPPrescriptiveId)

      this.SkillData[index].MapId = 0

      row !== undefined ? this.SkillData[index].PSRClientContractorId = row.PSRClientContractorId : ''

      row !== undefined ? this.SkillData[index].Employee = row.EmployeeCode : ''

      col !== undefined ? this.SkillData[index].MSSStrategyModelId = col.MSSStrategyModelId : ''

      col !== undefined ? this.SkillData[index].CentrifugalPumpMssId = col.CentrifugalPumpMssId : ''

      col !== undefined ? this.SkillData[index].CFPPrescriptiveId = col.CFPPrescriptiveId : ''

      col !== undefined ? this.SkillData[index].CPPFMId = col.CPPFMId : ''

    }

    else {

      let obj = {}

      obj['MapId'] = 0

      row !== undefined ? obj['PSRClientContractorId'] = row.PSRClientContractorId : ''

      row !== undefined ? obj['Employee'] = row.EmployeeCode : ''

      col !== undefined ? obj['CentrifugalPumpMssId'] = col.CentrifugalPumpMssId : ''

      col !== undefined ? obj['CFPPrescriptiveId'] = col.CFPPrescriptiveId : ''

      col !== undefined ? obj['MSSStrategyModelId'] = col.MSSStrategyModelId : ''

      col !== undefined ? obj['CPPFMId'] = col.CPPFMId : ''

      this.SkillData.push(obj)

    }

    row = undefined

    col = undefined



  }

  onlyNumbers(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();

    }
  }

  trackByIndex(index: any, obj: any): any {
    return index;
  }

  changeValue(row, index) {
    this.SkillLibraryRows.forEach(skill => {
      if (skill.Craft !== row.Craft) {
        skill.SkillPercent = 0;
      }
    });
    this.cdr.detectChanges();
  }

}
