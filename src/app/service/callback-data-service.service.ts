import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Callback } from 'callback';
import { filter } from 'rxjs/operators';
// import 'rxjs/add/operator/map'
// import 'rxjs/Rx';
import { map } from "rxjs/operators";



interface CallBackServiceEvent {
  key: any;
  data?: any;
}
@Injectable()

export class CallbackDataServiceService {

  callbackObj : Callback;
  callbacks = [];
  private _eventCallBack = new Subject<CallBackServiceEvent>();


  cbDataSource = new BehaviorSubject<any>(null);
  currentCbData = this.cbDataSource.asObservable();

  localvarData = new BehaviorSubject<any>(null);
  currentLocalData = this.localvarData.asObservable();
  
  constructor() {
    this.callbackObj = new Callback();
   }

  ChangeDataPoint(DataPoint: any) {
    console.log("calling service datapoint",DataPoint);
    this.cbDataSource.next(DataPoint);
  }

  ChangeLocalVariable(LocalVar : any){
    console.log("calling service localvar ngOn",LocalVar);
    this.localvarData.next(LocalVar);
  }

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
