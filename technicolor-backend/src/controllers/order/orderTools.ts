/*
import OrderContext from "../../models/OrderContext";
import OrderDAO from "../../daos/OrderDAO";
import OrderLineDAO from "../../daos/OrderLineDAO";
import * as UserDAO from "../../daos/UserDAO";
import Transaction from "../../models/Transaction";
import TransactionDAO from "../../daos/TransactionDAO";



export async function generateOrderContextFromOrderId(orderId: number|string) : Promise<OrderContext|null> {
    let order = await OrderDAO.getById(orderId)
    if(!order || !order.id) {
        return null
    }

    let orderLines = await OrderLineDAO.getByOrderId(orderId)

    let user = await UserDAO.getById(order.user_id)
    if(!user || !user.id) {
        return null
    }

    let transaction = await TransactionDAO.getByOrderId(order.id)
    if(transaction) {
        return new OrderContext(user, order, orderLines, transaction)
    } else {
        return new OrderContext(user, order, orderLines)
    }


}

export default {
    generateOrderContextFromOrderId
}*/
