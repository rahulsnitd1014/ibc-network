export class asn {
    public docType?: string;
    public poNumber: string;
    public asnXML: string;
    public asnJson: string;
    public advanceShipNotice: AdvanceShipNotice;
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

interface OrderDetail {
    PONum: string;
    PODate: string;
    ITNInternalOrderNum: string;
    VendorOrderNum: string;
    OrderBuyingPartyInfo: OrderBuyingPartyInfo;
    OrderVendorInfo: OrderVendorInfo;
    PalletDetail: PalletDetail;
}
interface OrderBuyingPartyInfo {
    OrderBuyingPartyID: string;
    OrderBuyingPartyName: string;
}

interface OrderVendorInfo {
    OrderVendorID: string;
    OrderVendorName: string;
}

interface PalletDetail {
    PalletLicensePlateNumber: string;
    PalletCaseQty: string;
    PalletGrossWeight: string;
    PalletGrossWeightUOM: string;
    PalletNetWeight: string;
    PalletNetWeightUOM: string;
    PalletType: string;
    PalletTierQty: string;
    PalletBlockQty: string;
    PalletUserID: string;
    ItemCaseDetail: ItemCaseDetail[];
}
interface ItemCaseDetail {
    ItemLineNum: string;
    UPCQualifier: string;
    UPCID: string;
    VendorItemNum: string;
    PurchaserItemNum: string;
    ItemDescription: string;
    ItemCountryOfOrigin: string;
    ItemShippedQty: string;
    ItemQuantityUOM: string;
    ItemGrossWeight: string;
    ItemGrossWeightUOM: string;
    ItemNetWeight: string;
    ItemNetWeightUOM: string;
    ItemAttributes: ItemAttributes;
    LotDetail: LotDetail;
}

interface ItemAttribute {
    _Key: string;
    __text: string;
}

interface ItemAttributes {
    ItemAttribute: ItemAttribute;
}

interface LotDetail {
    LotNum: string;
    LotQty: string;
    LotQtyUOM: string;
    LotManufactureDate: string;
}


interface HeaderAttributes {
    _Key: string;
    __text: string;
}
export { 
    AdvanceShipNotice,
  };