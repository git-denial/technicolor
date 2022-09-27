/*
import moment from "moment";
import OrderContext from "../../models/OrderContext";
import crypto from "../../utils/crypto";
import ProductDAO from "../../daos/ProductDAO";
import {EntityNotFoundError, HandledInternalServerError} from "../../errors/RequestErrorCollection";
import Transaction, {Realm} from "../../models/Transaction";
import MidtransClient from "midtrans-client"
import TransactionDAO from "../../daos/TransactionDAO";
import logger from "../../utils/logger";


export const midtransCompliantDateStringGenerator = (date: Date) => {
    let dateStr = moment(date).format("YYYY-MM-DD HH:mm:ss Z")

    let dateStrTokens = dateStr.split(" ")
    dateStrTokens[2] = dateStrTokens[2].split(":").join("")
    let dateStrProcessed = dateStrTokens.join(" ")
    return dateStrProcessed
}

interface MidtransItemDetail {
    id: string,
    price: number,
    quantity: number,
    name: string
}

export async function createNewMidtransTransaction (context : OrderContext) {
    let midtransOrderId = `am-merch-${Date.now()}${crypto.generateRandomStringWithLength(3).toLowerCase()}`
    let requestingMemberId = <number> context.user.id
    let orderId = <number> context.order.id

    let itemDetails : MidtransItemDetail[] = []

    itemDetails.push({
        id: "ongkir",
        price: <number>context.order.delivery_fee,
        quantity: 1,
        name: "Biaya pengiriman"
    })

    for(let orderLine of context.order_lines) {
        let product = await ProductDAO.getById(orderLine.product_id)
        if(!product) {
            throw new EntityNotFoundError("product", orderLine.product_id)
        }
        itemDetails.push({
            id: (product.id+"").substring(0,49),
            price: product.price,
            quantity: orderLine.quantity,
            name: product.name.substring(0,49)
        })
    }



    //let ids = itemDetails.reduce((acc,curr) =>acc+curr.price , 0)
    //logger.log(itemDetails)
    //logger.log(`ItemDetail sum: ${ids}` )
    //logger.log(`Order price sum: ${context.order.price_sum}`)

    let createdAt = new Date()
    let paymentDurationHrs = process.env.PAYMENT_DURATION_HRS ?? "24"
    let shouldExpireAtLong = new Date().getTime() + 1000 * 60 * 60 * parseInt(paymentDurationHrs)
    let shouldExpireAt = new Date(shouldExpireAtLong)

    let programMode = process.env.MODE
    let isProduction = programMode === "PRODUCTION"
    let realm = isProduction ? Realm.PRODUCTION : Realm.SANDBOX

    let requestData = {
        transaction_details: {
            order_id: midtransOrderId,
            gross_amount: context.order.price_sum + (context.order.delivery_fee ?? 0)
        },
        credit_card: {
            secure:true
        },
        item_details:itemDetails,
        expiry: {
            start_time: midtransCompliantDateStringGenerator(createdAt),
            unit: "hour",
            duration: paymentDurationHrs
        }
    }

    let serverKey = process.env.MIDTRANS_SERVER_KEY,
        clientKey = process.env.MIDTRANS_CLIENT_KEY

    if(!serverKey || !clientKey) {
        throw new HandledInternalServerError("Cannot access third party service!")
    }

    let snap = new MidtransClient.Snap({
        isProduction: isProduction,
        serverKey: serverKey,
        clientKey: clientKey
    })

    let midtransResponse = await snap.createTransaction(requestData)
    let snapUrl = <string> midtransResponse.redirect_url

    let transaction = Transaction.prepareTransaction(
        midtransOrderId,
        requestingMemberId,
        orderId,
        snapUrl,
        context.order.price_sum + ( context?.order?.delivery_fee ?? 0 ),
        realm,
        createdAt,
        shouldExpireAt
    )

    let newTransaction = await TransactionDAO.create(transaction)

    return new OrderContext(context.user, context.order, context.order_lines, newTransaction)

}

export default {
    createNewMidtransTransaction
}*/
