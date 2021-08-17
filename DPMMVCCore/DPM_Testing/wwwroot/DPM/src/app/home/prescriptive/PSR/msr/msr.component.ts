import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';

@Component({
  selector: 'app-msr',
  templateUrl: './msr.component.html',
  styleUrls: ['./msr.component.scss']
})
export class MSRComponent implements OnInit {
  public MachineType: string = "";
  public EquipmentType: string = "";
  public TagNumber: string = "";
  public EquipmentList: any = []
  public TagList: any = [];
  public SelectedTagNumber: string = "";
  public SelectionEnable: boolean = true;
  public PSR: boolean = false;
  public PrescriptiveRecordsList: any = []
  public prescriptiveRecords: any = [];
  public TaskDuration : number = 0;
  public SelectedCraft : number = 0;
  public CraftList :any = [];
  public CalculatedPOC : number = 0;
  constructor(private http : HttpClient,
    private commonBLService : CommonBLService,
    private prescriptiveAPIS : PrescriptiveContantAPI) { }

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
  GetCraftRecords(){
    this.commonBLService.getWithoutParameters(this.prescriptiveAPIS.GetAllConfigurationRecords)
    .subscribe(
      (res : any)=>{
        this.CraftList = [];
        this.CraftList = res;
      }, err => {console.log(err.error)}
    )
  }

  gernrateTaskDuration(){
    this.TaskDuration = this.TaskDuration/60;
    var CHR = this.CraftList.filter(f=>f.PSRClientContractorId == this.SelectedCraft)
    this.CalculatedPOC = this.TaskDuration*CHR[0].ClientHourlyRate/1000
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
          this.prescriptiveRecords = []
          this.prescriptiveRecords = res;
          this.PSR =true;
          this.SelectionEnable = false;
        },err => { console.log(err.error)}
        )
      }
    }

    BackSkillData(){
      this.PSR =false;
      this.SelectionEnable = true;
    }

}
