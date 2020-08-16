import { QueryModel } from './query.model';
import { Observable } from 'rxjs';

export interface Database{
    insert(url:string,data:any):Observable<any>;
    get(url:string,...filters: Array<QueryModel>):Observable<any>;
    update(url:string,data:any):Observable<any>;
    delete(url:string,data:any):Observable<any>;
}