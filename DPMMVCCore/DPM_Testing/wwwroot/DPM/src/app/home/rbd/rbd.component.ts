import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { RBDConstantApi } from './rbd-constant-api';
import { RBDModel } from '../models/rbd.model';

@Component({
  selector: 'app-rbd',
  templateUrl: './rbd.component.html',
  styleUrls: ['./rbd.component.scss']
})
export class RBDComponent implements OnInit {
   public UserDetails: any;
   public MainTree : any =[];
   public ViewSavedTree : any =[];
   public RBDList : any = [];
   public TagNumber : any ;
   public SelectBoxEnabled : boolean = true;
   public SelectUpdateBoxEnabled : boolean = true;
   public rbdModelObj : RBDModel = new RBDModel()
   public TagNumberList : any = [
     {id:1, name:'T1'},{id:2, name:'T2'},{id:3, name:'T2'},{id:4, name:'T2'},{id:5, name:'T5'},{id:6, name:'T6'},{id:7, name:'T7'},{id:8, name:'T8'}
   ];
  public filteredTagNumbers: any[];
  public showFullScreen: boolean = false;
  public viewRBD : boolean = false;
  constructor(private commonBLService : CommonBLService,
    private cd : ChangeDetectorRef,
    private rbdConstantApi : RBDConstantApi) { }
    
  ngOnInit() {
  this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
  this.getRBDList();
  }

  public filterTagNumbers(event){
    this.filteredTagNumbers = []; 
    let query = event.query.toLowerCase().trim();;
    if(query.trim().length===0){ 
      this.filteredTagNumbers = this.TagNumberList;
      this.filteredTagNumbers = this.filteredTagNumbers.slice();
    }
    else{ 
      let hasData = false;
      this.TagNumberList.forEach(ele => {
        if(ele.name.toLowerCase().trim().includes(query)){
            this.filteredTagNumbers.push(ele);
            hasData = true;
        }
      });
      if(!hasData){
        // this.messageService.showMessage('info', 'No such data found');
      }
      else{
        this.filteredTagNumbers = this.filteredTagNumbers.slice(); 
      }
    }
  }

  public filterUpdateTagNumbers(event){
    this.filteredTagNumbers = []; 
    let query = event.query.toLowerCase().trim();;
    if(query.trim().length===0){ 
      this.filteredTagNumbers = this.RBDList;
      this.filteredTagNumbers = this.filteredTagNumbers.slice();
    }
    else{ 
      let hasData = false;
      this.RBDList.forEach(ele => {
        if(ele.TagNumber.toLowerCase().trim().includes(query)){
            this.filteredTagNumbers.push(ele);
            hasData = true;
        }
      });
      if(!hasData){
        // this.messageService.showMessage('info', 'No such data found');
      }
      else{
        this.filteredTagNumbers = this.filteredTagNumbers.slice(); 
      }
    }
  }

  public ViewSavedRBD(r){
    this.viewRBD = true;
    this.ViewSavedTree = [];
    this.cd.detectChanges();
    this.ViewSavedTree = JSON.parse(r.Tree);
    this.showFullScreen = true;
    this.cd.detectChanges();
  }

  public RBDAddSave(){
        this.rbdModelObj.UserId = this.UserDetails.UserId ,
        this.rbdModelObj.Date = moment(),
        this.rbdModelObj.TagNumber = this.TagNumber.name;
        this.rbdModelObj.Tree = JSON.stringify(this.MainTree),
    this.commonBLService.postWithoutHeaders(this.rbdConstantApi.post,this.rbdModelObj).subscribe(
      res => {
        this.getRBDList();
        this.SelectBoxEnabled =true;
        this.TagNumber = [];
        this.rbdModelObj = new RBDModel();
      }, err => {console.log(err.error)}
    )
  }

  public UpdateTagNumberSelect(){
    if(this.TagNumber !== undefined){
      this.SelectUpdateBoxEnabled = true;
      this.RBDList.forEach(element => {
        if(element.TagNumber === this.TagNumber.TagNumber){
          this.MainTree = [];
          this.MainTree = JSON.parse(element.Tree);
          this.rbdModelObj = new RBDModel();
          this.rbdModelObj = element;
        }
      });
      this.SelectUpdateBoxEnabled = false;
    }
  }

