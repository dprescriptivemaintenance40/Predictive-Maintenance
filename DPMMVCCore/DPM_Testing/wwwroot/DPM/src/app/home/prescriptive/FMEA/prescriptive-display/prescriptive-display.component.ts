import { HttpClient } from '@angular/common/http';
import {Component,OnInit} from '@angular/core';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-prescriptive-display',
  templateUrl: './prescriptive-display.component.html',
  styleUrls: ['./prescriptive-display.component.scss']
})

export class PrescriptiveDisplayComponent implements OnInit {
  files1: TreeNode[];
  public PrescriptiveRecords : any =[];
  public abc : any = [];
  public xyz : any = [];
 


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('api/PrescriptiveAPI').subscribe(
      res =>{
          this.PrescriptiveRecords = res;
          this.PushRecordsInFiles();
      }
    )
    

  }

  PushRecordsInFiles(){
    for (let index = 0; index < this.PrescriptiveRecords.length; index++) {
      const element = this.PrescriptiveRecords[index];
      this.abc =  {
        "label":"Equipment Type : " + this.PrescriptiveRecords[index].EquipmentType +",  " +"  "+ "Tag Number : "+ this.PrescriptiveRecords[index].TagNumber,
        "data": "Documents Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [{
                "label": "Function",
                "data": "Work Folder",
                "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [ {"label": "Fluid Type : " + this.PrescriptiveRecords[index].FunctionFluidType + ", "+"Rated Head : "+ this.PrescriptiveRecords[index].FunctionRatedHead+" m "+ ", "+"Duration Of : "+ this.PrescriptiveRecords[index].FunctionPeriodType+ " days"}, {
                "label": "Function Failure",
                "data": "Home Folder",
                "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [{"label": this.PrescriptiveRecords[index].FunctionFailure, "icon": "pi pi-file"},
                 {
                "label": "Failure Mode",
                "data": "Home Folder",
                "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [{"label": this.PrescriptiveRecords[index].FunctionMode, "icon": "pi pi-file"},
                {"label": "Local Effect", 
                 "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [{"label": this.PrescriptiveRecords[index].LocalEffect, "icon": "pi pi-file"}]},
                {"label": "System Effect",  "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [{"label": this.PrescriptiveRecords[index].SystemEffect, "icon": "pi pi-file"}]},
                {"label": "Consequence",  "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [{"label": "Consequence : "+ this.PrescriptiveRecords[index].Consequence, "icon": "pi pi-file"}]}]
            }]
            }]
                
            }
             
           ]
           
    }
    this.xyz.push(this.abc)
    
    }
    this.files1 = this.xyz

  }

}


