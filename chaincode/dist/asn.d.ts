export declare class asn {
    docType?: string;
    poNumber: string;
    asnXML: string;
    asnJson: string;
    advanceShipNotice: AdvanceShipNotice;
}
interface FileHeader {
    ISASenderID: string;
    GSSenderID: string;
    DocumentCode: string;
}
interface AdvanceShipNotice {
    FileHeader: FileHeader;
    Header: Header;
    Footer: Footer;
}
interface Footer {
    TotalLineItemNum: string;
}
interface Header {
    HeaderRecordShipmentInfo: HeaderRecordShipmentInfo;
    HeaderAttributes: HeaderAttributes[];
}
interface HeaderRecordShipmentInfo {
    HdrPurposeCode: string;
    ShipmentID: string;
    TransactionDate: string;
    TransactionTime: string;
    LadingQty: string;
    NetWeight: string;
    NetWeightUOM: string;
    GrossWeight: string;
    GrossWeightUOM: string;
    TransportationMethod: string;
    ActualShippedDate: string;
    HDRShipToLocationInfo: HDRShipToLocationInfo;
    HDRShipFromLocationInfo: HDRShipFromLocationInfo;
    HDRCarrierInfo: HDRCarrierInfo;
}
interface HDRShipToLocationInfo {
    HDRShipToLocationName: string;
    HDRShipToLocationID: string;
    HDRShipToLocationAddress1: string;
    HDRShipToLocationCity: string;
    HDRShipToLocationState: string;
    HDRShipToLocationCountry: string;
}
interface HDRShipFromLocationInfo {
    HDRShipFromLocationID: string;
    HDRShipFromLocationName: string;
}
interface HDRCarrierInfo {
    HDRCarrierID: string;
}
interface HeaderAttributes {
    _Key: string;
    __text: string;
}
export { AdvanceShipNotice, };
