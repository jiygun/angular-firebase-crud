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
}