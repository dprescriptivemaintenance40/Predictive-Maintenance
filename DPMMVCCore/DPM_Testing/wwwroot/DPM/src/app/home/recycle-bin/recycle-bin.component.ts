import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { RecycleBinConstantAPI } from './recycle-bin.API';
import { CentrifugalPumpPrescriptiveModel } from './recycle-model';

@Component({
  selector: 'app-recycle-bin',
  templateUrl: './recycle-bin.component.html',
  styleUrls: ['./recycle-bin.component.scss'],
  providers: [MessageService]
})
export class RecycleBinComponent implements OnInit {

  public RecycleCentrifugalPumpChildData: any = [];
  public RecycleCentrifugalPumpChildList: any = [];
  public RecycleCentrifugalPumpWholeData: any = [];
  public FMChild: any;
  centrifugalPumpPrescriptiveOBJ: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();

  constructor(private http: HttpClient,
    private commonLoadingDirective: CommonLoadingDirective,
    private messageService: MessageService,
    private recycleAPIName : RecycleBinConstantAPI,
    private recycleMethod : CommonBLService) { }

  ngOnInit() {
    this.getCentrifugalPumpRecycleChildData();
    this.getCentrifugalPumpRecycleWholeData();
  }


  getCentrifugalPumpRecycleChildData() {
    const url : string = this.recycleAPIName.RecycleBinChildData;
    this.recycleMethod.getWithoutParameters(url)
   // this.http.get('api/PrescriptiveAPI/CFRecycleDataForChild')
      .subscribe((res: any) => {
        for (let index = 0; index < res.length; index++) {
          let obj = {};
          if (res.length > 0) {
            obj['RCPPMId'] = res[index].RCPPMId;
            obj['RCPFMId'] = res[index].RCPFMId;
            obj['UserId'] = res[index].UserId;
            obj['CPPFMId'] = res[index].CPPFMId;
            obj['CFPPrescriptiveId'] = res[index].CFPPrescriptiveId;
            obj['FunctionMode'] = res[index].FunctionMode;
            obj['LocalEffect'] = res[index].LocalEffect;
            obj['SystemEffect'] = res[index].SystemEffect;
            obj['Consequence'] = res[index].Consequence;
            obj['DownTimeFactor'] = res[index].DownTimeFactor;
            obj['ScrapeFactor'] = res[index].ScrapeFactor;
            obj['SafetyFactor'] = res[index].SafetyFactor;
            obj['ProtectionFactor'] = res[index].ProtectionFactor;
            obj['FrequencyFactor'] = res[index].FrequencyFactor;
            obj['AttachmentDBPath'] = res[index].AttachmentDBPath;
            obj['AttachmentFullPath'] = res[index].AttachmentFullPath;
            obj['Remark'] = res[index].Remark;
            obj['DeletedFMTree'] = res[index].DeletedFMTree;
            obj['Pattern'] = res[index].Pattern;
            obj['FCACondition'] = res[index].FCACondition
            obj['FCAInterval'] = res[index].FCAInterval
            obj['FCAFFI'] = res[index].FCAFFI
            obj['FCAAlpha'] = res[index].FCAAlpha
            obj['FCABeta'] = res[index].FCABeta
            obj['FCAUsefulLife'] = res[index].FCAUsefulLife
            obj['FCASafeLife'] = res[index].FCASafeLife
            obj['FCAComment'] = res[index].FCAComment
            obj['MSSMaintenanceInterval'] = res[index].MSSMaintenanceInterval
            obj['MSSStartergy'] = res[index].MSSStartergy
            obj['MSSMaintenanceTask'] = res[index].MSSMaintenanceTask
            obj['MSSIntervalSelectionCriteria'] = res[index].MSSIntervalSelectionCriteria
            this.RecycleCentrifugalPumpChildData.push(obj);
          }
        }
        this.RecycleCentrifugalPumpChildList = res;
      }, err => {
        console.log(err.err);
      }
      )
  }


  getCentrifugalPumpRecycleWholeData() {
    this.commonLoadingDirective.showLoading(true, 'Almost done...');
    const url : string = this.recycleAPIName.RecycleBinWholeData;
    this.recycleMethod.getWithoutParameters(url)
   // this.http.get('api/PrescriptiveAPI/CFRecycleWholeData')
      .subscribe(
        res => {
          this.RecycleCentrifugalPumpWholeData = res;
        }, err => {
          console.log(err.err);
        });
  }