  public UpdateRBD(){
    this.rbdModelObj.Tree = JSON.stringify(this.MainTree);
    this.commonBLService.PutData(this.rbdConstantApi.put,this.rbdModelObj).subscribe(
      (res:any) => {
        this.getRBDList();
        this.SelectUpdateBoxEnabled = true;
        this.TagNumber =[];
      }, err => {console.log(err.error)}
    )
  }

  public RBDUpdateBack(){
    this.SelectUpdateBoxEnabled = true;
    this.TagNumber = [];
  }

  private getRBDList(){
    const params = new HttpParams()
          .set('UserId',this.UserDetails.UserId)
    this.commonBLService.getWithParameters(this.rbdConstantApi.getAllRecords,params).subscribe(
      (res:any) => {
        this.RBDList = [];
        this.RBDList = res;
      }, err => {console.log(err.error)}
    )
  }

  public TagNumberSelect(){
    if(this.TagNumber !== undefined){
      this.SelectUpdateBoxEnabled = true;
      this.SelectBoxEnabled = false;
      this.MainTree = [];
      this.MainTree = [{
        id: 100,
        label: '',
        intialNode : true,
        gate:true,
        final:false,
        L:0.0,
        M:0.0,
        gateType:'',
        unAvailabilty:0,
        gateUnAvailability:0,
        KNGate: false,
        expanded: true,
        children: [
        ]
    }];
    }
  }

  public DeleteNode(node){
    this.containsInNestedObjectDF(this.MainTree, node.id);
  }

  public RBDAddBack(){
    this.TagNumber = [];
    this.SelectBoxEnabled = true;
    this.MainTree =[];
    this.MainTree = [{
      id: 100,
      label: '',
      intialNode : true,
      gate:true,
      final:false,
      L:0.0,
      M:0.0,
      K:0,
      N:0,
      unAvailabilty:0,
      gateUnAvailability:0,
      gateType:'',
      KNGate: false,
      expanded: true,
      children: [
      ]
    }];
  }

  
private  containsInNestedObjectDF(obj, val) {
    if (obj === val) {
        return true;
    }

    const keys = obj instanceof Object ? Object.keys(obj) : [];

    for (const key of keys) {

        const objval = obj[key];

        const isMatch = this.containsInNestedObjectDF(objval, val);

        if (isMatch) {
            if (Array.isArray(obj) && obj.length > 0) {
                const deleteNode = obj.findIndex(a => a.id === val);
                obj.splice(deleteNode, 1);
                break;
            }
            return true;
        }
    }

    return false;
}


  private async TraverseNestedJsonForRBD(tree, id: number) {
    for (let index = 0; index < tree.length; index++) {
        if(tree[index].id ==id){
            tree.splice(index,1);
            this.cd.detectChanges();
            break;
        }        
         if (tree.length !==0 && tree[index].children.length > 0) { 
            let Data: any = tree[index].children;
            for (let index1 = 0; index1 < Data.length; index1++) { 
                if(Data[index1].id ==id){
                    Data.splice(index1,1);
                    this.cd.detectChanges();
                    break;
                }
                if (Data[index1].children.length > 0) { 
                    let Data2 = Data[index1].children
                    for (let index3 = 0; index3 < Data2.length; index3++) {
                        var d : any = []
                        d.push(Data2[index3])
                        this.TraverseNestedJsonForRBD(d, id)
                    }
                }
            }
        } 
      break;
    }
}


public FullScreen() {
  let element: any = document.getElementById('ViewRBD');
  element.style.setProperty('background-color', '#fff');
  element.style.setProperty('width', '100%');
  element.style.setProperty('overflow', 'auto');

  let methodTobeInvoked = element.requestFullScreen ||
    element.webkitRequestFullScreen || element['mozRequestFullScreen']
    || element['msRequestFullScreen']
  if (methodTobeInvoked) {
    methodTobeInvoked.call(element);
    this.showFullScreen = false;
  }
}

public ExitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    this.showFullScreen = true;
  }
}

}
