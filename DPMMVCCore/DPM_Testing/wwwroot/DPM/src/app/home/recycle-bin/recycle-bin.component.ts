import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { CentrifugalPumpPrescriptiveModel } from '../prescriptive/FMEA/prescriptive-add/prescriptive-model';

@Component({
  selector: 'app-recycle-bin',
  templateUrl: './recycle-bin.component.html',
  styleUrls: ['./recycle-bin.component.scss']
})
export class RecycleBinComponent implements OnInit {

  public RecycleCentrifugalPumpChildData : any=[]; 
  public RecycleCentrifugalPumpWholeData : any=[]; 
  centrifugalPumpPrescriptiveOBJ: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();

  constructor(private http : HttpClient,
              private commonLoadingDirective : CommonLoadingDirective) { }

  ngOnInit(){
  //  this.commonLoadingDirective.showLoading(true, 'Getting things ready');
    this.http.get('api/PrescriptiveAPI/CFRecycleDataForChild').subscribe(
      res =>{
        var child :any = res
        if(child.length != 0) {
          this.RecycleCentrifugalPumpChildData = res[0].restoreCentrifugalPumpPrescriptiveFailureModes;
      //    this.commonLoadingDirective.showLoading(true, 'Almost Done');
        }
       
      
      }, err => { console.log(err.err) ; this.commonLoadingDirective.showLoading(false, '');}
    )
    
    this.http.get('api/PrescriptiveAPI/CFRecycleWholeData').subscribe(
      res =>{
        var Data : any = res
        if(Data.length != 0) {
          this.RecycleCentrifugalPumpWholeData = res;    
        }
      
     //  this.commonLoadingDirective.showLoading(false, '');
      }, err => { console.log(err.err); this.commonLoadingDirective.showLoading(false, '');}
    )
  }


