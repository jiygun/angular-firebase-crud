import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Database } from './database';
import { QueryModel } from './query.model';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AngularFirebaseCrudService implements Database {

  constructor(private fireStore:AngularFirestore) { }

  insert(url: string, data: any):Observable<any>{
    return new Observable((observer)=>{
      this.fireStore.collection(url).add(data).then(result=>observer.next(result)).catch(error=>observer.error(error));
    });
  }
  get(url: string, ...filters: Array<QueryModel>):Observable<Array<any>>{
    return new Observable((observer)=>{
      this.fireStore.collection(url,ref=>(this.generateQueryOrder(ref,filters))).snapshotChanges().subscribe(result=>{
        let resultList=new Array();
        result.forEach((e:any) => {
          resultList.push(e.payload.doc.data());
        });
        observer.next(resultList);
      },error=>{observer.error(error)});
    });
  }
  valueChanges(url:string,...filters: Array<QueryModel>):Observable<any>{
    return new Observable((observer)=>{
      this.fireStore.collection(url,ref=>(this.generateQueryOrder(ref,filters))).valueChanges().pipe().subscribe(result=>observer.next(result),error=>observer.error(error));
    });
  }
  update(url: string,data: any,...filters:Array<QueryModel>):Observable<any> {
    return new Observable((observer)=>{
      this.getFirebaseIds(url,filters).subscribe((fireBaseIds:Array<any>)=>{
        const promises=new Array();
        fireBaseIds.forEach(e => {
          promises.push(this.fireStore.collection(url).doc(e).update(data));
        });
        forkJoin(promises).subscribe(result=>observer.next(result),error=>observer.error(error));
      },error=>observer.error(error));
    });
  }
  delete(url: string,...filters:Array<QueryModel>) {
    return new Observable((observer)=>{
      this.getFirebaseIds(url,filters).subscribe((fireBaseIds:Array<any>)=>{
        const promises=new Array();
        fireBaseIds.forEach(e => {
          promises.push(this.fireStore.collection(url).doc(e).delete());
        });
        forkJoin(promises).subscribe(result=>observer.next(result),error=>observer.error(error));
      },error=>observer.error(error));
    });
  }
  private getFirebaseIds(url: string,filters: Array<QueryModel>):Observable<any>{
    return new Observable((observer)=>{
      this.fireStore.collection(url,ref=>(this.generateQueryOrder(ref,filters))).snapshotChanges().subscribe(result=>{
        let fireBaseIds=new Array();
        result.forEach((e:any) => {
          fireBaseIds.push(e.payload.doc.id);
        });
        observer.next(fireBaseIds);
    },error=>observer.error(error));
    });
  }
  private generateQueryOrder(ref,filters:Array<QueryModel>){
    let query=filters.length>0?this.getFirstQuery(ref,filters[0]):ref;
    if(filters.length>1){
        for(let i=1;i<filters.length;i++){
            query=this.getNextQuery(query,filters[i]);
        }
    }
    return query;
  }
  private getFirstQuery(ref,filter:QueryModel){
      if(filter.query=="where"){
          return ref.where(filter.querySection,filter.queryOrder,filter.data);
      }else if(filter.query=="orderBy"){
          return ref.orderBy(filter.querySection,filter.queryOrder);
      }else if(filter.query=="limit"){
          return ref.limit(filter.data);
      }else if(filter.query=="startAt"){
          return ref.startAt(filter.data);
      }else if(filter.query=="startAfter"){
          return ref.startAfter(filter.data);
      }else if(filter.query=="endAt"){
          return ref.endAt(filter.data);
      }else if(filter.query=="endBefore"){
          return ref.endBefore(filter.data);
      }else{
          return ref;
      }
  }
  private getNextQuery(query,filter:QueryModel){
      if(filter.query=="where"){
          return query.where(filter.querySection,filter.queryOrder,filter.data);
      }else if(filter.query=="orderBy"){
          return query.orderBy(filter.querySection,filter.queryOrder);
      }else if(filter.query=="limit"){
          return query.limit(filter.data);
      }else if(filter.query=="startAt"){
          return query.startAt(filter.data);
      }else if(filter.query=="startAfter"){
          return query.startAfter(filter.data);
      }else if(filter.query=="endAt"){
          return query.endAt(filter.data);
      }else if(filter.query=="endBefore"){
          return query.endBefore(filter.data);
      }
  }
}
