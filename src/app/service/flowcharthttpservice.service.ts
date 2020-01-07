import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlowcharthttpserviceService {


   // for testing set machine ip,port,protocol 
   ip = '10.20.0.62'; 
   port = '8002'; 
   // ip = '10.20.0.64';
   // port = '8005';
   protocol = 'http'; 
   // TODO: Move this in a seperate file and add as provider.
   getRequestUrl(path) {
     // uncomment for testing.
     return this.protocol + "://" + this.ip + ":" + this.port + path;
     // return path;
   }

  http: HttpClient;
  constructor(http: HttpClient) {
    console.log('httppppp', this.http);
    this.http = http;
  }

  static apiUrls: any = {
    'callbacks' : '/netvision/rest/webapi/getcallbacks?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    'addcallback' : '/netvision/rest/webapi/addCallBacks?'
  }

  /*
  getCallbacks(){
    let url = this.getRequestUrl(FlowcharthttpserviceService.apiUrls.callbacks);
    return this.http.get(url).pipe(map((response : Response) => response));
  }
  
  addCallbacks(filter){    
    let url = this.getRequestUrl(FlowcharthttpserviceService.apiUrls.addcallback)+"filterCriteria="+JSON.stringify(filter)+"&access_token=563e412ab7f5a282c15ae5de1732bfd1";
    return this.http.get(url).pipe(map((response: Response) => response)); 
  }*/

  getCallbackFromLocalStorage() {
    let callbacks:any = localStorage.getItem('callbacks');
    if(callbacks != null) {
      callbacks = JSON.parse(callbacks);
    } else {
      callbacks = [];
    }
    return callbacks;
  }

  getCallbacks() {
    return Observable.create(observer => {
      observer.next(this.getCallbackFromLocalStorage());
      observer.complete();
    });
  }

  addCallbacks(callback) {
    let callbacks = this.getCallbackFromLocalStorage();

    callbacks.push(callback);

    localStorage.setItem('callbacks', JSON.stringify(callbacks));

    return Observable.create(observer => {
      observer.next(callback);
      observer.complete();
    });
  }


  updateCallback(callback) {
    let callbacks:any[] = this.getCallbackFromLocalStorage();

    // Check if matched with existing then update that entry.
    let ret = callbacks.some(cb => {
      if (cb.name === callback.name) {
        cb.jsondata = callback.jsondata;
        return true;
      }
      return false;
    });

    if (ret === false) {
      callbacks.push(callback);
    }

    localStorage.setItem('callbacks', JSON.stringify(callbacks));
  }
}
