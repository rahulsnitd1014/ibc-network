/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Iterators } from 'fabric-shim';
import { asn } from './asn';
import { AdvanceShipNotice } from './asn';

export class Trace extends Contract {

    public  operators: string[] = ['EQ', 'GT', 'GTE', 'LT', 'LTE', 'NE'];
    public  operatorsMapping: string[] = ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne'];
    public explicitOpertors: string[] = ['OR', 'AND', 'NOR', 'NOT'];
    public explicitOpertorsMapping: string[] = ['$or', '$and', '$nor', '$not'];
    public async initTraceLedger(ctx: Context) {
        console.info('============= START : Initialize initTraceLedger ===========');
        console.info('============= END : Initialize initTraceLedger ===========');
    }

    public async createPO(ctx: Context, poNumber: string, poJson: string): Promise<string> {
        console.info('============= START : Create PO ===========');
        const obj = this.convertToJson(poJson);
        obj[`docType`] = obj.docType || 'PO';
        obj[`status`] = obj.status || 'CREATED';
        await ctx.stub.putState(poNumber, Buffer.from(JSON.stringify(obj)));
        console.info('============= END : Create PO ===========');
        return poJson;
    }

    public async createEvent(ctx: Context, eventId: string, eventJson: string): Promise<string> {
        console.info('============= START : Create Event ===========');
        const obj = this.convertToJson(eventJson);
        obj[`docType`] = obj.docType || 'EVENT';
        await ctx.stub.putState(eventId, Buffer.from(JSON.stringify(obj)));
        console.info('============= END : Create Event ===========');
        return eventJson;
    }

    public async POHistory(ctx: Context, poNumber: string): Promise<string> {
        console.info('============= START : Get PO History ===========');
        const history = [];
        const historyIt  = await ctx.stub.getHistoryForKey(poNumber);
        const resp =  await this.serializeData(history, historyIt);
        console.info('============= END : Get PO History ===========');
        return resp;
    }

    public async queryPO(ctx: Context, poNumber: string): Promise<string> {
        console.info('============= START queryPO ===========');
        const poAsBytes = await ctx.stub.getState(poNumber); // get the po from chaincode state
        if (!poAsBytes || poAsBytes.length === 0) {
            throw new Error(`${poNumber} does not exist queryPO`);
        }
        console.log(poAsBytes.toString());

        return poAsBytes.toString();
    }

    public async createLocation(ctx: Context, locationId: string, locationJson: string): Promise<string> {
        console.info('============= START : Create Location ===========');
        const obj = this.convertToJson(locationJson);
        obj[`docType`] = obj.docType || 'LOCATION';
        obj[`status`] = obj.status || 'ACTIVE';
        // const dataType = this.dataType(obj);
        await ctx.stub.putState(locationId, Buffer.from(JSON.stringify(obj)));
        console.info('============= END : Create Location ===========');
        return locationJson;
    }

    public async createProduct(ctx: Context, productId: string, productJson: string): Promise<string> {
        console.info('============= START : Create Product ===========');
        const obj = this.convertToJson(productJson);
        obj[`docType`] = obj.docType || 'PRODUCT';
        obj[`status`] = obj.status || 'ACTIVE';
        await ctx.stub.putState(productId, Buffer.from(JSON.stringify(obj)));
        console.info('============= END : Create Product ===========');
        return productJson;
    }

    public async queryDb(ctx: Context, queryString: string, type = 'OR'): Promise<string> {
        console.info('============= START : Genric Query DB ===========');
        const queryStr = this.constructQueryStr(queryString, type);
        const queryData = [];
        const queryIt: Iterators.StateQueryIterator = await ctx.stub.getQueryResult(queryStr);
        const resp = await this.serializeData(queryData, queryIt);
        console.info('============= END : Genric Query DB ===========');
        return resp;
    }

    public async queryHistoryByKey(ctx: Context, key: string, docType: string): Promise<string> {
        console.info('============= START : Get History By Key ===========');
        if (!key || !docType) {
            throw({err: 'Key and DocType are required fields'});
        }
        const history = [];
        const historyIt  = await ctx.stub.getHistoryForKey(key);
        let resp =  await this.serializeData(history, historyIt);
        resp = resp.filter((res) => res.docType === docType);
        console.info('============= END : Get History By Key ===========');
        return resp;
    }