  async Restore(data) {
    if (data.FunctionMode != undefined) {
      var FailureMode = data.FunctionMode
      var LE = data.LocalEffect
      var SE = data.SystemEffect
      var FMToRestore = JSON.parse(data.DeletedFMTree)
      var LSToRestore = JSON.parse(data.DeletedFMTree)
      LSToRestore.children.splice(2, 1)
      var indexAtTreeRestore = FMToRestore.label - 1;
      const params = new HttpParams()
            .set('id',data.CFPPrescriptiveId)
      const url : string = this.recycleAPIName.RestoreDataGetById;
      this.recycleMethod.getWithParameters(url, params)
     // this.http.get('api/PrescriptiveAPI/GetPrescriptiveById?id=' + data.CFPPrescriptiveId)
        .subscribe((res: any) => {
          const DataToRestore = res;
          var consTree: any = [], LSTree: any = []
          consTree = JSON.parse(DataToRestore.FMWithConsequenceTree)
          LSTree = JSON.parse(DataToRestore.FailureModeWithLSETree)
          consTree[0].children[0].children[0].children.splice(indexAtTreeRestore, 0, FMToRestore);
          LSTree[0].children[0].children[0].children.splice(indexAtTreeRestore, 0, LSToRestore);
          var FMWithConsequenceTree: string = JSON.stringify(consTree);
          var FailureModeWithLSETree: string = JSON.stringify(LSTree);
          let obj = {}
          obj['CPPFMId'] = 0;
          obj['CFPPrescriptiveId'] = DataToRestore.CFPPrescriptiveId;
          obj['FunctionMode'] = data.FunctionMode;
          obj['LocalEffect'] = data.LocalEffect;
          obj['SystemEffect'] = data.SystemEffect;
          if (data.Consequence != undefined) {
            obj['Consequence'] = data.Consequence;
          } else { obj['Consequence'] = "" }

          obj['DownTimeFactor'] = data.DownTimeFactor;
          obj['ScrapeFactor'] = data.ScrapeFactor;
          obj['SafetyFactor'] = data.SafetyFactor;
          obj['ProtectionFactor'] = data.ProtectionFactor;
          obj['FrequencyFactor'] = data.FrequencyFactor;
          obj['AttachmentDBPath'] = data.AttachmentDBPath;
          obj['AttachmentFullPath'] = data.AttachmentFullPath;
          obj['Remark'] = data.Remark;
          obj['Pattern'] = data.Pattern;
          obj['FCACondition'] = data.FCACondition
          obj['FCAInterval'] = data.FCAInterval
          obj['FCAFFI'] = data.FCAFFI
          obj['FCAAlpha'] = data.FCAAlpha
          obj['FCABeta'] = data.FCABeta
          obj['FCAUsefulLife'] = data.FCAUsefulLife
          obj['FCASafeLife'] = data.FCASafeLife
          obj['FCAComment'] = data.FCAComment
          obj['MSSMaintenanceInterval'] = data.MSSMaintenanceInterval
          obj['MSSStartergy'] = data.MSSStartergy
          obj['MSSMaintenanceTask'] = data.MSSMaintenanceTask
          obj['MSSIntervalSelectionCriteria'] = data.MSSIntervalSelectionCriteria
          this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
          this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = DataToRestore.CFPPrescriptiveId;
          this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = FMWithConsequenceTree
          this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = FailureModeWithLSETree

          const url : string = this.recycleAPIName.RestoreChild;
          this.recycleMethod.PutData(url, this.centrifugalPumpPrescriptiveOBJ)
         // this.http.put('api/PrescriptiveAPI/FunctionModeAndConsequenceUpdate', this.centrifugalPumpPrescriptiveOBJ)
            .subscribe(
              (res: any) => {
                this.messageService.add({ severity: 'success', summary: 'success', detail: 'Successfully restored' });
                const params = new HttpParams()
                  .set("RCPPMId", data.RCPPMId)
                  .set("RCPFMId", data.RCPFMId)
                const url : string = this.recycleAPIName.DeleteWholeData;
                this.recycleMethod.DeleteWithParam(url, params)
               // this.http.delete('api/PrescriptiveAPI/DeleteRecycleWholeData', { params })
                  .subscribe(res => {
                    this.getCentrifugalPumpRecycleChildData();
                    this.messageService.add({ severity: 'success', summary: 'success', detail: 'Failure Mode Removed from Recycle Bin' });
                  }, err => {
                    console.log(err.err)
                    this.getCentrifugalPumpRecycleChildData();
                  });
              }, err => {
                console.log(err.error);
              });

        }, err => {
          this.messageService.add({ severity: 'warn', detail: err.error });
          console.log(err.err)
        });

    } else if (data.ComponentCriticalityFactor != undefined) {

      this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = 0
      this.centrifugalPumpPrescriptiveOBJ.UserId = data.UserId
      this.centrifugalPumpPrescriptiveOBJ.MachineType = data.MachineType
      this.centrifugalPumpPrescriptiveOBJ.EquipmentType = data.EquipmentType
      this.centrifugalPumpPrescriptiveOBJ.TagNumber = data.TagNumber
      this.centrifugalPumpPrescriptiveOBJ.FunctionFluidType = data.FunctionFluidType
      this.centrifugalPumpPrescriptiveOBJ.FunctionFailure = data.FunctionFailure
      this.centrifugalPumpPrescriptiveOBJ.Date = data.Date
      this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = data.FailureModeWithLSETree
      this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = data.FMWithConsequenceTree
      this.centrifugalPumpPrescriptiveOBJ.ComponentCriticalityFactor = data.ComponentCriticalityFactor
      this.centrifugalPumpPrescriptiveOBJ.ComponentRating = data.ComponentRating
      this.centrifugalPumpPrescriptiveOBJ.CMaintainenancePractice = data.CMaintainenancePractice
      this.centrifugalPumpPrescriptiveOBJ.CFrequencyMaintainenance = data.CFrequencyMaintainenance
      this.centrifugalPumpPrescriptiveOBJ.CConditionMonitoring = data.CConditionMonitoring
      this.centrifugalPumpPrescriptiveOBJ.CAttachmentDBPath = data.CAttachmentDBPath
      this.centrifugalPumpPrescriptiveOBJ.CAttachmentFullPath = data.CAttachmentFullPath
      this.centrifugalPumpPrescriptiveOBJ.CRemarks = data.CRemarks
      this.centrifugalPumpPrescriptiveOBJ.FCAAdded = data.FCAAdded
      this.centrifugalPumpPrescriptiveOBJ.MSSAdded = data.MSSAdded

      for (let index = 0; index < data.restoreCentrifugalPumpPrescriptiveFailureModes.length; index++) {
        let obj = {}
        obj['CPPFMId'] = 0;
        obj['CFPPrescriptiveId'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].CFPPrescriptiveId;
        obj['FunctionMode'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].FunctionMode;
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
        obj['Pattern'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].Pattern;
        obj['FCACondition'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].FCACondition
        obj['FCAInterval'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].FCAInterval
        obj['FCAFFI'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].FCAFFI
        obj['FCAAlpha'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].FCAAlpha
        obj['FCABeta'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].FCABeta
        obj['FCAUsefulLife'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].FCAUsefulLife
        obj['FCASafeLife'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].FCASafeLife
        obj['FCAComment'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].FCAComment
        obj['MSSMaintenanceInterval'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].MSSMaintenanceInterval
        obj['MSSStartergy'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].MSSStartergy
        obj['MSSMaintenanceTask'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].MSSMaintenanceTask
        obj['MSSIntervalSelectionCriteria'] = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].MSSIntervalSelectionCriteria
        this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj);
      }

