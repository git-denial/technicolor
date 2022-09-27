import DatabaseService from "../services/DatabaseService";
import Transaction, {PaymentState} from "../models/Transaction";


async function getAll() : Promise<Transaction[]> {
    let rows = await DatabaseService.query(`SELECT * FROM transactions`)
    return Transaction.getMulti(rows)
}

async function getById(id: number|string) : Promise<Transaction|null> {
    let rows = await DatabaseService.query(`SELECT * FROM transactions WHERE id = ?` , id)
    return Transaction.getSingle(rows)
}

async function getByUserId(userId: number|string) : Promise<Transaction[]> {
    let rows = await DatabaseService.query(`SELECT * FROM transactions WHERE requesting_user = ?`, userId)
    return Transaction.getMulti(rows)
}

async function create(transaction: Transaction) : Promise<Transaction> {

    if(transaction.order)
        delete transaction.order

    let result = await DatabaseService.query(`INSERT INTO transactions SET ?` , transaction)
    transaction.id = result.insertId
    return transaction
}

export async function update(id: number|string, transaction: Transaction|object) : Promise<any> {
    let rows = await DatabaseService.query(`UPDATE transactions SET ? WHERE id = ?`,[transaction,id])

    return rows.affectedRows === 1;
}

/**
 * This function updates the state, and fills some field accordingly based on the incoming paymentState
 * @param transactionId
 * @param paymentState
 * @param latestMidtransNotification
 * @returns number
 */
/*async function updateState(transactionId: string|number, paymentState: PaymentState, latestMidtransNotification: object) : Promise<number> {
    let midtransJson = JSON.stringify(latestMidtransNotification)
    let updateObject =<any> {
        payment_status: paymentState,
        latest_midtrans_notification: midtransJson,
    }
    if(paymentState === PaymentState.SETTLEMENT || paymentState === PaymentState.CAPTURE) {
        updateObject.paid_at = new Date()
    }
    if(paymentState === PaymentState.EXPIRE) {
        updateObject.expired_at = new Date()
    }

    let result = await DatabaseService.query(`UPDATE transactions SET ? WHERE id = ?`, [updateObject, transactionId])
    return result.affectedRows
}*/

export default {
    create,
    getByUserId,
    getById,
    getAll,
    update

}