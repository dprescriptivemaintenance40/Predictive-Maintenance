import { ChangeDetectorRef, Component, ElementRef, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MessageService } from 'primeng/api';
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { DashboardConstantAPI } from "./dashboard.service";
import { HttpClient } from "@angular/common/http";
import * as Chart from 'chart.js';
import * as moment from "moment";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService]
})
export class DashboardComponent {
  chart: any;
  public ClassificationData: string = "";
  public InsertedDate: any = [];
  public classi: any = [];
  public inserteddate: any = [];
  public ScrewCompressorAllData: any;

  public MachineType: string = "";
  public EquipmentType: string = "";
  public TagNumber: string = "";
  public EquipmentList: any = []
  public prescriptiveRecords: any = [];
  public TagList: any = [];
  public ETBF: string = '';
  public SelectedTagNumber: string = "";
  public CostRisk: boolean = false;
  public DPMMEI: number
  public DPMWithoutMEI: number;
  public Degradecount : number=0;
  public Normalcount : number=0 ;
  public Incipientcount : number=0 ;
  public badcount : number =0;
  public SelectDateType: string = "LastUpload";
  constructor(private title: Title,
    private http: HttpClient,
    private messageService: MessageService,
    private dashboardBLService: CommonBLService,
    private dashboardContantAPI: DashboardConstantAPI,
    private changeDetectorRef: ChangeDetectorRef,) {
    this.title.setTitle('Dashboard | Dynamic Prescriptive Maintenence');
  }
  ngOnInit() {
    this.showReport()
    this.GetAllRecords()
    this.MachineEquipmentSelect();
    this.getAllRecords();
  
  }
  showReport() {
    let embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=8229f0b7-523d-46d9-9a54-b53438061991&autoAuth=true&ctid=606acdf9-2783-4b1f-9afc-a0919c38927d&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWUtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D';
  }
  GetAllRecords() {
    this.dashboardBLService.getWithoutParameters(this.dashboardContantAPI.GetAllRecords)
      .subscribe(
        res => {
          this.ScrewCompressorAllData = res;
             this.ScrewCompressorAllData.forEach(res => {
        res.Classification
        res.Date
        this.ClassificationData= res.Classification;
        this.InsertedDate = res.Date;
    
       })
   
          this.ScrewCompressorAllData.forEach(element => {
            this.classi.push(element.Classification);
            this.inserteddate.push(element.date);
          });
          for(var i=0; i<this.ScrewCompressorAllData.length; i++){
            if(this.classi[i]=="degarde"){
              this.Degradecount= this.Degradecount+1
            }else if(this.classi[i]=="incipient"){
              this.Incipientcount= this.Incipientcount+1
            }else  if(this.classi[i]=="normal"){
              this.Normalcount= this.Normalcount+1
            }else  
              this.badcount= this.badcount+1
            
          }
          this.charts();
          this.ClassificationOfAllRecordDonught();
        }, error => {
          console.log(error.error)
        }
      )
  }

  GetFilterRecords() {}
 

  MachineEquipmentSelect() {
    if (this.MachineType == "Pump") {
      this.EquipmentList = []
      this.EquipmentList = ["Centrifugal Pump"]
    }
    if (this.MachineType == "Compressor") {
      this.EquipmentList = []
      this.EquipmentList = ["Screw Compressor"]
    }
  }
  getAllRecords() {
    this.http.get('api/PrescriptiveAPI/GetTagNumber')
      .subscribe((res: any) => {
        res.forEach(element => {
          this.TagList.push(element.TagNumber)
        });
      });
  }

