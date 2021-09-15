import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { SCConstantsAPI } from '../../Compressor/ScrewCompressor/shared/ScrewCompressorAPI.service';

@Component({
  selector: 'app-alert-management',
  templateUrl: './alert-management.component.html',
  styleUrls: ['./alert-management.component.scss']
})
export class AlertManagementComponent implements OnInit {
  public userModel: any = [];
  public SkillLibraryAllrecords: any = [];
  public PSRClientContractorData: any = [];
  public EmployeeList : any = [
    {'id': 1 , 'name': 'EMP1'},
    {'id': 2 , 'name': 'EMP2'},
    {'id': 3 , 'name': 'EMP3'},
    {'id': 4 , 'name': 'EMP4'},
    {'id': 5 , 'name': 'EMP5'},
    {'id': 6 , 'name': 'EMP6'},
  ]
  public RecommendationAlertMessage: string = "";
  public screwWithPrediction: any = [];
  constructor(private commonBLService : CommonBLService,
    private http : HttpClient,
    private APIName : SCConstantsAPI,
    private cdr : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userModel = JSON.parse(localStorage.getItem('userObject'));
    this.GetPSRClientContractorData();
    this.getUserSkillRecords();
    this.getPredictedList();
  }

  private GetPSRClientContractorData() {
    this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords')
      .subscribe((res: any) => {
        this.PSRClientContractorData = res;
      }, err => { console.log(err.error)});
  }
  public async getCraft(d : any){
    var a = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === d.Craft)
    return await a.CraftSF;
  }

  getUserSkillRecords(){
    const params = new HttpParams()
          .set('UserId', this.userModel.UserId)
    this.commonBLService.getWithParameters('/SkillLibraryAPI/GetAllConfigurationRecords', params).subscribe(
      async (res : any) => {
        res.forEach(async element => {
         element.CraftName = await this.getCraft(element); 
         var EMPName = this.EmployeeList.find(r=>r.id == element.EmpId)
         element.EMPName = EMPName.name
        });
        this.SkillLibraryAllrecords =res.filter(r=>r.Level !== 100);
      },err => { console.log(err.error)}
    )
  }

  private getPredictedList() {
    this.screwWithPrediction = [];
    var url: string = this.APIName.getPredictedList;
    this.commonBLService.getWithoutParameters(url)
      .subscribe(res => {
        this.screwWithPrediction = res;
        var Data : any = []
          Data = res;
          Data.sort((a,b)=>( moment(a.InsertedDate) > moment(b.InsertedDate) ? 1 : -1 ));
          Data.reverse();
          var incipient =0, degrade=0, normal =0;
          var counter : number =0;
          for (let index = 0; index < Data.length; index++) {
            if((Data[index].Prediction).toLowerCase() === 'normal'){
              normal = normal + 1;
            }else if((Data[index].Prediction).toLowerCase() === 'incipient'){
              incipient = incipient + 1;
            }else if((Data[index].Prediction).toLowerCase() === 'degrade' || (Data[index].Prediction).toLowerCase() === 'degarde'){
              degrade = degrade + 1;
            }
            counter = counter + 1;
            this.RecommendationAlertMessage = "";
            if(counter > 97){
               if(degrade > 6){
                this.RecommendationAlertMessage = 'Machine starts degrading, RCA is recomended';
              }else if(incipient > 6){
                this.RecommendationAlertMessage ='RCM is recomended';
              }
              if(degrade >= 45 && normal >= 30){
                this.RecommendationAlertMessage = 'Prediction jumps from normal to degrad';
              }
              break;
            }
          }  
      }, err => {console.log(err.error)});
  }

}
