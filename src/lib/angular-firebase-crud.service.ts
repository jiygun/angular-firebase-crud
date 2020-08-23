import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { Database } from './database';
import { QueryModel } from './query.model';
import { Observable,forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AngularFirebaseCrudService implements Database {

  constructor(private fireStore:AngularFirestore) { }

  insert(url: string, data: any):Observable<any>{
    return new Observable((observe)=>{
      this.fireStore.collection(url).add(data).then(result=>(observe.next(result),observe.complete())).catch(error=>observe.error(error));
    });
  }
  get(url: string, ...filters: Array<QueryModel>):Observable<Array<any>>{
    return new Observable((observe)=>{
      this.fireStore.collection(url,ref=>(this.getQueryOrder(ref,filters))).snapshotChanges().subscribe(result=>{
        let resultList=new Array();
        result.forEach((e:any) => {
          resultList.push(e.payload.doc.data());
        });
        observe.next(resultList);
        observe.complete();
      },error=>observe.error(error));
    });
  }
  valueChanges(url:string,...filters: Array<QueryModel>):Observable<any>{
    return new Observable((observe)=>{
      this.fireStore.collection(url,ref=>(this.getQueryOrder(ref,filters))).valueChanges().subscribe(result=>(observe.next(result),observe.complete()),error=>observe.error(error));
    });
  }
  update(url: string,data: any,...filters:Array<QueryModel>):Observable<any> {
    return new Observable((observe)=>{
      this.getFirebaseIds(url,filters).subscribe((fireBaseIds:Array<any>)=>{
        const observables=new Array();
        fireBaseIds.forEach(e => {
          observables.push(this.fireStore.collection(url).doc(e).update(data));
        });
        forkJoin(observables).subscribe(res=>(observe.next(res),observe.complete()),err=>observe.error(err));
      },error=>observe.error(error));
    });
  }
  delete(url: string,...filters:Array<QueryModel>):Observable<any> {
    return new Observable((observe)=>{
      this.getFirebaseIds(url,filters).subscribe((fireBaseIds:Array<any>)=>{
        const observables=new Array();
        fireBaseIds.forEach(e => {
          observables.push(this.fireStore.collection(url).doc(e).delete());
        });
        forkJoin(observables).subscribe(res=>(observe.next(res),observe.complete()),err=>observe.error(err));
      },error=>observe.error(error));
    });
  }
  private getFirebaseIds(url: string,filters: Array<QueryModel>):Observable<any>{
    return new Observable((observe)=>{
      this.fireStore.collection(url,ref=>(this.getQueryOrder(ref,filters))).snapshotChanges().subscribe(result=>{
        let fireBaseIds=new Array();
        result.forEach((e:any) => {
          fireBaseIds.push(e.payload.doc.id);
        });
        observe.next(fireBaseIds);
        observe.complete();
    },error=>observe.error(error));
    });
  }
  private getQueryOrder(ref,filters:Array<QueryModel>){
    if(filters.length==1&&filters[0]!=null&&filters[0]!=undefined) return filters[0].getQueryModel(ref);
    let queryOrder=ref;
    filters.length>0?filters.reduce((result,item)=>{
      queryOrder=item!=null&&item!=undefined?item.getQueryModel(queryOrder):queryOrder;
      return result;
    }):null;
    return queryOrder;
  }
}
