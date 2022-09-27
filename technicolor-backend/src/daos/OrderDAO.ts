import DatabaseService from "../services/DatabaseService";
import Order from "../models/Order";


async function getAll() : Promise<Order[]> {
    let rows = await DatabaseService.query(`SELECT * FROM orders`)
    return Order.getOrders(rows)
}

async function getAllByUserId(userId: number|string) : Promise<Order[]> {
    let rows = await DatabaseService.query(`SELECT * FROM orders WHERE user_id = ?`, userId)
    return Order.getOrders(rows)
}

async function getAllByVendorId(vendorId: number|string) : Promise<Order[]> {
    let rows = await DatabaseService.query(`SELECT * FROM orders WHERE vendor_id = ?`, vendorId)
    return Order.getOrders(rows)
}

async function getAllByTransactionId(transactionId: number|string) : Promise<Order[]> {
    let rows = await DatabaseService.query(`SELECT * FROM orders WHERE transaction_id = ?`, transactionId)
    return Order.getOrders(rows)
}

async function getAllByTransactionIdAndVendorId(transactionId: number|string, vendorId: number|string) : Promise<Order[]> {
    let rows = await DatabaseService.query(`SELECT * FROM orders WHERE transaction_id = ? AND vendor_id = ?`, [transactionId, vendorId])
    return Order.getOrders(rows)
}

async function getById(orderId: number|string) : Promise<Order|null> {
    let rows = await DatabaseService.query(`SELECT * FROM orders WHERE id = ?`, orderId)
    return Order.getSingleOrder(rows)
}

async function create(order: Order) : Promise<Order>{

    if(order.order_lines)
        delete order.order_lines

    let result = await DatabaseService.query(`INSERT INTO orders SET ?`, order)
    order.id = result.insertId
    return order
}

async function update(orderId: number|string, order: Order) : Promise<any> {
    let rows = await DatabaseService.query(`UPDATE orders SET ? WHERE id = ?`, [order, orderId])

    return rows.affectedRows === 1
}

export default {
    getAll,
    getById,
    create,
    update,
    getAllByUserId,
    getAllByTransactionId, getAllByTransactionIdAndVendorId,
    getAllByVendorId,
}