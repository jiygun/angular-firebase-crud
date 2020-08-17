import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Database } from './database';
import { QueryModel } from './query.model';

@Injectable({
  providedIn: 'root'
})
export class AngularFirebaseCrudService implements Database {

  constructor(private fireStore:AngularFirestore) { }

  insert(url: string, data: any):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.fireStore.collection(url).add(data).then(result=>resolve(result)).catch(error=>reject(error));
    });
  }
  get(url: string, ...filters: Array<QueryModel>):Promise<Array<any>>{
    return new Promise((resolve,reject)=>{
      this.fireStore.collection(url,ref=>(this.generateQueryOrder(ref,filters))).snapshotChanges().subscribe(result=>{
        let resultList=new Array();
        result.forEach((e:any) => {
          resultList.push(e.payload.doc.data());
        });
        resolve(resultList);
      },error=>reject(error));
    });
  }
  valueChanges(url:string,...filters: Array<QueryModel>):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.fireStore.collection(url,ref=>(this.generateQueryOrder(ref,filters))).valueChanges().pipe().subscribe(result=>resolve(result),error=>reject(error));
    });
  }
  update(url: string,data: any,...filters:Array<QueryModel>):Promise<any> {
    return new Promise((resolve,reject)=>{
      this.getFirebaseIds(url,filters).then((fireBaseIds:Array<any>)=>{
        const promises=new Array();
        fireBaseIds.forEach(e => {
          promises.push(this.fireStore.collection(url).doc(e).update(data));
        });
        Promise.all(promises).then(res=>resolve(res)).catch(err=>reject(err));
      }).catch(error=>reject(error));
    });
  }
  delete(url: string,...filters:Array<QueryModel>):Promise<any> {
    return new Promise((resolve,reject)=>{
      this.getFirebaseIds(url,filters).then((fireBaseIds:Array<any>)=>{
        const promises=new Array();
        fireBaseIds.forEach(e => {
          promises.push(this.fireStore.collection(url).doc(e).delete());
        });
        Promise.all(promises).then(res=>resolve(res)).catch(err=>reject(err));
      }).catch(error=>reject(error));
    });
  }
  private getFirebaseIds(url: string,filters: Array<QueryModel>):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.fireStore.collection(url,ref=>(this.generateQueryOrder(ref,filters))).snapshotChanges().subscribe(result=>{
        let fireBaseIds=new Array();
        result.forEach((e:any) => {
          fireBaseIds.push(e.payload.doc.id);
        });
        resolve(fireBaseIds);
    },error=>reject(error));
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
