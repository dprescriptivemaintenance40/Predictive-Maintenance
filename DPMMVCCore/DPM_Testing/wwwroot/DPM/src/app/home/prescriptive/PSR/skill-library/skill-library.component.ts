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
  constructor(private http: HttpClient,
    private commonBLervice : CommonBLService,
    private cdr : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getPrescriptiveRecords();
    this.MachineEquipmentSelect();
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
    if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
      this.prescriptiveRecords = [];
      this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
        .subscribe((res: any) => {
          this.MaintenanceTaskList = []
          this.prescriptiveRecords = []
          this.prescriptiveRecords = res;
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(row => {

            row.CentrifugalPumpMssModel.forEach(mss => {
              this.MaintenanceTaskList.push(mss);
            });
          });

          this.http.get('/api/MSSStartegyAPI/GetAllConfigurationRecords').subscribe(
            (res: any) => {
              this.SkillLibraryHeaders = [];
              var col: number = 3 // 3 because we have 2 fix columns 1- craft and 2- Employee
              this.MaintenanceTaskList.forEach(element => {
                var strategy = element.MSSStartergy.split(' ')[0]
                var abc: any = res.filter(r => r.Strategy == strategy)
                if (abc.length !== 0) {
                  abc[0].CentrifugalPumpMssId = element.CentrifugalPumpMssId;
                  abc[0].CFPPrescriptiveId = element.CFPPrescriptiveId;
                  abc[0].CPPFMId = element.CPPFMId;
                  abc[0].col = col;
                  col = col + 1;
                }
                this.SkillLibraryHeaders.push(abc[0]);
              });
            })
          this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords').subscribe(
            (res: any) => {
              this.SkillLibraryRows = [];
              this.SkillLibraryRows = res;
              this.SelectionEnable = false;
              this.SkillLibrary = true;
              this.cdr.detectChanges();
            }
          )

        }, err => { console.log(err.error) })
    }
  }

  BackSkillData() {
    this.SelectionEnable = true;
    this.SkillLibrary = false;
    this.cdr.detectChanges();
  }

  SaveSkillData(){
    this.commonBLervice.postWithHeaders('/PSRClientContractorAPI/PostSkillData', this.SkillData).subscribe(
      res=>{

      }, err=>{console.log(err.error)}
    )

  }

}
