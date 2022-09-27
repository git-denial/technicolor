import ModelModes from "./ModelModes";
import hidash from "../utils/hidash";
import Order from "../models/Order"

export enum PaymentState {
    WAITING="WAITING",
    PAID="PAID",
    REJECTED="REJECTED",
    EXPIRED="EXPIRED",
    CONFIRMED="CONFIRMED"
}

interface ITransaction {
    id?: number
    requesting_user: number
    payment_proof_url?: string
    amount: number
    payment_status: PaymentState
    created_at?: Date
    paid_at?: Date
    expired_at?: Date
    order?: Order[]
}

export default class Transaction {
    id?: number
    requesting_user: number
    payment_proof_url?: string
    amount: number
    payment_status: PaymentState
    created_at?: Date
    paid_at?: Date
    expired_at?: Date
    order?: Order[]

    constructor(t: ITransaction, mode: ModelModes = ModelModes.READ) {
        this.id = t.id
        this.requesting_user = t.requesting_user

        this.payment_proof_url = t.payment_proof_url
        this.amount = mode === ModelModes.CREATE? 0 : t.amount
        this.payment_status = mode === ModelModes.CREATE? PaymentState.WAITING:t.payment_status

        this.order = t.order

        this.paid_at = t.paid_at? new Date(t.paid_at): undefined
        this.expired_at = mode === ModelModes.CREATE? new Date(new Date().setDate(new Date().getDate() + 1)): t.expired_at? new Date(t.expired_at): undefined
        this.created_at = mode === ModelModes.CREATE? new Date(): t.created_at? new Date(t.created_at) : undefined


        hidash.clean(this)
    }

    /*static prepareTransaction(
        midtransOrderId: string,
        requestingUser: number,
        orderId: number,
        snapPaymentUrl: string,
        amount: number,
        realm: Realm,
        createdAt: Date,
        shouldExpireAt: Date
    ) : Transaction {
        return new Transaction({
            midtrans_order_id: midtransOrderId,
            requesting_user: requestingUser,
            order_id: orderId,
            payment_proof_url: snapPaymentUrl,
            amount: amount,
            realm: realm,
            created_at: createdAt,
            should_expire_at: shouldExpireAt,
            payment_status: PaymentState.WAITING_NOTIFICATION
        })
    }*/

    static getSingle(rows: any[]) : Transaction|null {
        if(rows.length === 0) {
            return null
        } else {
            return new Transaction(rows[0])
        }
    }

    static getMulti(rows: any) : Transaction[] {
        return rows.map((el:any)=>new Transaction(el))
    }


}