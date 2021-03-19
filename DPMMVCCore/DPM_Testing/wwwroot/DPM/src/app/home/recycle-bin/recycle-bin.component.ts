import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { CentrifugalPumpPrescriptiveModel } from './recycle-model';

@Component({
  selector: 'app-recycle-bin',
  templateUrl: './recycle-bin.component.html',
  styleUrls: ['./recycle-bin.component.scss']
})
export class RecycleBinComponent implements OnInit {

  public RecycleCentrifugalPumpChildData : any=[]; 
  public RecycleCentrifugalPumpChildList : any=[];
  public RecycleCentrifugalPumpWholeData : any=[]; 
  centrifugalPumpPrescriptiveOBJ: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();

  constructor(private http : HttpClient,
              private commonLoadingDirective : CommonLoadingDirective) { }

  ngOnInit(){
    this.getCentrifugalPumpRecycleChildData();
    this.getCentrifugalPumpRecycleWholeData()
  }


 getCentrifugalPumpRecycleChildData(){
  this.commonLoadingDirective.showLoading(true, 'Getting things Ready....');
  this.http.get('api/PrescriptiveAPI/CFRecycleDataForChild').subscribe(
    res =>{
      var child :any = res
      if(child.length != 0) {
        for (let index = 0; index < child.length; index++) {
          if(child[index].restoreCentrifugalPumpPrescriptiveFailureModes.length > 0){

          let obj = {}
              obj['RCPFMId']= child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].RCPFMId;
              obj['RCPPMId'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].RCPPMId;
              obj['UserId'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].UserId;
              obj['CPPFMId'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].CPPFMId;
              obj['CFPPrescriptiveId'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].CFPPrescriptiveId;
              obj['FunctionMode'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].FunctionMode;
              obj['LocalEffect'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].LocalEffect;
              obj['SystemEffect'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].SystemEffect;
              obj['Consequence'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].Consequence;
              obj['DownTimeFactor'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].DownTimeFactor;
              obj['ScrapeFactor'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].ScrapeFactor;
              obj['SafetyFactor'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].SafetyFactor;
              obj['ProtectionFactor'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].ProtectionFactor;
              obj['FrequencyFactor'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].FrequencyFactor;
              obj['AttachmentDBPath'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].AttachmentDBPath;
              obj['AttachmentFullPath'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].AttachmentFullPath;
              obj['Remark'] = child[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].Remark;
          this.RecycleCentrifugalPumpChildData.push(obj);
          }
        }
        this.commonLoadingDirective.showLoading(true, 'Getting things Ready....');
        this.RecycleCentrifugalPumpChildList = res;
       
      }
     
      this.commonLoadingDirective.showLoading(false, '');
    }, err => { console.log(err.err) ; this.commonLoadingDirective.showLoading(false, '');}
  )
  this.commonLoadingDirective.showLoading(false, '');
 }


 getCentrifugalPumpRecycleWholeData(){
  this.commonLoadingDirective.showLoading(true, 'Almost done...');
  this.http.get('api/PrescriptiveAPI/CFRecycleWholeData').subscribe(
    res =>{
      this.commonLoadingDirective.showLoading(true, 'Almost done...');
      var Data : any = res
      if(Data.length != 0) {
        this.RecycleCentrifugalPumpWholeData = res;    
      }
    
     this.commonLoadingDirective.showLoading(false, '');
    }, err => { console.log(err.err); this.commonLoadingDirective.showLoading(false, '');}
  )
  this.commonLoadingDirective.showLoading(false, '');
 }

 Restore(data){
  if(data.Consequence != undefined){
    var FailureMode = data.FunctionMode
    var LE = data.LocalEffect
    var SE = data.SystemEffect
    var C = data.Consequence 

    var RCPPMId = data.RCPPMId
    var consTree : any = []
    this.RecycleCentrifugalPumpChildList.forEach(element => {
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

    
  
    var Data : any = []
    const params = new HttpParams()
          .set("id", data.CFPPrescriptiveId)

   this.http.get<any>('api/PrescriptiveAPI/GetRecordsFromCPPM', {params}).subscribe(
    res =>{ 
      
     var Records: any= res 
    if(Records.length > 0) {
    var RecordConTree = JSON.parse(Records[0].FMWithConsequenceTree)
    var RecordLSTree = JSON.parse(Records[0].FailureModeWithLSETree)
    RecordConTree[0].children[0].children[0].children.push(FMTreeFromConTreeToRemove)
    RecordLSTree[0].children[0].children[0].children.push(LSTreeToEdit)

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
    obj['AttachmentDBPath'] = data.AttachmentDBPath;
    obj['AttachmentFullPath'] = data.AttachmentFullPath;
    obj['Remark'] = data.Remark;
    this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = data.CFPPrescriptiveId;
    this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = JSON.stringify(RecordConTree)
    this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = JSON.stringify(RecordLSTree);
    
    this.http.put('api/PrescriptiveAPI/FunctionModeAndConsequenceUpdate', this.centrifugalPumpPrescriptiveOBJ).subscribe(
      res => {
        alert("SuccessFull restored");
        var RCPPMId : any = 0 ;
        var RCPFMId = data.RCPFMId 
        const params = new HttpParams()
              .set("RCPPMId", RCPPMId )
              .set("RCPFMId", RCPFMId )
        this.http.delete('api/PrescriptiveAPI/DeleteRecycleWholeData', {params}).subscribe(
          res =>{ 
            alert("SuccessFull Deleted")
            this.getCentrifugalPumpRecycleChildData();
            this.getCentrifugalPumpRecycleWholeData()
          }, err => { console.log(err.err)}
          
          )
      }, error => {}
    )


    


    } else { 

      alert("No records to restore")
    }

  }, 
  err => { console.log(err)} )

  }else if(data.ComponentCriticalityFactor  != undefined ){
   
        this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = 0
        this.centrifugalPumpPrescriptiveOBJ.UserId = data.UserId
        this.centrifugalPumpPrescriptiveOBJ.MachineType = data.MachineType
        this.centrifugalPumpPrescriptiveOBJ.EquipmentType = data.EquipmentType
        this.centrifugalPumpPrescriptiveOBJ.TagNumber = data.TagNumber
        this.centrifugalPumpPrescriptiveOBJ.FunctionFluidType = data.FunctionFluidType
        this.centrifugalPumpPrescriptiveOBJ.FunctionRatedHead = data.FunctionRatedHead
        this.centrifugalPumpPrescriptiveOBJ.FunctionPeriodType = data.FunctionPeriodType
        this.centrifugalPumpPrescriptiveOBJ.FunctionFailure = data.FunctionFailure
        this.centrifugalPumpPrescriptiveOBJ.Date = data.Date
        this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = data.FailureModeWithLSETree
        this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = data.FMWithConsequenceTree
        this.centrifugalPumpPrescriptiveOBJ.ComponentCriticalityFactor = data.ComponentCriticalityFactor
        this.centrifugalPumpPrescriptiveOBJ.ComponentRating = data.ComponentRating
        this.centrifugalPumpPrescriptiveOBJ.CMaintainenancePractice = data.CMaintainenancePractice
        this.centrifugalPumpPrescriptiveOBJ.CFrequencyMaintainenance = data.CFrequencyMaintainenance
        this.centrifugalPumpPrescriptiveOBJ.CConditionMonitoring = data.CConditionMonitoring
        

       for (let index = 0; index < data.restoreCentrifugalPumpPrescriptiveFailureModes.length; index++) {
        let obj = {}
            obj['CPPFMId'] = 0 ;
            obj['CFPPrescriptiveId'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].CFPPrescriptiveId;
            obj['FunctionMode'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].CFPPrescriptiveId;
            obj['LocalEffect'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].LocalEffect;
            obj['SystemEffect'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].SystemEffect;
            obj['Consequence'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].Consequence;
            obj['DownTimeFactor'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].DownTimeFactor;
            obj['ScrapeFactor'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].ScrapeFactor;
            obj['SafetyFactor'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].SafetyFactor;
            obj['ProtectionFactor'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].ProtectionFactor;
            obj['FrequencyFactor'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].FrequencyFactor;
            obj['CriticalityFactor'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].CriticalityFactor;
            obj['Rating'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].Rating;
            obj['MaintainenancePractice'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].MaintainenancePractice;
            obj['FrequencyMaintainenance'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].FrequencyMaintainenance;
            obj['ConditionMonitoring'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].ConditionMonitoring;
            obj['AttachmentDBPath'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].AttachmentDBPath;
            obj['AttachmentFullPath'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].AttachmentFullPath;
            obj['Remark'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].Remark;

            this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj);
        }

        this.http.post('api/PrescriptiveAPI/RestoreRecords', this.centrifugalPumpPrescriptiveOBJ).subscribe(
          res =>{
            alert("SuccessFull Restored Records")
          }, err => { console.log(err)}
        )


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


getPrescriptiveRecords(data){
   var Data : any = []
    const params = new HttpParams()
          .set("id", data)

   this.http.get<any>('api/PrescriptiveAPI/GetRecordsFromCPPM', {params}).subscribe(
    res =>{ 
       Data =res
       if(Data.length > 0){
        return Data;
        
       } else { return Data = undefined}
     }, err => { console.log(err)}
   )
  
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
