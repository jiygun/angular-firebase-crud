import { CollectionReference } from '@angular/fire/firestore';

export class QueryModel{

    private _query:string;
    private _querySection:string;
    private _queryOrder:string;
    private _data:any;

    constructor(query?:string,querySection?:string,queryOrder?:string,data?:any){
        this._query=query;
        this._querySection=querySection;
        this._queryOrder=queryOrder;
        this._data=data;
    }
    get query():string{
        return this._query;
    }
    set query(query:string){
        this._query=query;
    }
    get querySection():string{
        return this._querySection;
    }
    set querySection(querySection:string){
        this._querySection=querySection;
    }
    get queryOrder():string{
        return this._queryOrder;
    }
    set queryOrder(queryOrder:string){
        this._queryOrder=queryOrder;
    }
    get data():any{
        return this._data;
    }
    set data(data:any){
        this._data=data;
    }
    getQueryModel(ref):CollectionReference{
        if(this._query=="where"){
            return ref.where(this._querySection,this._queryOrder,this._data);
        }else if(this._query=="orderBy"){
            return ref.orderBy(this._querySection,this._queryOrder);
        }else if(this._query=="limit"){
            return ref.limit(this._data);
        }else if(this._query=="startAt"){
            return ref.startAt(this._data);
        }else if(this._query=="startAfter"){
            return ref.startAfter(this._data);
        }else if(this._query=="endAt"){
            return ref.endAt(this._data);
        }else if(this._query=="endBefore"){
            return ref.endBefore(this._data);
        }else{
            return ref;
        }
    }
}