      const url : string = this.recycleAPIName.RestoreWholeData;
      this.recycleMethod.postWithoutHeaders(url, this.centrifugalPumpPrescriptiveOBJ) 
     // this.http.post('api/PrescriptiveAPI/RestoreRecords', this.centrifugalPumpPrescriptiveOBJ)
        .subscribe(
          res => {
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'Successfully Restored Records' });
            this.DeleteRecycleBinWholeTree(data.RCPPMId)
          }, err => { console.log(err) }
        )

    }

  }

  DeleteRecycleBinWholeTree(RCPPMId) {
    var RCPPMId = RCPPMId;
    var RCPFMId: any = 0
    const params = new HttpParams()
      .set("RCPPMId", RCPPMId)
      .set("RCPFMId", RCPFMId)
    const url : string = this.recycleAPIName.DeleteWholeData;
    this.recycleMethod.DeleteWithParam(url, params)
   // this.http.delete('api/PrescriptiveAPI/DeleteRecycleWholeData', { params })
      .subscribe(
        res => {
          this.getCentrifugalPumpRecycleWholeData();
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Asset has been Removed From Recycle Bin' });
        }, err => { console.log(err.err) }
      )
  }


  Delete(data) {
    if (data.FunctionMode != undefined) {
      const params = new HttpParams()
        .set("RCPPMId", "0")
        .set("RCPFMId", data.RCPFMId)
     const url : string = this.recycleAPIName.DeleteWholeData;
     this.recycleMethod.DeleteWithParam(url, params)
     // this.http.delete('api/PrescriptiveAPI/DeleteRecycleWholeData', { params })
     .subscribe(
        res => {
          this.getCentrifugalPumpRecycleChildData();
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Successfully Deleted' });
        }, err => { console.log(err.err); this.getCentrifugalPumpRecycleChildData(); }
      )


      if (data.AttachmentFullPath.length > 4) {
        const params = new HttpParams()
          .set("fullPath", data.AttachmentFullPath)
       const url : string = this.recycleAPIName.DeleteAttachment;
       this.recycleMethod.DeleteWithParam(url, params).subscribe()
      //  this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe()

      }

    } else {

      for (let index = 0; index < data.restoreCentrifugalPumpPrescriptiveFailureModes.length; index++) {
        var fullPath = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].AttachmentFullPath
        const params = new HttpParams()
          .set("fullPath", fullPath);
        const url : string = this.recycleAPIName.DeleteAttachment;
        this.recycleMethod.DeleteWithParam(url, params).subscribe()   
       // this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe();
      }
      const params = new HttpParams()
        .set("RCPPMId", data.RCPPMId)
        .set("RCPFMId", "0");
      const url : string = this.recycleAPIName.DeleteWholeData;
      this.recycleMethod.DeleteWithParam(url, params)
     // this.http.delete('api/PrescriptiveAPI/DeleteRecycleWholeData', { params })
        .subscribe((res: any) => {
          this.getCentrifugalPumpRecycleWholeData();
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Successfully Deleted' });
        }, err => { console.log(err.err) });
    }

  }



}
