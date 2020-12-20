import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Header } from 'primeng/api/shared';

@Injectable({
  providedIn: 'root'
})
export class AddRuleService {

  constructor(private http: HttpClient) { }

  postAddRule(formData) {
    return this.http.post('api/AddRuleModeAPI', formData);
  }

  putAddRule(formData) {
    return this.http.put('api/AddRuleModeAPI/' + formData.addRuleId, formData);
  }

  deleteAddRule(id) {
    return this.http.delete('api/AddRuleModeAPI/' + id);
  }

  getAddRuleList() {
    var Header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    return this.http.get('api/AddRuleModeAPI');
  }

 
}
