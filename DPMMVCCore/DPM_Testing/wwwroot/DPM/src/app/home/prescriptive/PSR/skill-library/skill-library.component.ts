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
    { Name: "Function Check", Strategy: "A-FFT, E-FFT" },
    { Name: "Carry out talks based on on-condition maintenance recommendation", Strategy: "OCM, B-OFM" },
    { Name: "Remove, overhaul, and rectify", Strategy: "SO" },
    { Name: "Remove, replace, and recommission", Strategy: "SR" },
    { Name: "Modification, or redesign required since no task is effective", Strategy: "RED" },
    { Name: "Not Applicable", Strategy: "B-FFT, C-FFT, D-FFT, A-OFM" },
    { Name: "No Task", Strategy: "OCM, C-OFM, D-OFM, E-OFM" }
  ]
  public showPSR: boolean = false;
  public PSRDetails: any = [];
  public SkillLibraryColumns: any = [];
  private userModel: any;
  private SkillLibraryData: any = [];
  private PSRClientContractorData: any = [];
  constructor(private http: HttpClient,
    private commonBLervice: CommonBLService,
    private cdr: ChangeDetectorRef) {
    this.SkillLibraryColumns.push(
      { field: 'Craft', header: 'Craft', width: '5em', inputtype: false },
      { field: 'EmployeeCode', header: 'Employee Code', width: '10em', inputtype: true, placeholder: 'Code', type: 'text' },
    );
    this.MaintenanceTasks.forEach((row, index) => {
      this.SkillLibraryColumns.push(
        { field: `SkillPercent${index}`, header: row.Name, width: '10em', inputtype: true, placeholder: 'Skill Percent', type: 'number' },
      );
    });
    this.userModel = JSON.parse(localStorage.getItem('userObject'));
  }

  ngOnInit(): void {
    // this.getPrescriptiveRecords();
    // this.MachineEquipmentSelect();
    this.GetSkillMappedData();
    this.GetPSRClientContractorData();
  }

  getPrescriptiveRecords() {
    this.http.get('api/PrescriptiveAPI/GetTagNumber')
      .subscribe((res: any) => {
        this.PrescriptiveRecordsList = res;
      });
  }

  public GetSkillMappedData() {
    this.http.get(`api/PSRClientContractorAPI/GetSkillMappedData?UserId=${this.userModel.UserId}`)
      .subscribe((res: any) => {
        this.SkillLibraryData = res;
        this.getPrescriptiveRecordsByEqui();
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
          let obj = {}
          const checkSkillData = this.SkillLibraryData.find(a => a.Craft === row.CraftSF);
          if (checkSkillData) {
            obj = {
              MapId: checkSkillData.MapId,
              Craft: checkSkillData.Craft,
              EmployeeCode: checkSkillData.EmployeeCode
            }
            this.MaintenanceTasks.forEach((task, index) => {
              let test = {};
              if (checkSkillData.Strategy && task.Strategy === checkSkillData.Strategy) {
                test[`SkillPercent${index}`] = checkSkillData.SkillPercent;
                test[`Strategy${index}`] = task.Strategy;
              }
              else {
                test[`SkillPercent${index}`] = undefined;
                test[`Strategy${index}`] = task.Strategy;
              }
              Object.assign(obj, test);
            });
          } else {
            obj = {
              MapId: 0,
              Craft: row.CraftSF,
              EmployeeCode: ''
            }
            this.MaintenanceTasks.forEach((task, index) => {
              let test = {};
              test[`SkillPercent${index}`] = undefined;
              test[`Strategy${index}`] = task.Strategy;
              Object.assign(obj, test);
            });
          }
          this.SkillLibraryRows.push(obj);
        });
        this.SelectionEnable = false;
        this.SkillLibrary = true;
      });
  }

  private GetPSRClientContractorData() {
    this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords')
      .subscribe((res: any) => {
        this.PSRClientContractorData = res;
      });
  }

  BackSkillData() {
    this.SelectionEnable = true;
    this.SkillLibrary = false;
    this.cdr.detectChanges();
  }

  SaveSkillData() {
    this.SkillLibraryRows.forEach(skill => {
      for (let i = 2; i <= Object.keys(skill).length; i++) {
        if (skill.EmployeeCode && skill[`SkillPercent${i - 2}`]) {
          this.SkillData.push({
            MapId: skill.MapId !== 0 ? skill.MapId : 0,
            UserId: this.userModel.UserId,
            EmployeeCode: skill.EmployeeCode,
            Craft: skill.Craft,
            Strategy: skill[`Strategy${i - 2}`],
            SkillPercent: skill[`SkillPercent${i - 2}`],
          });
        }
      }
    });
    if (this.SkillData.length > 0) {
      this.commonBLervice.postWithHeaders('/PSRClientContractorAPI/PostSkillData', this.SkillData)
        .subscribe(res => {
          this.GetSkillMappedData();
          this.showPSR = true;
        }, err => {
          console.log(err.error);
        });
    } else {
      alert('No mapping for Craft and maintenance')
    }

  }

  onlyNumbers(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();

    }
  }
  RemovePreviousVal(row, col, index) {
    for (let i = 2; i <= Object.keys(row).length; i++) {
      if (`SkillPercent${i - 2}` !== col && row[`SkillPercent${i - 2}`]) {
        this.SkillLibraryRows[index][`SkillPercent${i - 2}`] = undefined;
      }
    }
  }

}
