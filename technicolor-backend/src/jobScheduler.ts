import scheduler from 'node-schedule'
import logger from "./utils/logger";
import OrderDAO from "./daos/OrderDAO";
import {BadRequestError, InternalServerError} from "./errors/RequestErrorCollection";
import FormData from "form-data";
import fetch from "node-fetch";
import Order, {ShipmentState} from "./models/Order";
import ModelModes from "./models/ModelModes";
import EmailScenario from "./services/EmailScenario";
import UserDAO from "./daos/UserDAO";
import EmailService from "./services/EmailService";
import TransactionDAO from "./daos/TransactionDAO";
import Transaction, {PaymentState} from "./models/Transaction";


async function trackDelivery(courier:string, no_resi:string){

    if(!courier){
        throw (new BadRequestError("missing 'kurir'!", "BAD_REQUEST"))
    }

    if(!no_resi){
        throw (new BadRequestError("missing 'nomor resi'!", "BAD_REQUEST"))
    }

    let formData = new FormData();
    formData.append("key", process.env.PREMIUM_RAJA_ONGKIR_KEY)
    formData.append("waybill", no_resi+"")
    formData.append("courier", courier+"")

    try {
        let request = await fetch(`https://pro.rajaongkir.com/api/waybill`, {
            headers: formData.getHeaders(),
            method: 'POST',
            body: <any>formData
        });

        let respond:any = await request.text();
        respond = JSON.parse(respond)
        respond = respond.rajaongkir

        if(respond.status.code !== 200) {
            logger.error(respond)
            return false;
        }

        return respond.result.delivered;

    }catch(e){
        throw (new InternalServerError(e))
    }

}

async function check_delivery_status(){
    try{

        let orders = await OrderDAO.getAll()

        for(let o of orders)
        {
            if(!o.delivery_receipt || !o.delivery_method || o.shipment_status !== ShipmentState.DELIVERING)
                continue;

            console.log("ORDERS:", o)
            let delivered  = await trackDelivery(o.delivery_method.toLowerCase(), o.delivery_receipt)

            if(delivered){
                o = new Order({...o, shipment_status:ShipmentState.ARRIVED}, ModelModes.UPDATE)

                console.log("ARRIVED")
                logger.log(o)

                await OrderDAO.update(<number>o.id, o)

                let {subject,body,config} = EmailScenario.order_arrived(o)
                let user = await UserDAO.getById(o.user_id)

                if(user){
                    await EmailService.sendEmailAsync(user.email, subject,body,config)
                }
            }

        }

    }
    catch(e){
        logger.error(e)
    }
}

async function check_transaction_expiry(){
    try{

        let transactions = await TransactionDAO.getAll()

        for(let t of transactions)
        {
            if(t.payment_status !== PaymentState.WAITING || !t.expired_at)
                continue;

            console.log(t)


            if(new Date(t.expired_at) < new Date())
            {
                console.log("EXPIRED")
                logger.log(t)

                t = new Transaction({...t, payment_status:PaymentState.EXPIRED}, ModelModes.UPDATE)
                await TransactionDAO.update(<number>t.id, t)

                let orders = await OrderDAO.getAllByTransactionId(<number>t.id)

                let {subject,body,config} = await EmailScenario.transaction_expired(orders)
                let user = await UserDAO.getById(t.requesting_user)

                if(user){
                    await EmailService.sendEmailAsync(user.email, subject,body,config)
                }

            }
        }

    }
    catch(e){
        logger.error(e)
    }

}


// */1 * * * *  =  * * * * * = every minute
// 0 0 * * * = everyday at 00:00

export default {
    initiateJobs: async()=>{

        scheduler.scheduleJob("DELIVERY_STATUS_CHECKER", '0 * * * *', async() => {
            logger.log("Checking delivery status")
            await check_delivery_status()
        })

        scheduler.scheduleJob("TRANSACTION_EXPIRY_CHECKER", '5 * * * *', async() => {
            logger.log("Checking transaction expiry")
            await check_transaction_expiry()
        })
    }
}