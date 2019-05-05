import { Context, Contract } from 'fabric-contract-api';
export declare class Trace extends Contract {
    operators: string[];
    operatorsMapping: string[];
    explicitOpertors: string[];
    explicitOpertorsMapping: string[];
    initTraceLedger(ctx: Context): Promise<void>;
    createPO(ctx: Context, poNumber: string, poJson: string): Promise<string>;
    createEvent(ctx: Context, eventId: string, eventJson: string): Promise<string>;
    POHistory(ctx: Context, poNumber: string): Promise<string>;
    queryPO(ctx: Context, poNumber: string): Promise<string>;
    createLocation(ctx: Context, locationId: string, locationJson: string): Promise<string>;
    createProduct(ctx: Context, productId: string, productJson: string): Promise<string>;
    queryDb(ctx: Context, queryString: string, type?: string): Promise<string>;
    queryHistoryByKey(ctx: Context, key: string, docType: string): Promise<string>;
    private serializeData;
    private constructQueryStr;
    private constructQueryObj;
    private embedNestedObj;
    private putObjInArr;
    private convertToJson;
}
