import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit {

  public files: TreeNode[];
  public cols: any[];
  public totalRecords: number;
  public loading: boolean;
  private name: any = [];
  public MachineType: string = "";
  public EquipmentType: string = "";
  public TagNumber: string = "";
  public EquipmentList: any = []
  public TagList: any = [];
  public SelectedTagNumber: string = "";
  public SelectionEnable: boolean = false;
  public InputsEnable: boolean = false;
  public prescriptiveRecords: any = []
  private CBADataList: any = [];

  constructor(private http: HttpClient) {
    this.SelectionEnable = true
    this.MachineEquipmentSelect();
    this.getPrescriptiveRecords();
  }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'discription', header: 'Description' }
    ];
    this.name = [
      { name: 'Prediction' },
      { name: 'Future Prediction' },
      { name: 'FMEA' },
      { name: 'FCA' },
      { name: 'MSS' },
      { name: 'RCA' },
      { name: 'CBA' }
    ]

    this.totalRecords = 10;

    this.loading = true;
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
  }
  getPrescriptiveRecords() {
    this.http.get('api/PrescriptiveAPI/GetTagNumber')
      .subscribe((res: any) => {
        res.forEach(element => {
          this.TagList.push(element.TagNumber)
        });
      });
  }
  getPrescriptiveRecordsByEqui() {
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
            // row.ETBF = this.ETBF ? this.ETBF : 2;
            row.TotalAnnualCostWithMaintenance = 1.777;
            row.EconomicRiskWithoutMaintenance = row.TotalPONC / row.ETBF;
            row.ResidualRiskWithMaintenance = parseFloat((row.TotalAnnualCostWithMaintenance - row.TotalAnnualPOC).toFixed(3));
            let WithETBCAndPONC = row.TotalPONC / row.ETBC;
            let WithoutETBCAndPONC = row.TotalPONC / 5;
            row.WithMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / row.ETBC)) / WithETBCAndPONC).toFixed(0);
            row.WithOutMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / 5)) / WithoutETBCAndPONC).toFixed(0);
            row.ConsequenceCategory = row.Consequence.split(' ')[0];
          });
          this.SelectionEnable = false;
          this.InputsEnable = true;
        }, err => { })
    }
  }

  loadNodes(event) {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.files = [];

      for (let i = 0; i < this.name.length; i++) {
        let node = {
          data: {
            name: this.name[i].name,
            discription: 'Type '
          },
          leaf: false
        };

        this.files.push(node);
      }
    }, 1000);
  }

  onNodeExpand(event) {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      const node = event.node;
      if (node.data.name === 'CBA' || node.data.name === 'MSS'|| node.data.name === 'FCA'|| node.data.name === 'FMEA') {
        let children = []
        for (let index = 0; index < this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.length; index++) {
          let d = this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes[index]
          children.push(
            { data: { name: `${d.FunctionMode}`, type: node.data.name, discription: 'Failure Mode' }, leaf: false },
          )

        }
        node.children = children;
      }
      if (node.data.name !== 'CBA' || node.data.name !== 'RCA' || node.data.name !== 'FCA' || node.data.name !== 'FMEA' || node.data.name !== 'MSS' || node.data.name !== 'Prediction' || node.data.name !== 'Future Prediction') {
        if (node.data.type === 'CBA') {
          let children = [];
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
            if (element.FunctionMode === node.data.name) {
              children.push(
                { data: { name: 'ETBC', discription: `${element.ETBC}` } },
                { data: { name: 'Total Annual Cost With Maintenance', discription: `${element.TotalAnnualCostWithMaintenance}` } },
                { data: { name: 'Residual Risk With Maintenance', discription: `${element.ResidualRiskWithMaintenance}` } },
                // { data: { name: '' ,  discription: `${element.TotalPONC}` } },
                { data: { name: 'Total PONC', discription: `${element.TotalPONC}` } },
                { data: { name: 'Total Annual POC', discription: `${element.TotalAnnualPOC}` } },
                { data: { name: 'Total PONC', discription: `${element.TotalPONC}` } }
              )
            }
          });
          node.children = children;
        } else if (node.data.type === 'MSS') {
          let children = [];
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
            if (element.FunctionMode === node.data.name) {
                element.CentrifugalPumpMssModel.forEach(event => {
                  children.push(
                    { data: { name: 'MSS Startergy' , type:'MSSStartergy', failureMode :element.FunctionMode, strategy :event.MSSStartergy ,  discription: `${event.MSSStartergy}` }, leaf: false  },
                  )
                });
                children.push(
                    { data: { name: 'MSS Avalability' ,  discription: `${element.CentrifugalPumpMssModel[0].MSSFinalAvaliability}` } },
                  )
            }
          });
          node.children = children;
        }else if (node.data.type === 'FCA') {
          let children = [];
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
            if (element.FunctionMode === node.data.name) {
                  children.push(
                    { data: { name: 'Alpha', discription: `${element.FCAAlpha}` } },
                    { data: { name: 'Beta', discription: `${element.FCABeta}` } },
                    { data: { name: 'FCA Interval', discription: `${element.FCAInterval}` } },
                    { data: { name: 'FCA FFI', discription: `${element.FCAFFI}` } },
                    element.FCAUsefulLife !== 0? { data: { name: 'Useful Life', discription: `${element.FCAUsefulLife}` } } : { data: { name: 'Safe Life', discription: `${element.FCASafeLife}` } },
                  )
            }
          });
          node.children = children;
        }else if (node.data.type === 'FMEA') {
          let children = [];
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
            if (element.FunctionMode === node.data.name) {
                  children.push(
                    { data: { name: 'Rating', discription: `${element.Rating}` } },
                    { data: { name: 'MaintainenancePractice', discription: `${element.MaintainenancePractice}` } },
                    { data: { name: 'Frequency Maintainenance', discription: `${element.FrequencyMaintainenance}` } },
                    { data: { name: 'Condition Monitoring', discription: `${element.ConditionMonitoring}` } }
                  )
            }
          });
          node.children = children;
        }else if (node.data.type === 'MSSStartergy') {
          let children = [];
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
            if (element.FunctionMode === node.data.failureMode) {
                element.CentrifugalPumpMssModel.forEach(event => {
                  if(node.data.strategy === event.MSSStartergy){
                    children.push(
                      { data: { name: 'MSS MaintenanceInterval' , discription: `${event.MSSMaintenanceInterval}`} },
                      { data: { name: 'MSS MaintenanceTask' , discription: `${event.MSSMaintenanceTask}`} },
                    )
                  }
                });
            }
          });
          node.children = children;
        }
      }


      // node.children = [
      //   {
      //     data: {
      //       name: node.data.name + ' - 0',
      //       discription: 'File'
      //     },
      //   },
      //   {
      //     data: {
      //       name: node.data.name + ' - 1',
      //       discription: 'File'
      //     }
      //   }
      // ];

      this.files = [...this.files];
    }, 250);

  }
}
