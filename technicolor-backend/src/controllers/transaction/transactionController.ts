import {NextFunction, Request, Response} from "express";
import {
    BadRequestError,
    EntityNotFoundError,
    InternalServerError,
    UnauthorizedError
} from "../../errors/RequestErrorCollection";
import Transaction, {PaymentState} from "../../models/Transaction";
import TransactionDAO from "../../daos/TransactionDAO";
import UserDAO from "../../daos/UserDAO";
import Order from "../../models/Order"
import OrderDAO from "../../daos/OrderDAO";
import ModelModes from "../../models/ModelModes";
import OrderLine from "../../models/OrderLine";
import OrderLineDAO from "../../daos/OrderLineDAO";
import Product from "../../models/Product";
import * as ProductDAO from "../../daos/ProductDAO";
import crypto from "../../utils/crypto";
import VendorDAO from "../../daos/VendorDAO";
import FormData from "form-data";
import fetch from "node-fetch";
import logger from "../../utils/logger";
import EmailService from "../../services/EmailService";
import EmailScenario from "../../services/EmailScenario";
import hidash from "../../utils/hidash";


/*export async function listenMidtransNotification(req: Request, res: Response, next: NextFunction) {

    let mNotification = req.body
    let grossAmount = mNotification.gross_amount
    let statusCode = mNotification.status_code
    let midtransOrderId = mNotification.order_id
    let serverKey = "abcd"//process.env.MIDTRANS_SERVER_KEY
    let rawSignature = midtransOrderId + statusCode + grossAmount + serverKey
    let processedSignature = crypto.hashSHA512(rawSignature)

    let challengeSignature = mNotification.signature_key

    if(challengeSignature !== processedSignature) {
        logger.log("Signature mismatch. Midtrans VS Intellivent")
        logger.log(challengeSignature)
        logger.log(processedSignature)
        logger.log(`Midtrans Order ID: ${midtransOrderId}`)
        logger.log(`Status Code: ${statusCode}`)
        logger.log(`Gross Amt: ${grossAmount}`)
        logger.log(`Server Key: ${serverKey}`)
        return next(new UnauthorizedError("COMPARISON_FAILED", "COMPARISON_FAILED"))
    }

    let statusString = <string> mNotification.transaction_status



    let maybePaymentState : PaymentState | undefined = (<any>PaymentState)[statusString.toUpperCase()];
    if(!maybePaymentState) {
        return next(new HandledInternalServerError(`Failed to enumerize payment state: ${statusString}`))
    }

    logger.log(`Incoming Midtrans Status: ${statusString} | ${maybePaymentState} - ${midtransOrderId}`)

    try {
        let transaction = await TransactionDAO.getByMidtransOrderId(midtransOrderId)
        if(!transaction || !transaction.order_id || !transaction.id) {
            return next(new EntityNotFoundError("transaction", midtransOrderId))
        }

        let context : OrderContext|null = await orderTools.generateOrderContextFromOrderId(transaction.order_id)
        if(!context) {
            return next(new EntityNotFoundError("context_by_order_id", transaction.order_id))
        }

        //update transactions
        let affectedRows = await TransactionDAO.updateState(transaction.id, maybePaymentState, mNotification)

        if(affectedRows === 0) {
            return next(new EntityNotFoundError("transaction", transaction.id))
        }

        //update order
        if(maybePaymentState === PaymentState.SETTLEMENT || maybePaymentState === PaymentState.CAPTURE) {
            //if settlement/capture, update order status
            await OrderDAO.updateTransactionStatus(<number>context.order.id, OrderTransactionState.PAID)

            let emailTemplate = await EmailTemplateDAO.getByName(DefaultTemplates.DEFAULT_PAYMENT_ACCEPTED)
            if(!emailTemplate) {
                logger.error(`Email template with name ${DefaultTemplates.DEFAULT_PAYMENT_ACCEPTED} not found! Please check!`)
            } else {
                let {body,subject} = EmailService.replaceBodyAndSubject(context, emailTemplate)
                EmailService.sendEmailAsync(context.user.email, subject, body)
                    .catch(err=>logger.error(err))
            }

        }

        res.send({success:true})

    } catch(e) {
        logger.error(e)
        return next(e)
    }


}*/

