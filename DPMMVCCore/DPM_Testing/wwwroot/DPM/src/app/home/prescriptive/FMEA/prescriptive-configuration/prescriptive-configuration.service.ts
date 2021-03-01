import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrescriptiveConfigurationService {

  constructor(private http: HttpClient) { }

  postPrescriptiveLookupMaster(formData) {
    return this.http.post('api/PrescriptiveLookupMasterAPI', formData);
  }

  putPrescriptiveLookupMaster(formData) {
    return this.http.put('api/PrescriptiveLookupMasterAPI/' + formData.prescriptiveLookupMasterId, formData);
  }

  deletePrescriptiveLookupMaster(id) {
    return this.http.delete('api/PrescriptiveLookupMasterAPI/' + id);
  }

  getPrescriptiveLookupMasterList() {
    var Header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    return this.http.get('api/PrescriptiveLookupMasterAPI');
  }
}
