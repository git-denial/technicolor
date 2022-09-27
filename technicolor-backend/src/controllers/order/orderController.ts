import {NextFunction, Request, Response} from "express";
import {
    BadRequestError,
    EntityNotFoundError,
    InternalServerError,
    UnauthorizedError
} from "../../errors/RequestErrorCollection";

import crypto from "../../utils/crypto";

// @ts-ignore
import FormData from "form-data"
import logger from "../../utils/logger";
// @ts-ignore
import fetch from "node-fetch"
import ModelModes from "../../models/ModelModes";
import Order, {ShipmentState} from "../../models/Order";
import OrderDAO from "../../daos/OrderDAO";
import OrderLineDAO from "../../daos/OrderLineDAO";
import UserDAO from "../../daos/UserDAO";
import VendorDAO from "../../daos/VendorDAO";
import TransactionDAO from "../../daos/TransactionDAO";
import EmailScenario from "../../services/EmailScenario";
import EmailService from "../../services/EmailService";
import hidash from "../../utils/hidash";


async function getAll(req:Request, res:Response,next:NextFunction){
    try{
        let result:any = await OrderDAO.getAll();

        for(let o of result){

            if(o.user_id)
                o.user = await UserDAO.getById(o.user_id)

            if(o.vendor_id)
                o.vendor = await VendorDAO.getById(o.vendor_id)
        }
        res.send(result);    
    }
    catch(e){
        next(new InternalServerError(e))
    }
    
}

