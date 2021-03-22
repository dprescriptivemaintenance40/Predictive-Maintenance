import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
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
  centrifugalPumpPrescriptiveOBJ: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();

  constructor(private http: HttpClient,
    private commonLoadingDirective: CommonLoadingDirective,
    private messageService: MessageService,) { }

  ngOnInit() {
    this.getCentrifugalPumpRecycleChildData();
    this.getCentrifugalPumpRecycleWholeData();
  }


  getCentrifugalPumpRecycleChildData() {
    this.http.get('api/PrescriptiveAPI/CFRecycleDataForChild')
      .subscribe((res: any) => {
        for (let index = 0; index < res.length; index++) {
          let obj = {};
          if (res[index].restoreCentrifugalPumpPrescriptiveFailureModes.length > 0) {
            obj['RCPPMId'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].RCPPMId;
            obj['RCPFMId'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].RCPFMId;
            obj['UserId'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].UserId;
            obj['CPPFMId'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].CPPFMId;
            obj['CFPPrescriptiveId'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].CFPPrescriptiveId;
            obj['FunctionMode'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].FunctionMode;
            obj['LocalEffect'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].LocalEffect;
            obj['SystemEffect'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].SystemEffect;
            obj['Consequence'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].Consequence;
            obj['DownTimeFactor'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].DownTimeFactor;
            obj['ScrapeFactor'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].ScrapeFactor;
            obj['SafetyFactor'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].SafetyFactor;
            obj['ProtectionFactor'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].ProtectionFactor;
            obj['FrequencyFactor'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].FrequencyFactor;
            obj['AttachmentDBPath'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].AttachmentDBPath;
            obj['AttachmentFullPath'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].AttachmentFullPath;
            obj['Remark'] = res[index].restoreCentrifugalPumpPrescriptiveFailureModes[0].Remark;
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
    this.http.get('api/PrescriptiveAPI/CFRecycleWholeData')
      .subscribe(
        res => {
          this.RecycleCentrifugalPumpWholeData = res;
        }, err => {
          console.log(err.err);
        });
  }

  async Restore(data) {
    if (data.Consequence != undefined) {
      var FailureMode = data.FunctionMode
      var LE = data.LocalEffect
      var SE = data.SystemEffect
      var C = data.Consequence

      var RCPPMId = data.RCPPMId
      var consTree: any = []
      this.RecycleCentrifugalPumpChildList.forEach(element => {
        if (element.RCPPMId == RCPPMId) {
          consTree = element.FMWithConsequenceTree
        }
      });
      var FMTreeFromConTreeToRemove = [], LSTreeToEdit

      consTree[0].children[0].children[0].children.forEach(element => {
        if (element.data.name == FailureMode && element.children[0].data.name == LE && element.children[1].data.name == SE && element.children[2].data.name == C) {
          FMTreeFromConTreeToRemove = element;
          element.children.splice(2, 1)
          LSTreeToEdit = element
        }
      });


      var Records: any = await this.getPrescriptiveRecords(data.CFPPrescriptiveId);
      if (Records != undefined) {
        let FMWithConsequenceTree = JSON.parse(Records.FMWithConsequenceTree);
        let FailureModeWithLSETree = JSON.parse(Records.FailureModeWithLSETree);
        FMWithConsequenceTree[0].children[0].children[0].children.push(FMTreeFromConTreeToRemove);
        FailureModeWithLSETree[0].children[0].children[0].children.push(LSTreeToEdit);

        let obj = {}
        obj['CPPFMId'] = 0;
        obj['CFPPrescriptiveId'] = data.CFPPrescriptiveId;
        obj['FunctionMode'] = data.FunctionMode;
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
        this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = JSON.stringify(FMWithConsequenceTree)
        this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = JSON.stringify(FailureModeWithLSETree);

        this.http.put('api/PrescriptiveAPI/FunctionModeAndConsequenceUpdate', this.centrifugalPumpPrescriptiveOBJ)
          .subscribe(
            (res: any) => {
              this.messageService.add({ severity: 'success', summary: 'success', detail: 'SuccessFull restored' });
            }, err => {
              console.log(err.error)
            });
        const params = new HttpParams()
          .set("RCPPMId", data.RCPPMId)
          .set("RCPFMId", data.RCPFMId)
        this.http.delete('api/PrescriptiveAPI/DeleteRecycleWholeData', { params })
          .subscribe(res => {
            this.getCentrifugalPumpRecycleWholeData();
            this.getCentrifugalPumpRecycleChildData();
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'SuccessFull Deleted' });
          }, err => {
            console.log(err.err)
          });

      } else {
        this.messageService.add({ severity: 'success', summary: 'success', detail: 'No records to restore' });
      }

    } else if (data.ComponentCriticalityFactor != undefined) {

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

        this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj);
      }

      this.http.post('api/PrescriptiveAPI/RestoreRecords', this.centrifugalPumpPrescriptiveOBJ)
        .subscribe(
          res => {
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'SuccessFull Restored Records' });
          }, err => { console.log(err) }
        )


      for (let index = 0; index < data.restoreCentrifugalPumpPrescriptiveFailureModes.length; index++) {

        var fullPath = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].AttachmentFullPath
        const params = new HttpParams()
          .set("fullPath", fullPath)

        this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params })
          .subscribe()
      }


      var RCPPMId = data.RCPPMId;
      var RCPFMId: any = 0
      const params = new HttpParams()
        .set("RCPPMId", RCPPMId)
        .set("RCPFMId", RCPFMId)
      this.http.delete('api/PrescriptiveAPI/DeleteRecycleWholeData', { params })
        .subscribe(
          res => {
            this.getCentrifugalPumpRecycleWholeData();
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'SuccessFull Deleted' });
          }, err => { console.log(err.err) }
        )
    }

  }


  async getPrescriptiveRecords(data) {
    const params = new HttpParams().set("id", data);
    return await this.http.get<any>('api/PrescriptiveAPI/GetRecordsFromCPPM', { params }).toPromise();
  }

  Delete(data) {
    if (data.Consequence) {
      const params = new HttpParams()
        .set("RCPPMId", "0")
        .set("RCPFMId", data.RCPFMId)
      this.http.delete('api/PrescriptiveAPI/DeleteRecycleWholeData', { params }).subscribe(
        res => {
          this.getCentrifugalPumpRecycleChildData();
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'SuccessFull Deleted' });
        }, err => { console.log(err.err) }
      )


      if (data.AttachmentFullPath.length > 4) {
        const params = new HttpParams()
          .set("fullPath", data.AttachmentFullPath)

        this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe()

      }

    } else {
      for (let index = 0; index < data.restoreCentrifugalPumpPrescriptiveFailureModes.length; index++) {
        var fullPath = data.restoreCentrifugalPumpPrescriptiveFailureModes[index].AttachmentFullPath
        const params = new HttpParams()
          .set("fullPath", fullPath);
        this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe();
      }
      const params = new HttpParams()
        .set("RCPPMId", data.RCPPMId)
        .set("RCPFMId", "0");
      this.http.delete('api/PrescriptiveAPI/DeleteRecycleWholeData', { params })
        .subscribe((res: any) => {
          this.getCentrifugalPumpRecycleWholeData();
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'SuccessFull Deleted' });
        }, err => { console.log(err.err) });
    }

  }



}
