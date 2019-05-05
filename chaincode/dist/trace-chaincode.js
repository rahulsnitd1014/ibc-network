"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
class Trace extends fabric_contract_api_1.Contract {
    constructor() {
        super(...arguments);
        this.operators = ['EQ', 'GT', 'GTE', 'LT', 'LTE', 'NE'];
        this.operatorsMapping = ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne'];
        this.explicitOpertors = ['OR', 'AND'];
        this.explicitOpertorsMapping = ['$or', '$and'];
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
    async initTraceLedger(ctx) {
        console.info('============= START : Initialize initTraceLedger ===========');
        console.info('============= END : Initialize initTraceLedger ===========');
    }
    // public async createASN(ctx: Context, poNumber: string, asnXML: string, asnJson: string) {
    //     console.info('============= START : Create ASN ===========');
    //     const advanceShipNotice: AdvanceShipNotice = JSON.parse(asnJson);
    //     const obj: asn = {
    //         advanceShipNotice,
    //         asnJson,
    //         asnXML,
    //         docType: 'ASN',
    //         poNumber,
    //     };
    //     obj[`status`] = advanceShipNotice.status || 'ACTIVE';
    //     console.info('Asn Json  asn:: ' + obj.asnJson + '::::=====>>>'
    // + obj.advanceShipNotice.FileHeader.GSSenderID +
    //     '=====>>>' + obj.asnXML);
    //     await ctx.stub.putState(poNumber, Buffer.from(JSON.stringify(asn)));
    //     console.info('============= END : Create ASN ===========');
    // }
    // public async queryASN(ctx: Context, poNumber: string): Promise<string> {
    //     const asnAsBytes = await ctx.stub.getState(poNumber); // get the asn from chaincode state
    //     if (!asnAsBytes || asnAsBytes.length === 0) {
    //         throw new Error(`${poNumber} does not exist`);
    //     }
    //     console.log(asnAsBytes.toString());
    //     return asnAsBytes.toString();
    // }
    async createPO(ctx, poNumber, poJson) {
        console.info('============= START : Create PO ===========');
        const obj = this.convertToJson(poJson);
        obj[`docType`] = obj.docType || 'PO';
        obj[`status`] = obj.status || 'CREATED';
        await ctx.stub.putState(poNumber, Buffer.from(JSON.stringify(obj)));
        console.info('============= END : Create PO ===========');
        return poJson;
    }
    async createEvent(ctx, eventId, eventJson) {
        console.info('============= START : Create Event ===========');
        const obj = this.convertToJson(eventJson);
        obj[`docType`] = obj.docType || 'EVENT';
        await ctx.stub.putState(eventId, Buffer.from(JSON.stringify(obj)));
        console.info('============= END : Create Event ===========');
        return eventJson;
    }
    async POHistory(ctx, poNumber) {
        console.info('============= START : Get PO History ===========');
        const history = [];
        const historyIt = await ctx.stub.getHistoryForKey(poNumber);
        const resp = await this.serializeData(history, historyIt);
        console.info('============= END : Get PO History ===========');
        return resp;
    }
    async queryPO(ctx, poNumber) {
        console.info('============= START queryPO ===========');
        const poAsBytes = await ctx.stub.getState(poNumber); // get the po from chaincode state
        if (!poAsBytes || poAsBytes.length === 0) {
            throw new Error(`${poNumber} does not exist queryPO`);
        }
        console.log(poAsBytes.toString());
        return poAsBytes.toString();
    }
    async createLocation(ctx, locationId, locationJson) {
        console.info('============= START : Create Location ===========');
        const obj = this.convertToJson(locationJson);
        obj[`docType`] = obj.docType || 'LOCATION';
        obj[`status`] = obj.status || 'ACTIVE';
        // const dataType = this.dataType(obj);
        await ctx.stub.putState(locationId, Buffer.from(JSON.stringify(obj)));
        console.info('============= END : Create Location ===========');
        return locationJson;
    }
    async createProduct(ctx, productId, productJson) {
        console.info('============= START : Create Product ===========');
        const obj = this.convertToJson(productJson);
        obj[`docType`] = obj.docType || 'PRODUCT';
        obj[`status`] = obj.status || 'ACTIVE';
        await ctx.stub.putState(productId, Buffer.from(JSON.stringify(obj)));
        console.info('============= END : Create Product ===========');
        return productJson;
    }
    async queryDb(ctx, queryString, type = 'OR') {
        console.info('============= START : Genric Query DB ===========');
        const queryStr = this.constructQueryStr(queryString, type);
        const queryData = [];
        const queryIt = await ctx.stub.getQueryResult(queryStr);
        const resp = await this.serializeData(queryData, queryIt);
        console.info('============= END : Genric Query DB ===========');
        return resp;
    }
    async queryHistoryByKey(ctx, key, docType) {
        console.info('============= START : Get History By Key ===========');
        if (!key || !docType) {
            throw ({ err: 'Key and DocType are required fields' });
        }
        const history = [];
        const historyIt = await ctx.stub.getHistoryForKey(key);
        let resp = await this.serializeData(history, historyIt);
        resp = resp.filter((res) => res.docType === docType);
        console.info('============= END : Get History By Key ===========');
        return resp;
    }
    async serializeData(arr, obj) {
        let flag = true;
        while (flag) {
            const response = await obj.next();
            if (response.value && response.value.value && response.value.value.toString()) {
                console.log('response.value.value', response.value.value.toString());
                try {
                    const tmp = JSON.parse(response.value.value.toString('utf8'));
                    arr.push(tmp);
                }
                catch (e) {
                    arr.push(response.value.value.toString('utf8'));
                }
            }
            if (response.done) {
                flag = false;
            }
        }
        return arr;
    }
    constructQueryStr(str, type = 'OR') {
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
                throw ({ err: 'Supported Operators are:: EQ, GT, GTE, LT, LTE, NE' });
                return;
            }
            tmp = prm.split(operator);
            if (tmp.length < 2) {
                throw ({ err: 'Invalid search parameters' });
                return;
            }
            tmp = [tmp[0], operator, tmp[1]];
            paramsArr.push(tmp);
        });
        const tmpStr = this.constructQueryObj(paramsArr, type);
        return tmpStr;
    }
    constructQueryObj(objArr, type) {
        const tmp = {};
        objArr.map((obj) => {
            const paramName = obj[0];
            const operator = obj[1];
            const val = obj[2];
            this.embedNestedObj(tmp, paramName, operator, val);
        });
        const explicitOp = this.explicitOpertorsMapping[this.explicitOpertors.indexOf(type)];
        const tmpObj = { selector: {} };
        tmpObj.selector[`${explicitOp}`] = this.putObjInArr(tmp);
        return JSON.stringify(tmpObj);
    }
    embedNestedObj(obj, paramNameStr, operator, value) {
        const nestedParams = paramNameStr.split('.');
        if (!obj[nestedParams[0]]) {
            obj[nestedParams[0]] = {};
        }
        if (nestedParams.length === 1) {
            const actualOp = this.operatorsMapping[this.operators.indexOf(operator)];
            obj[nestedParams[0]] = {};
            obj[nestedParams[0]][actualOp] = value;
            return;
        }
        this.embedNestedObj(obj[nestedParams[0]], nestedParams.splice(1, nestedParams.length).join('.'), operator, value);
    }
    putObjInArr(obj) {
        const keys = Object.keys(obj);
        const arr = [];
        for (const key of keys) {
            const tmp = {};
            tmp[`${key}`] = obj[key];
            arr.push(tmp);
        }
        return arr;
    }
    convertToJson(strJson) {
        let obj = strJson;
        try {
            obj = JSON.parse(strJson);
        }
        catch (e) {
            throw ({ errMsg: 'Invalid JSON Object', err: e });
            return;
        }
        return obj;
    }
}
exports.Trace = Trace;
//# sourceMappingURL=trace-chaincode.js.map