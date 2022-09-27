import DatabaseService from "../services/DatabaseService";
import OrderLine from "../models/OrderLine";


async function getAll() : Promise<OrderLine[]> {
    let rows = await DatabaseService.query(`SELECT * FROM order_lines`)
    return OrderLine.getOrderLines(rows)
}

async function getById(orderLineId: number) : Promise<OrderLine|null> {
    let rows = await DatabaseService.query(`SELECT * FROM order_lines WHERE id = ?`, orderLineId)
    return OrderLine.getSingleOrderLine(rows)
}

async function getByOrderId(orderId: number|string) : Promise<OrderLine[]> {
    let rows = await DatabaseService.query(`
    SELECT order_lines.*, 
    products.vendor_id p_vendor_id,
    products.size_description p_size_description,  
    products.name p_name,
    products.description p_description,  
    products.price p_price,  
    products.main_photo_url p_main_photo_url,
    products.photos p_photos,
    products.available p_available,
    products.weight p_weight,
    products.size p_size,
    products.active p_active
    FROM order_lines
    INNER JOIN products on products.id = order_lines.product_id
    WHERE order_lines.order_id = ?` , orderId)

    return OrderLine.getOrderLines(rows)
}

async function create(orderLine: OrderLine) : Promise<OrderLine>{
    orderLine.toStringForm()

    if(orderLine.product)
        delete orderLine.product

    let result = await DatabaseService.query(`INSERT INTO order_lines SET ?`, orderLine)
    orderLine.id = result.insertId
    return orderLine
}


export default {
    getAll,
    getById,
    create,
    getByOrderId
}
