import { Injectable } from "@angular/core";

@Injectable({
    providedIn : 'root'
})
export class AdminConstantAPIs{
   //#region  Designation Access
   
   public DesignationAccessAPI = "/DesignationAccessAPI";
   public GetAllDesignation = "/DesignationAccessAPI/GetAllDesignation";
  //#endregion

  //#region  staff
   
  public RegistrationAPI = "/RegistrationAPI/Register";
  public GetAllStaffRecord = "/RegistrationAPI/RecordsByUserId";
  public UpdateStaff = "/RegistrationAPI/UpdateStaff";
 //#endregion
}