  getRecordsByEqui() {
    if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
      this.prescriptiveRecords = [];
      this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
        .subscribe((res: any) => {
          this.prescriptiveRecords = res;
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(row => {
            row.TotalAnnualPOC = 0;
            row.CentrifugalPumpMssModel.forEach(mss => {
              if (!mss.MSSMaintenanceInterval || mss.MSSMaintenanceInterval === 'NA' || mss.MSSMaintenanceInterval === 'Not Applicable') {
                mss.POC = 0;
                mss.AnnualPOC = 0;
                mss.Status = '';
              } else {
                let annu = mss.MSSMaintenanceInterval.split(' ');
                if (mss.MSSMaintenanceInterval.toLowerCase().includes('week')) {
                  mss.POC = 0.00025;
                  mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * 0.00025).toFixed(3));
                } else if (mss.MSSMaintenanceInterval.toLowerCase().includes('month')) {
                  mss.POC = 0.02;
                  mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * 0.02).toFixed(3));
                }
                mss.MSSMaintenanceInterval = `${parseFloat(annu[0]).toFixed(1)} ${annu[1]}`;
                mss.Status = 'Retained';
                row.TotalAnnualPOC += mss.AnnualPOC;
              }
            });
            row.ETBC = 10;
            row.TotalPONC = 20796;
            row.ETBF = this.ETBF ? this.ETBF : 2;
            row.TotalAnnualCostWithMaintenance = 1.777;
            row.EconomicRiskWithoutMaintenance = row.TotalPONC / row.ETBF;
            row.ResidualRiskWithMaintenance = parseFloat((row.TotalAnnualCostWithMaintenance - row.TotalAnnualPOC).toFixed(3));
            let WithETBCAndPONC = row.TotalPONC / row.ETBC;
            let WithoutETBCAndPONC = row.TotalPONC / 5;
            row.WithMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / row.ETBC)) / WithETBCAndPONC).toFixed(0);
            this.DPMMEI = row.WithMEI
            row.WithOutMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / 5)) / WithoutETBCAndPONC).toFixed(0);
            this.DPMWithoutMEI = row.WithOutMEI
            row.ConsequenceCategory = row.Consequence.split(' ')[0];
          });
          this.CostRisk = true;
          this.gaugechartwithDPM()
          this.gaugechartwithoutDPM()
        }, err => {
          console.log(err.err);
        });
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please select all three fields." })
    }

  }
  gaugechartwithDPM() {
    this.CostRisk = true;
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart('gaugechart', {
      type: 'doughnut',
      data: {
        labels: ['DPM_With_MEI'],
        datasets: [
          {
            data: [this.DPMMEI, 1],
            backgroundColor: ['blue', 'lightgray'],
            fill: true
          }
        ]
      },
      options: {
        circumference: 1 * Math.PI,
        rotation: 1 * Math.PI,
        cutoutPercentage: 70
      }
    });


  }
  gaugechartwithoutDPM() {
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart('canvasDPM', {
      type: 'doughnut',
      data: {
        labels: ['DPM_Without_MEI'],
        datasets: [
          {
            data: [this.Degradecount,this.Incipientcount,this.Normalcount,this.badcount],
            backgroundColor: ['rgba(255, 0, 0, 1)'],
            fill: false
          }
        ]
      },
      options: {
        circumference: 1 * Math.PI,
        rotation: 1 * Math.PI,
        cutoutPercentage: 70
      }
    });
  }
  
  ClassificationOfAllRecordDonught() {
    this.chart = new Chart('canvasClass', {
      type: 'doughnut',
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        datasets: [
          {
            backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"],
            data: [this.Degradecount, this.Incipientcount, this.Normalcount]
          }
        ]
      },
    });

  }
  charts(){
    this.changeDetectorRef.detectChanges();
    let items = [];
    this.ScrewCompressorAllData.forEach((value) => {
      var Date = moment(value.InsertedDate).format('DD-MM-YYYY');
      items.push(Date);
    });
    this.chart = new Chart("canvas1", {
      type: "bar",
      data: {
        // labels: items,
        fill: true,
        datasets: [
          {
            label: "Incipent",
            data: [this.Incipientcount],
            borderWidth: 1,
            borderColor: "#FFA500",
            backgroundColor: '#FFA500',
            fill: true,
          }, {
            label: "Normal",
            data: [this.Normalcount],
            borderWidth: 1,
            borderColor: "#008000",
            backgroundColor: '#008000',
            fill: true,
          },
          {
            label: "Degrade",
            data: [this.Degradecount],
            borderWidth: 2,
            borderColor: " #FF0000",
            backgroundColor: '#FF0000',
            fill: true,
          }
        ]
      },
      options: {
        scales: {
              xAxes: [{
                  stacked: true,
              }],
              yAxes: [{
                  stacked: true,
              }]
          }
      }
    });
   } 
}