 Restore(data){
  if(data.Consequence != undefined){
    var FailureMode = data.FunctionMode
    var LE = data.LocalEffect
    var SE = data.SystemEffect
    var C = data.Consequence 

    var RCPPMId = data.RCPPMId
    var consTree : any = []
    this.RecycleCentrifugalPumpChildData.forEach(element => {
       if(element.RCPPMId == RCPPMId){
          consTree = element.FMWithConsequenceTree
       }
    });
   
    consTree = JSON.parse(consTree)

    // consTree[0].children[0].children[0].children
    var FMTreeFromConTreeToRemove = [] , LSTreeToEdit

    consTree[0].children[0].children[0].children.forEach(element => {
       if(element.data.name == FailureMode && element.children[0].data.name == LE &&  element.children[1].data.name == SE && element.children[2].data.name == C ){
          FMTreeFromConTreeToRemove =  element;
          element.children.splice(2, 1)
          LSTreeToEdit = element
       }
    });

    
    var Records : any = this.getPrescriptiveRecords(data.CFPPrescriptiveId)
    var LatestConTree : any = Records.FMWithConsequenceTree[0].children[0].children[0].children.push(FMTreeFromConTreeToRemove)
    var LatestLSTree : any = Records.FailureModeWithLSETree[0].children[0].children[0].children.push(LSTreeToEdit)

    let obj = {}
    obj['CPPFMId'] = 0 ;
    obj['CFPPrescriptiveId'] = data.CFPPrescriptiveId;
    obj['FunctionMode'] = data.CFPPrescriptiveId;
    obj['LocalEffect'] = data.LocalEffect;
    obj['SystemEffect'] = data.SystemEffect;
    obj['Consequence'] = data.Consequence;
    obj['DownTimeFactor'] = data.DownTimeFactor;
    obj['ScrapeFactor'] = data.ScrapeFactor;
    obj['SafetyFactor'] = data.SafetyFactor;
    obj['ProtectionFactor'] = data.ProtectionFactor;
    obj['FrequencyFactor'] = data.FrequencyFactor;
    obj['CriticalityFactor'] = data.CriticalityFactor;
    obj['Rating'] = data.Rating;
    obj['MaintainenancePractice'] = data.MaintainenancePractice;
    obj['FrequencyMaintainenance'] = data.FrequencyMaintainenance;
    obj['ConditionMonitoring'] = data.ConditionMonitoring;
    obj['AttachmentDBPath'] = data.AttachmentDBPath;
    obj['AttachmentFullPath'] = data.AttachmentFullPath;
    obj['Remark'] = data.Remark;
    this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = LatestConTree
    this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = LatestLSTree;
    
    this.http.post('api/PrescriptiveAPI/', this.centrifugalPumpPrescriptiveOBJ).subscribe(
      res => {}, error => {}
    )

  }else if(data.ComponentCriticalityFactor  != undefined ){

  //   FailureMode = "Impeller damage / Shaft damage"
  //   LE = "1" ;
  //   SE = "1" ;
  //   var abc = "E";

  //   var RCPPMId = data.RCPPMId
  //   var consTree : any = []
  //   this.RecycleCentrifugalPumpChildData.forEach(element => {
  //      if(element.RCPPMId == RCPPMId){
  //         consTree = element.FMWithConsequenceTree
  //      }
  //   });

  //   console.log(consTree)
  //   this.RecycleCentrifugalPumpWholeData.forEach(element => {
  //     if(element.RCPPMId == RCPPMId){
  //        consTree = element.FMWithConsequenceTree
  //     }
  //  });

  //  console.log(JSON.parse(consTree))
  //  consTree = JSON.parse(consTree)

  //  // consTree[0].children[0].children[0].children
  //  var FMTreeFromConTreeToRemove = [] , LSTreeToEdit

  //  consTree[0].children[0].children[0].children.forEach(element => {
  //     if(element.data.name == FailureMode && element.children[0].data.name == LE &&  element.children[1].data.name == SE && element.children[2].data.name == abc ){
  //        FMTreeFromConTreeToRemove =  element;
  //        element.children.splice(2, 1)
  //        LSTreeToEdit = element
  //     }
  //  });

  //  console.log(FMTreeFromConTreeToRemove)
  //  console.log(LSTreeToEdit)

   }

 }


 getPrescriptiveRecords(data){
  var Data : any 
  const params = new HttpParams()
  .set("id", data)

   this.http.get('api/PrescriptiveAPI/GetRecordsFromCPPM', {params}).subscribe(
     res =>{ 
       Data = res;
     }, err => { console.log(err) }
   )

   return Data;
 }

 Delete(data){
  if(data.Consequence){
    var RCPPMId : any = 0 ;
    var RCPFMId = data.RCPFMId 
    const params = new HttpParams()
    .set("RCPPMId", RCPPMId )
    .set("RCPFMId", RCPFMId )
    this.http.delete('api/PrescriptiveAPI/DeleteRecycleWholeData', {params}).subscribe(
      res =>{ alert("SuccessFull Deleted")}, err => { console.log(err.err)}
      )


      if(data.AttachmentFullPath.length > 4){
        const params = new HttpParams()
        .set("fullPath", data.AttachmentFullPath)
   
        this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', {params}).subscribe()
  
      }
  
  }else if(data.ComponentCriticalityFactor){
    
    for (let index = 0; index < data.restoreCentrifugalPumpPrescriptiveFailureModes.length; index++) {
     
        var fullPath = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].AttachmentFullPath
        const params = new HttpParams()
             .set("fullPath", fullPath)
        
        this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', {params}).subscribe()
      }


      var RCPPMId = data.RCPPMId ;
      var RCPFMId : any = 0
      const params = new HttpParams()
      .set("RCPPMId", RCPPMId )
      .set("RCPFMId", RCPFMId )
      this.http.delete('api/PrescriptiveAPI/DeleteRecycleWholeData', {params}).subscribe(
        res =>{ alert("SuccessFull Deleted")}, err => { console.log(err.err)}
        )
  
  }

 
 }



}
