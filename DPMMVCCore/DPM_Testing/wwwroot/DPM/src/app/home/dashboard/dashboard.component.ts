import {ChangeDetectorRef, Component, ElementRef, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MessageService } from 'primeng/api';
import * as pbi from 'powerbi-client'; 
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { DashboardConstantAPI } from "./dashboard.service";
import { HttpClient } from "@angular/common/http";
import { ChartType } from 'chart.js';
import * as Chart from 'chart.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService]
})
export class DashboardComponent {
  chart: any;
  @ViewChild('myChart') canvas: ElementRef;
  public doughnutChartData;
  secondValues = [40, 60];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutOptions = {
    circumference: Math.PI,
    rotation: Math.PI,
    cutoutPercentage: 90 
  };
 public ScrewCompressorAllData : any;
 public MachineType: string = "";
 public EquipmentType: string = "";
 public TagNumber: string = "";
 public EquipmentList: any = []
 public prescriptiveRecords: any = [];
 public TagList: any = [];
 public ETBF: string = '';
 public SelectedTagNumber: string = "";
 public CostRisk: boolean= false;
 public DPMMEI:number 
 public DPMWithoutMEI:number ;
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
  GetAllRecords(){
   this.dashboardBLService.getWithoutParameters(this.dashboardContantAPI.GetAllRecords)
   .subscribe(
     res => {
       this.ScrewCompressorAllData = res;
     },error => {
       console.log(error.error)
     }
   )
  }
 GetFilterRecords(){

 }
//  charts(){
//   this.chart = new Chart("canvas", {
//     type: "bar",
//     data: {
//       labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//       datasets: [
//         {
//           label: "# of Votes",
//           data: [12, 19, 3, 5, 2, 3],
//           backgroundColor: [
//             "rgba(255, 99, 132, 0.2)",
//             "rgba(54, 162, 235, 0.2)",
//             "rgba(255, 206, 86, 0.2)",
//             "rgba(75, 192, 192, 0.2)",
//             "rgba(153, 102, 255, 0.2)",
//             "rgba(255, 159, 64, 0.2)"
//           ],
//           borderColor: [
//             "rgba(255, 99, 132, 1)",
//             "rgba(54, 162, 235, 1)",
//             "rgba(255, 206, 86, 1)",
//             "rgba(75, 192, 192, 1)",
//             "rgba(153, 102, 255, 1)",
//             "rgba(255, 159, 64, 1)"
//           ],
//           borderWidth: 1
//         }
//       ]
//     },
//     options: {
//       scales: {
//         yAxes: [
//           {
//             ticks: {
//               beginAtZero: true,
//               stacked: true,
//             }
//           }
//         ]
//       }
//     }
//   });
//  }
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
                  this.DPMMEI =row.WithMEI
                  row.WithOutMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / 5)) / WithoutETBCAndPONC).toFixed(0);
                  this.DPMWithoutMEI =row.WithOutMEI
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
gaugechartwithDPM(){
  this.CostRisk= true;
  this.changeDetectorRef.detectChanges();
  this.chart = new Chart('gaugechart', {
  type: 'doughnut',
  data: {
    labels: ['DPM_With_MEI'],
    datasets: [
      {
        data: [this.DPMMEI,1],
        backgroundColor: ['blue','lightgray'],
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
gaugechartwithoutDPM(){
    this.chart = new Chart('canvas', {
    type: 'doughnut',
    data: {
      labels: ['DPM_Without_MEI'],
      datasets: [
        {
          data: [this.DPMWithoutMEI,1],
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
}