async function getById(req:Request, res:Response, next:NextFunction){

    try {
        let order = await OrderDAO.getById(req.params.id)
        if(!order) {
            return next(new EntityNotFoundError("Order", req.params.id))
        }
        return res.send(order)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

async function getAllByUserId(req:Request, res:Response, next:NextFunction){

    try {
        let userId = req.decoded.user_id?req.decoded.user_id: req.body.user_id
        let orders:any = await OrderDAO.getAllByUserId(userId)
        
        if(!orders) {
            return next(new EntityNotFoundError("Order with user_id ", userId))
        }

        for(let order of orders) {
            if(!order.id) {
                return next(new Error("Missing ID from order!" ))
            }
            let orderLines = await OrderLineDAO.getByOrderId(order.id)
            order.order_lines = orderLines

            if(order.vendor_id)
                order.vendor = await VendorDAO.getById(order.vendor_id)

            if(order.transaction_id)
                order.transaction = await TransactionDAO.getById(order.transaction_id)
        }

        return res.send(orders)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

async function getAllByVendorId(req:Request, res:Response, next:NextFunction){

    try {
        let vendorId = req.decoded.vendor_id?req.decoded.vendor_id: req.params.id
        let orders:any = await OrderDAO.getAllByVendorId(vendorId)

        if(!orders) {
            return next(new EntityNotFoundError("Order with vendor_id ", vendorId))
        }

        for(let order of orders) {
            if(!order.id) {
                return next(new Error("Missing ID from order!" ))
            }
            let orderLines = await OrderLineDAO.getByOrderId(order.id)
            order.order_lines = orderLines

            if(order.user_id)
                order.user = await UserDAO.getById(order.user_id)

        }

        return res.send(orders)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

async function getAllByTransactionId(req:Request, res:Response, next:NextFunction){

    try {
        let transactionId = req.params.id
        let transaction = await TransactionDAO.getById(transactionId)

        if(!transaction){
            return next(new EntityNotFoundError("Transaction", transactionId))
        }

        if(req.decoded.user_id){
            if(transaction.requesting_user !== req.decoded.user_id)
                return next(new UnauthorizedError("You are not authorized to view these orders"))
        }


        let orders:any = await OrderDAO.getAllByTransactionId(transactionId)

        if(!orders) {
            return next(new EntityNotFoundError("Order with transaction_id ", transactionId))
        }

        for(let order of orders) {
            if(!order.id) {
                return next(new Error("Missing ID from order!" ))
            }

            if(req.decoded.vendor_id && order.vendor_id !== req.decoded.vendor_id){
                return next(new UnauthorizedError("You are not authorized to view these orders"))
            }

            let orderLines = await OrderLineDAO.getByOrderId(order.id)
            order.order_lines = orderLines

            if(order.user_id)
                order.user = await UserDAO.getById(order.user_id)

            if(order.vendor_id)
                order.vendor = await VendorDAO.getById(order.vendor_id)
        }


        return res.send(orders)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {

    let orderId = req.params.id
    let updatedOrder = new Order(req.body, ModelModes.UPDATE)

    try {

        if( updatedOrder.vendor_id && !(await VendorDAO.getById(updatedOrder.vendor_id)) ){
            return next(new EntityNotFoundError("Vendor", updatedOrder.vendor_id))
        }

        if( updatedOrder.user_id && !(await UserDAO.getById(updatedOrder.user_id)) ){
            return next(new EntityNotFoundError("User", updatedOrder.vendor_id))
        }

        if( updatedOrder.transaction_id && !(await TransactionDAO.getById(updatedOrder.transaction_id)) ){
            return next(new EntityNotFoundError("Transaction", updatedOrder.transaction_id))
        }

        let result = await OrderDAO.update(orderId, updatedOrder)

        if(result) {
            res.send({success: true})
        } else {
            return next(new EntityNotFoundError("Order", orderId))
        }
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function processing(req: Request, res: Response, next: NextFunction) {

    let orderId = req.params.id
    let vendorId = req.decoded.vendor_id


    try {

        let order = await OrderDAO.getById(orderId)

        if(!order){
            return next(new EntityNotFoundError("order", orderId))
        }
        if(order?.vendor_id !== vendorId){
            return next(new UnauthorizedError("You are not authorized to change the status of this order"))
        }


        let updatedOrder = new Order({...order, shipment_status:ShipmentState.PROCESSING}, ModelModes.UPDATE)

        let result = await OrderDAO.update(orderId, updatedOrder)

        if(result) {
            res.send({success: true})
        } else {
            return next(new EntityNotFoundError("Order", orderId))
        }
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function delivering(req: Request, res: Response, next: NextFunction) {

    let orderId = req.params.id
    let vendorId = req.decoded.vendor_id
    let no_resi = req.body.no_resi

    if(!no_resi)
        return next(new BadRequestError("Delivery_receipt is missing!"))

    try {

        let order = await OrderDAO.getById(orderId)

        if(!order){
            return next(new EntityNotFoundError("order", orderId))
        }
        if(order?.vendor_id !== vendorId){
            return next(new UnauthorizedError("You are not authorized to change the status of this order"))
        }


        let updatedOrder = new Order({...order, shipment_status:ShipmentState.DELIVERING, delivery_receipt:no_resi}, ModelModes.UPDATE)


        let result = await OrderDAO.update(orderId, updatedOrder)

        if(result) {

            let {subject,body,config} = EmailScenario.order_delivering(updatedOrder)
            let user = await UserDAO.getById(order.user_id)

            if(user){
                await EmailService.sendEmailAsync(user.email, subject,body, config)
            }

            res.send({success: true})
        } else {
            return next(new EntityNotFoundError("Order", orderId))
        }
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function create(req:Request, res:Response, next: NextFunction) {

    let newOrder:any = new Order({
        code: crypto.generateGUID(),
        user_id: req.decoded.user_id,
        shipment_status: ShipmentState.WAITING_CONFIRMATION,
delivery_service:"haha",
        transaction_id:req.body.transaction_id,
        vendor_id:req.body.vendor_id,
        address_info: req.body.address_info,
        city_code:req.body.city_code,
        zip_code:req.body.zip_code,
        price_sum: req.body.price_sum,
        delivery_method: req.body.delivery_method,
        delivery_fee:req.body.delivery_fee
        
    }, ModelModes.CREATE)

    newOrder = hidash.checkProperty(newOrder, "Order","vendor_id","city_code","delivery_method","delivery_fee")

    if(newOrder.error_message){
        return next(newOrder)
    }

    

    try {

        if(!(await VendorDAO.getById(newOrder.vendor_id)))
            return next(new EntityNotFoundError("Vendor", newOrder.vendor_id))
        
        if(!(await UserDAO.getById(newOrder.user_id)))
            return next(new EntityNotFoundError("User", newOrder.user_id))

        if(!(await TransactionDAO.getById(newOrder.transaction_id)))
            return next(new EntityNotFoundError("Transaction", newOrder.transaction_id))

        let deliveryDestinationId = 152; //Wibi: TODO: Hardcoded. 152 (city) is DKI Jakarta, Jakarta Pusat for rajaongkir
        let formData = new FormData()
        formData.append("key", process.env.RAJA_ONGKIR_KEY)
        formData.append("origin", newOrder.city_code+"")
        formData.append("destination", deliveryDestinationId+"")
        formData.append("weight", 1000+"")
        formData.append("courier", newOrder.delivery_method)

        let response = await fetch(`https://api.rajaongkir.com/starter/cost?key=${process.env.RAJA_ONGKIR_KEY}`, {
            headers: formData.getHeaders(),
            method: 'POST',
            body: <any>formData
        });
        let result

        //TODO: For now if calculation failed (out of quota or such), proceed with delivery_fee from client side.
        if(!response.ok) {
            result = await response.text()
            logger.error(result)
            throw new Error("Request to third-party failed.")
        } else {
            result = await response.json()
        }

        logger.log(result)

        if(result.rajaongkir.results[0].costs.length === 0){
            throw new Error("Request to third-party failed.")
        }

        //Wibi: TODO: what? wkwkwk ntar pikirin cara validation/fetch data yg benernya. kalo bisa delivery fee udah gak minta user lagi.
        newOrder.delivery_fee = result?.rajaongkir?.results[0]?.costs[0]?.cost[0]?.value ?? newOrder.delivery_fee


        let order = await OrderDAO.create(newOrder);
        return res.send(order)

    } catch(err) {
        return next(new InternalServerError(err))
    }

}

export default {
    create,
    update,
    getAll,
    getById,
    getAllByUserId,
    getAllByVendorId,
    getAllByTransactionId,
    processing,
    delivering
}


/*async function setOrderToDelivered(req:Request,res:Response, next: NextFunction){
    let orderId = req.params.id
    let deliveryReceipt = req.body.delivery_receipt
    try {

        let context = await orderTools.generateOrderContextFromOrderId(orderId)
        let order = context?.order
        if(!context || !order) {
            throw new EntityNotFoundError("order", orderId)
        }
        order.shipment_status = ShipmentState.DELIVERING
        order.delivery_receipt = deliveryReceipt

        let updatedOrder = new Order({
            code: order.code,
            user_id: order.user_id,
            transaction_status: order.transaction_status,
            shipment_status: order.shipment_status,
            address_info: order.address_info,
            price_sum: order.price_sum,
            delivery_method: order.delivery_method,
            delivery_fee: order.delivery_fee,
            delivery_receipt: order.delivery_receipt
        }, ModelModes.UPDATE)

        await OrderDAO.update(orderId, updatedOrder)

        let emailTemplate = await EmailTemplateDAO.getByName(DefaultTemplates.DEFAULT_DELIVERY)
        if(!emailTemplate) {
            throw new EntityNotFoundError("email_template", DefaultTemplates.DEFAULT_DELIVERY)
        }

        let {body,subject} = EmailService.replaceBodyAndSubject(context, emailTemplate)

        EmailService.sendEmailAsync(context.user.email, subject, body)
            .catch(err=> logger.error(err))


        res.send({success:true})

    }  catch (e) {
        logger.error(e)
        return next(e)
    }

}

async function setOrderToArrive(req:Request,res:Response, next: NextFunction){
    let orderId = req.params.id
    let deliveryReceipt = req.body.delivery_receipt
    try {

        let context = await orderTools.generateOrderContextFromOrderId(orderId)
        let order = context?.order
        if(!context || !order) {
            throw new EntityNotFoundError("order", orderId)
        }
        order.shipment_status = ShipmentState.ARRIVED
        order.delivery_receipt = deliveryReceipt

        let updatedOrder = new Order({
            code: order.code,
            user_id: order.user_id,
            transaction_status: order.transaction_status,
            shipment_status: order.shipment_status,
            address_info: order.address_info,
            price_sum: order.price_sum,
            delivery_method: order.delivery_method,
            delivery_fee: order.delivery_fee,
            delivery_receipt: order.delivery_receipt
        }, ModelModes.UPDATE)

        await OrderDAO.update(orderId, updatedOrder)

        let emailTemplate = await EmailTemplateDAO.getByName(DefaultTemplates.DEFAULT_ARRIVAL)
        if(!emailTemplate) {
            throw new EntityNotFoundError("email_template", DefaultTemplates.DEFAULT_ARRIVAL)
        }

        let {body,subject} = EmailService.replaceBodyAndSubject(context, emailTemplate)

        EmailService.sendEmailAsync(context.user.email, subject, body)
            .catch(err=> logger.error(err))


        res.send({success:true})

    }  catch (e) {
        logger.error(e)
        return next(e)
    }

}

async function setOrderToWait(req:Request,res:Response, next: NextFunction){
    let orderId = req.params.id
    let deliveryReceipt = req.body.delivery_receipt
    try {

        let context = await orderTools.generateOrderContextFromOrderId(orderId)
        let order = context?.order
        if(!context || !order) {
            throw new EntityNotFoundError("order", orderId)
        }
        order.shipment_status = ShipmentState.WAITING
        order.delivery_receipt = deliveryReceipt

        let updatedOrder = new Order({
            code: order.code,
            user_id: order.user_id,
            transaction_status: order.transaction_status,
            shipment_status: order.shipment_status,
            address_info: order.address_info,
            price_sum: order.price_sum,
            delivery_method: order.delivery_method,
            delivery_fee: order.delivery_fee,
            delivery_receipt: order.delivery_receipt
        }, ModelModes.UPDATE)

        await OrderDAO.update(orderId, updatedOrder)

        let emailTemplate = await EmailTemplateDAO.getByName(DefaultTemplates.DEFAULT_WAITING_PAYMENT)
        if(!emailTemplate) {
            throw new EntityNotFoundError("email_template", DefaultTemplates.DEFAULT_WAITING_PAYMENT)
        }

        let {body,subject} = EmailService.replaceBodyAndSubject(context, emailTemplate)

        EmailService.sendEmailAsync(context.user.email, subject, body)
            .catch(err=> logger.error(err))


        res.send({success:true})

    }  catch (e) {
        logger.error(e)
        return next(e)
    }

}

async function setOrderToPack(req:Request,res:Response, next: NextFunction){
    let orderId = req.params.id
    let deliveryReceipt = req.body.delivery_receipt
    try {

        let context = await orderTools.generateOrderContextFromOrderId(orderId)
        let order = context?.order
        if(!context || !order) {
            throw new EntityNotFoundError("order", orderId)
        }
        order.shipment_status = ShipmentState.PACKING
        order.delivery_receipt = deliveryReceipt

        let updatedOrder = new Order({
            code: order.code,
            user_id: order.user_id,
            transaction_status: order.transaction_status,
            shipment_status: order.shipment_status,
            address_info: order.address_info,
            price_sum: order.price_sum,
            delivery_method: order.delivery_method,
            delivery_fee: order.delivery_fee,
            delivery_receipt: order.delivery_receipt
        }, ModelModes.UPDATE)

        await OrderDAO.update(orderId, updatedOrder)

        let emailTemplate = await EmailTemplateDAO.getByName(DefaultTemplates.DEFAULT_PAYMENT_ACCEPTED)
        if(!emailTemplate) {
            throw new EntityNotFoundError("email_template", DefaultTemplates.DEFAULT_PAYMENT_ACCEPTED)
        }

        let {body,subject} = EmailService.replaceBodyAndSubject(context, emailTemplate)

        EmailService.sendEmailAsync(context.user.email, subject, body)
            .catch(err=> logger.error(err))


        res.send({success:true})

    }  catch (e) {
        logger.error(e)
        return next(e)
    }

}*/

/*export async function createNewOrder(req: Request, res: Response, next: NextFunction) {
    let orderRequest = new OrderRequest(req.body)
    let userId = req.decoded.id

    let allowedDeliveryMethod = ["pos", "tiki", "jne", "sicepat"]
    if(!allowedDeliveryMethod.includes(orderRequest.delivery_method)) {
        return next(new BadRequestError(`Expected the following couriers: ${allowedDeliveryMethod.join(",")}`))
    }

    try {

        let user = await UserDAO.getById(userId)
        if(!user || !user.id) {
            return next(new EntityNotFoundError(`user`, userId))
        }

        //Caution: element in this one will contain order_id = -1 as no order has been yet made.
        let orderLines: OrderLine[] = []
        let totalPrice = 0
        //prepare the OrderLines object by checking the productid first
        for(let orderLine of orderRequest.order_lines) {
            let product = await ProductDAO.getById(orderLine.product_id)
            if(!product || !product.id) {
                return next(new EntityNotFoundError("product", orderLine.product_id))
            }
            totalPrice += product.price * (orderLine.quantity)
            orderLines.push(OrderLine.prepareNewWithoutOrderId(
                product.id,
                product.price,
                orderLine.quantity,
                orderLine.customization,
                orderLine.description
            ))
        }

        let deliveryOriginId = 152; //Wibi: TODO: Hardcoded. 152 (city) is DKI Jakarta, Jakarta Pusat for rajaongkir
        let formData = new FormData()
        formData.append("key", "process.env.RAJA_ONGKIR_KEY")
        formData.append("origin", deliveryOriginId+"")
        formData.append("destination", orderRequest.destination+"")
        formData.append("weight", 1000+"")
        formData.append("courier", orderRequest.delivery_method)

        let response = await fetch("https://api.rajaongkir.com/starter/cost?key=process.env.RAJA_ONGKIR_KEY", {
            headers: formData.getHeaders(),
            method: 'POST',
            body: <any>formData
        });
        let result

        //TODO: For now if calculation failed (out of quota or such), proceed with delivery_fee from client side.
        if(!response.ok) {
            result = await response.text()
            logger.error(result)
            //throw new Error("Request to third-party failed.")
        } else {
            result = await response.json()
        }


        //Wibi: TODO: what? wkwkwk ntar pikirin cara validation/fetch data yg benernya. kalo bisa delivery fee udah gak minta user lagi.
        let deliveryFee = result?.rajaongkir?.results[0]?.costs[0]?.cost[0]?.value ?? orderRequest.delivery_fee
        //logger.log(result)
        //When all is OK, create new order
        let preparedOrder = new Order({
            code: crypto.generateGUID(),
            user_id: userId,
            transaction_status: OrderTransactionState.UNPAID,
            shipment_status: ShipmentState.WAITING,
            address_info: orderRequest.address_info,
            price_sum: totalPrice,
            delivery_method: orderRequest.delivery_method,
            delivery_fee: deliveryFee
        }, ModelModes.CREATE)

        let order = await OrderDAO.create(preparedOrder)
        if(!order.id) {
            //if this happens, this is 100% our fault, so we throw handled internal server error
            return next(new HandledInternalServerError("Order ID not determined.", "ORDER_ID_NOT_DETERMINED"))
        }

        //Set all OrderLine order_id to the new order's ID, then save it to the database
        let resultOrderLines : OrderLine[] = []
        //now push all of the order lines into the database
        for(let orderLine of orderLines) {
            orderLine.order_id = order.id
            let result = await OrderLineDAO.create(orderLine)
            result.toObjectForm()
            resultOrderLines.push(result)
        }

        order.order_lines = resultOrderLines

        let context = new OrderContext(user, order, resultOrderLines)
        let resultContext = await transactionTools.createNewMidtransTransaction(context)

        /!*let emailTemplate = await EmailTemplateDAO.getByName(DefaultTemplates.DEFAULT_WAITING_PAYMENT)
        if(!emailTemplate) {
            logger.error(`Failed to send email for order as the email template "${DefaultTemplates.DEFAULT_WAITING_PAYMENT}" is not found! Please check!`)
        } else {

            let replacer = EmailService.generateReplacerFromContext(resultContext)
            let processedBody = EmailService.replaceEmailTemplate(replacer, emailTemplate.body_template)
            let processedSubject = EmailService.replaceEmailTemplate(replacer, emailTemplate.subject_template)

            EmailService.sendEmailAsync(user.email, processedSubject, processedBody)
                .catch(err=> logger.error(err))

        }*!/

        res.send(resultContext)

    } catch (e) {
        logger.error(e)
        return next(e)
    }
}*/


