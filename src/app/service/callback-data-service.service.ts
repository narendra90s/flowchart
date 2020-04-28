import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Callback, DataPoint, LocalVariable } from 'callback';
import { filter } from 'rxjs/operators';
// import 'rxjs/add/operator/map'
// import 'rxjs/Rx';
import { map } from "rxjs/operators";
import { Local } from 'protractor/built/driverProviders';



interface CallBackServiceEvent {
  key: any;
  data?: any;
}
@Injectable()
export class CallbackDataServiceService {

  currentCallback: Callback;

  private _eventCallBack = new Subject<CallBackServiceEvent>();
  
  constructor() {

   }

   setCallback(cb: Callback) {
     this.currentCallback = cb;
     this.currentCallback.dirty = false;
     console.log('setCallback called for - ', cb);
   }

   addDataPoint(dp: DataPoint) : DataPoint[] {
    if (this.currentCallback) {
      this.currentCallback.dataPoints.push(dp);
      this.broadcast('addedDataPoint', this.currentCallback.dataPoints);
      console.log('triggered addedDataPoint, data - ', this.currentCallback.dataPoints);
      return this.currentCallback.dataPoints;
    }
    return [];
   }

   getDataPoint() {
    if (this.currentCallback) {
      return this.currentCallback.dataPoints;
    }
    return [];
   }

   addLocalVar(local: LocalVariable): LocalVariable[] {
      if (this.currentCallback) {
        this.currentCallback.localVariables.push(local);
        this.broadcast('addedLocalVar', this.currentCallback.localVariables);
        return this.currentCallback.localVariables;
      }
      return [];
   }

   getLocalVar() {
    if (this.currentCallback) {
      return this.currentCallback.localVariables;
    }
    return [];
   }


  //TODO : Handling should be taken care of
  // ChangeLocalVariable(LocalVar : any){
  //   console.log("calling service localvar ngOn",LocalVar);
  //   this.localvarData.next(LocalVar);
  // }



  broadcast(key: any, data?: any) {
    console.log("BroadCast called");
    this._eventCallBack.next({ key, data });
  }

  on<T>(key: any): Observable<T> {
    return this._eventCallBack.asObservable()
      .pipe(filter(event => event.key === key))
      .pipe(map(event => <T>event.data));
  }
}
