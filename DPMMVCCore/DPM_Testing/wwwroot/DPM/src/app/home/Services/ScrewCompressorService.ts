import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrewCompressorService {

  constructor(private http: HttpClient) { }

  postAddRule(formData) {
    return this.http.post('api/ScrewCompressorConfigurationAPI', formData);
  }

  putAddRule(formData) {
    return this.http.put('api/ScrewCompressorConfigurationAPI/' + formData.addRuleId, formData);
  }

  deleteAddRule(id) {
    return this.http.delete('api/ScrewCompressorConfigurationAPI/' + id);
  }

  getAddRuleList() {
    var Header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    return this.http.get('api/ScrewCompressorConfigurationAPI');
  }

 
}
