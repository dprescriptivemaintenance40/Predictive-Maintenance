import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeHomeComponentFunction = new EventEmitter();    
  subsVar: Subscription;    
    
  constructor() { }    
    
  SendDataToHomeComponent(abc : any) {    
    this.invokeHomeComponentFunction.emit(abc);    
  } 
}