export async function create(req: Request, res: Response, next: NextFunction) {

    let orders = req.body.order
    let new_orders = []
    let newTransaction = new Transaction({...req.body, requesting_user:req.decoded.user_id},ModelModes.CREATE)

    if(!newTransaction.requesting_user)
        return next(new BadRequestError("requeting user for new transaction is missing", "MISSING_INFO"))

    try {

        if(!(await UserDAO.getById(newTransaction.requesting_user)))
            return next(new EntityNotFoundError("User", newTransaction.requesting_user))

        if(!orders || orders.length === 0)
            return next(new BadRequestError("Order is missing from new transaction", "MISSING_INFO"))

        for(let o of orders){

            o = hidash.checkProperty(o,"Order","vendor_id","city_code","delivery_method","delivery_fee", "delivery_service")

            o = new Order({
                ...o,
                code: crypto.generateGUID(),
                delivery_service:o.delivery_service,
                user_id: req.decoded.user_id,
            },ModelModes.CREATE)

            if(o.error_message){
                return next(o)
            }

            try {

                let vendor = await VendorDAO.getById(o.vendor_id);
                let total_weight = 0;

                if(!vendor)
                    return next(new EntityNotFoundError("Vendor", o.vendor_id))
                if(!o.order_lines || o.order_lines.length === 0)
                    return next(new BadRequestError("Order lines is missing from new orders", "MISSING_INFO"))

                let order_lines = o.order_lines
                let new_order_lines = []

                for(let ol of order_lines){

                    ol = hidash.checkProperty(ol,"Order_line","product_id","quantity")

                    if(ol.error_message){
                        return next(ol)
                    }

                    ol = new OrderLine(ol, ModelModes.CREATE)
                    let product = await ProductDAO.getById(ol.product_id)

                    if(!product)
                        return next(new EntityNotFoundError("Product", ol.product_id))


                    ol.price =  product.price
                    o.price_sum += (product.price * ol.quantity)
                    total_weight += (product.weight * ol.quantity)

                    new_order_lines.push(ol)
                }


                let formData = new FormData()
                formData.append("key", process.env.PREMIUM_RAJA_ONGKIR_KEY)
                formData.append("origin", vendor.city_code + "")
                formData.append("originType", "city")
                formData.append("destination", o.city_code + "")
                formData.append("destinationType", "city")
                formData.append("weight", total_weight + "")
                formData.append("courier", o.delivery_method)

                let response = await fetch(`https://pro.rajaongkir.com/api/cost`, {
                    headers: formData.getHeaders(),
                    method: 'POST',
                    body: <any>formData
                });
                let result

                //TODO: For now if calculation failed (out of quota or such), proceed with delivery_fee from client side.
                if (!response.ok) {
                    result = await response.text()
                    logger.error(result)
                    return next(new Error("Request to third-party failed."))
                } else {
                    result = await response.json()
                }

                if (result.rajaongkir.results[0].costs.length === 0) {
                    return next(new Error("Request to third-party failed."))
                }

                console.log(result)

                //Wibi: TODO: what? wkwkwk ntar pikirin cara validation/fetch data yg benernya. kalo bisa delivery fee udah gak minta user lagi.
                let price = result?.rajaongkir?.results[0]?.costs.find((r: any)=>r.service === o.delivery_service)
                price = price.cost[0].value

                if(!price) {
                    return next(new Error("Request to third-party failed."))
                }
                o.delivery_fee = price

                newTransaction.amount += o.price_sum + o.delivery_fee
                o.order_lines = new_order_lines
                new_orders.push(o)

            } catch(err) {
                return next(new InternalServerError(err))
            }

        }


        newTransaction = await TransactionDAO.create(newTransaction);
        for (let o of new_orders) {

            o.transaction_id = newTransaction.id

            let new_order_lines = o.order_lines
            o = await OrderDAO.create(o);

            if (!o.id)
                return next( new Error())
            if (!new_order_lines) {
                return next( new Error())
            }

            for (let ol of new_order_lines) {

                ol.order_id = o.id
                ol = await OrderLineDAO.create(ol)

            }
        }
        return res.send(newTransaction)

    } catch(err) {
        return next(new InternalServerError(err))
    }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {

    try {
        let transactions: any = await TransactionDAO.getAll()

        for (let t of transactions) {

            if (!t.requesting_user) {
                throw new Error("No user_id in a transaction")
            }

            t.user = await UserDAO.getById(t.requesting_user)
        }

        res.send(transactions)
    } catch (e) {
        next(new InternalServerError(e))
    }

}

export async function getById(req: Request, res: Response, next: NextFunction) {

    let transactionId = req.params.transaction_id
    try {
        let transaction = await TransactionDAO.getById(transactionId)

        if (!transaction) {
            return next(new EntityNotFoundError("Transaction", transactionId))
        }

        if(req.decoded.user_id && transaction.requesting_user !== req.decoded.user_id){
            return next(new UnauthorizedError("You are not authorized to view this transaction"))
        }
        if(req.decoded.vendor_id){
            let orders = await OrderDAO.getAllByTransactionIdAndVendorId(transactionId,req.decoded.vendor_id)

            if(orders.length === 0)
                return next(new UnauthorizedError("You are not authorized to view this transaction"))
        }

        return res.send(transaction)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function getByUserId(req: Request, res: Response, next: NextFunction) {

    let userId = req.decoded.user_id || req.params.user_id
    try {
        let transactions = await TransactionDAO.getByUserId(userId)

        if (!transactions) {
            return next(new EntityNotFoundError("Transaction with user_id ", userId))
        }

        if(req.decoded.vendor_id) {

            for(let i=0; i<transactions.length; i++){
                let orders = await OrderDAO.getAllByTransactionIdAndVendorId(<number>transactions[i].id, req.decoded.vendor_id)

                if (orders.length === 0) {
                    transactions.splice(i,1)
                    i--;
                }
            }

        }

        return res.send(transactions)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function getByVendorId(req: Request, res: Response, next: NextFunction) {

    let vendorId = req.decoded.vendor_id
    try {
        let orders = await OrderDAO.getAllByVendorId(vendorId)
        let transactions: any[] = [];

        orders = orders.filter((v, i, a) => a.findIndex(t => (t.transaction_id === v.transaction_id)) === i)//find unique transaction_id

        for (let o of orders) {

            if (!o.transaction_id)
                continue;

            let transaction: any = await TransactionDAO.getById(o.transaction_id)
            transaction.user = await UserDAO.getById(transaction.requesting_user)

            transactions.push(transaction)
        }

        return res.send(transactions)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {

    let transactionId = req.params.transaction_id
    let transaction = await TransactionDAO.getById(transactionId)
    let updatedTransaction = new Transaction({...transaction, ...req.body}, ModelModes.UPDATE)

    try {

        let result = await TransactionDAO.update(transactionId, updatedTransaction)

        if (result) {

            if(updatedTransaction.payment_status == PaymentState.REJECTED){

                let orders = await OrderDAO.getAllByTransactionId(transactionId)
                let user = await UserDAO.getById(updatedTransaction.requesting_user)
                let {subject,body,config} = await EmailScenario.transaction_rejected(orders)

                if(user){
                    await EmailService.sendEmailAsync(user.email,subject,body,config)
                }
            }

            res.send({success: true})
        } else {
            return next(new EntityNotFoundError("Transaction", transactionId))
        }
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function confirm(req: Request, res: Response, next: NextFunction) {

    let transactionId = req.params.transaction_id
    let updatedTransaction = {payment_status: PaymentState.CONFIRMED}

    try {

        let transaction = await TransactionDAO.getById(transactionId)

        if (!transaction)
            return next(new EntityNotFoundError("Transaction", transactionId))

        let result = await TransactionDAO.update(transactionId, updatedTransaction)

        if (result) {

            let orders = await OrderDAO.getAllByTransactionId(transactionId)
            let user = await UserDAO.getById(transaction.requesting_user)

            if(!user)
                return next(new EntityNotFoundError("User", transaction.requesting_user))

            for (let o of orders) {

                let vendor = await VendorDAO.getById(o.vendor_id)

                if (vendor) {
                    let email_content = await EmailScenario.transaction_approved_for_vendor(o, transaction, user)
                    await EmailService.sendEmailAsync(vendor.email, email_content.subject, email_content.body, email_content.config)
                }

            }
            let email_content = await EmailScenario.transaction_approved_for_user()
            await EmailService.sendEmailAsync(user.email, email_content.subject, email_content.body, email_content.config)

            res.send({success: true})

        } else {
            return next(new EntityNotFoundError("Transaction", transactionId))
        }
    } catch (e) {
        next(new InternalServerError(e))
    }
}



export default {
    create,
    update,
    getAll,
    getById,
    getByUserId,
    getByVendorId,
    confirm
}
