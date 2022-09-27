import ModelModes from "./ModelModes";
import hidash from "../utils/hidash";
import OrderLine from "./OrderLine";
import OrderLineDAO from "../daos/OrderLineDAO";

export enum delivery_method {
    JNE="JNE",
    JNT="JNT",
    POS = "POS",
    TIKI="TIKI",
    SICEPAT="SICEPAT",
    LION="LION",
    NINJA="NINJA",
    WAHANA="WAHANA",
    PANDU="PANDU",
    PAHALA="PAHALA",
    CAHAYA="CAHAYA",
    SLIS = "SLIS",
    FIRST = "FIRST",
    INDAH="INDAH",
    STAR = "STAR",
    ESL="ESL",
    PCP="PCP",
    REX="REX",
    RPX="RPX",
    SAP="SAP",
    JET="JET",
    IDE="IDE",
    IDL="IDL",
    DSE="DSE",
    NCS="NCS",
}

export enum ShipmentState {
    WAITING_CONFIRMATION="WAITING_CONFIRMATION",
    PROCESSING="PROCESSING",
    DELIVERING="DELIVERING",
    ARRIVED="ARRIVED"
}

export interface IOrder {
    id?:number
    code:string
    user_id:number
    vendor_id:number
    paid_at?: Date
    shipment_status: ShipmentState
    address_info: string
    city_code:string
    zip_code:string
    transaction_id?: number
    price_sum: number
    delivery_fee?: number
    delivery_method: delivery_method
    delivery_service:string
    delivery_receipt?: string
    created_at?: Date
    modified_at?: Date
    order_lines?:OrderLine[]
}

export default class Order {
    id?:number
    code:string
    user_id:number
    vendor_id:number
    paid_at?: Date
    shipment_status: ShipmentState
    address_info: string
    city_code:string
    zip_code:string
    transaction_id?: number
    price_sum: number
    delivery_fee?: number
    delivery_method: delivery_method
    delivery_service:string
    delivery_receipt?: string
    created_at?: Date
    modified_at?: Date
    order_lines?:OrderLine[]

    constructor(order : IOrder, mode: ModelModes = ModelModes.READ) {
        this.id = order.id
        this.user_id = order.user_id
        this.vendor_id = order.vendor_id
        this.transaction_id = order.transaction_id
        this.code = order.code

        this.shipment_status = mode === ModelModes.CREATE? ShipmentState.WAITING_CONFIRMATION : order.shipment_status
        this.city_code = order.city_code
        this.zip_code = order.zip_code
        this.address_info = order.address_info
        this.transaction_id = order.transaction_id
        this.price_sum = mode === ModelModes.CREATE? 0 : order.price_sum
        this.delivery_method = order.delivery_method
        this.delivery_fee = order.delivery_fee
        this.delivery_receipt = order.delivery_receipt
        this.delivery_service = order.delivery_service

        this.order_lines = order.order_lines

        this.paid_at = order.paid_at? new Date(order.paid_at): undefined
        this.created_at = mode === ModelModes.CREATE? new Date() : order.created_at
        this.modified_at = mode === ModelModes.UPDATE? new Date() : order.modified_at

        hidash.clean(this)
    }

    static getOrders(rows: any[]) : Order[] {
        return rows.map(r=>new Order(r))
    }

    static getSingleOrder(rows: any[]) : Order|null {
        if(rows.length === 0) {
            return null
        } else {
            return new Order(rows[0])
        }
    }

    async get_order_lines(): Promise<OrderLine[]>{
        return await OrderLineDAO.getByOrderId(<number>this.id)
    }
}