    public async createItemEvent(ctx: Context, clientCode: string, encLogic: string, startITN: string,
                                 endITN: string, eventJson: string): Promise<string> {
        console.info('============= START : Create Item Event ===========');
        const obj = this.convertToJson(eventJson);
        obj[`docType`] = obj.docType || 'ITEM_EVENT';
        const key = ctx.stub.createCompositeKey(clientCode + encLogic, [startITN, endITN]);
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(obj)));
        console.info('============= END : Create Item Event ===========');
        return eventJson;
    }

    public async queryHistoryByKeyRange(ctx: Context, startITN: string, endITN: string,
                                        docType: string): Promise<string> {
        console.info('============= START : queryHistoryByKeyRange ===========');
        if (!startITN || !docType) {
            throw({err: 'queryHistoryByKeyRange startITN and DocType are required fields'});
        }
        const history = [];
        const historyIt  = await ctx.stub.getStateByRange(startITN, endITN);
        let resp =  await this.serializeData(history, historyIt);
        resp = resp.filter((res) => res.docType === docType);
        console.info('============= END : queryHistoryByKeyRange ===========');
        return resp;
    }

    private async serializeData(arr, obj: Iterators.HistoryQueryIterator | Iterators.StateQueryIterator) {
        let flag = true;
        while (flag) {
            const response = await obj.next();
            if (response.value && response.value.value && response.value.value.toString()) {
                console.log('response.value.value', response.value.value.toString());
                try {
                    const tmp = JSON.parse(response.value.value.toString('utf8'));
                    arr.push(tmp);
                } catch (e) {
                    arr.push(response.value.value.toString('utf8'));
                }
            }
            if (response.done) {
                flag = false;
            }
        }
        return arr;
    }

    private constructQueryStr(str, type = 'OR'): string {
        const param = str.split(',');
        const paramsArr = [];
        param.map((prm) => {
            let tmp = [];
            let operator = '';
            this.operators.map((o) => {
                const regx = new RegExp(o);
                if (prm.match(regx)) {
                    operator = o;
                }
            });
            if (!operator) {
                throw({err: 'Supported Operators are:: EQ, GT, GTE, LT, LTE, NE'});
                return;
            }
            tmp = prm.split(operator);
            if (tmp.length < 2) {
                throw({err: 'Invalid search parameters'});
                return;
            }
            tmp = [tmp[0], operator, tmp[1]];
            paramsArr.push(tmp);
        });
        const tmpStr: string = this.constructQueryObj(paramsArr, type);
        return tmpStr;
    }

    private constructQueryObj(objArr, type): string {
        const tmp = {};
        objArr.map((obj) => {
            const paramName = obj[0];
            const operator = obj[1];
            const val = obj[2];
            this.embedNestedObj(tmp, paramName, operator, val);
        });
        const explicitOp = this.explicitOpertorsMapping[this.explicitOpertors.indexOf(type)];
        const tmpObj = {selector: {}};
        tmpObj.selector[`${explicitOp}`] = this.putObjInArr(tmp);
        return JSON.stringify(tmpObj);
    }

    private embedNestedObj(obj, paramNameStr, operator, value) {
        const nestedParams = paramNameStr.split('.');
        if (!obj[nestedParams[0]]) {
            obj[nestedParams[0]] = {};
        }
        if (nestedParams.length === 1) {
            const actualOp = this.operatorsMapping[this.operators.indexOf(operator)];
            obj[nestedParams[0]] = {};
            obj[nestedParams[0]][actualOp] =  value;
            return;
        }
        this.embedNestedObj(obj[nestedParams[0]], nestedParams.splice(1, nestedParams.length).join('.')
        , operator, value);
    }

    private putObjInArr(obj) {
        const keys = Object.keys(obj);
        const arr = [];
        for ( const key of keys) {
            const tmp = {};
            tmp[`${key}`] = obj[key];
            arr.push(tmp);
        }
        return arr;
    }

    private convertToJson(strJson: string): any {
        let obj = strJson;
        try {
            obj = JSON.parse(strJson);
        } catch (e) {
            throw({errMsg: 'Invalid JSON Object', err: e});
            return;
        }
        return obj;
    }

    // OBJECT ARRAY are supported
    // private dataType(data) {
    //     let type = 'UNKNOWN';
    //     switch (data) {
    //         case (data instanceof Array && data instanceof Object): type = 'ARRAY';
    //                                                                 break;
    //         case (data instanceof Object): type = 'OBJECT';
    //                                        break;
    //     }
    //     if (type === 'UNKNOWN') {
    //         throw({errMsg: 'Object, Array supported in request body'});
    //     }
    //     return type;
    // }

    // private async persistInDb(ctx, type, obj) {
    //     if (type === 'ARRAY') {
    //         obj.map((oo) => {
    //             const id = oo.id;
    //             await ctx.stub.putState(id, Buffer.from(JSON.stringify(oo)));
    //         });
    //     } else {
    //         const id = obj.id;
    //         await ctx.stub.putState(id, Buffer.from(JSON.stringify(obj)));
    //     }
    // }

}
