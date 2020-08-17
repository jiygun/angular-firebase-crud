import { QueryModel } from './query.model';
import { Observable } from 'rxjs';

export interface Database{
    insert(url:string,data:any):Promise<any>;
    get(url:string,...filters: Array<QueryModel>):Promise<any>;
    update(url:string,data:any):Promise<any>;
    delete(url:string,data:any):Promise<any>;
}