import {NextFunction, Request, Response} from "express";
import {
    BadRequestError,
    EntityNotFoundError,
    HandledInternalServerError,
    InternalServerError, UnauthorizedError
} from "../../errors/RequestErrorCollection";
import OrderLineDAO from "../../daos/OrderLineDAO";
import OrderDAO from "../../daos/OrderDAO";


async function getByOrderId(req:Request, res:Response, next:NextFunction){

    try {

        let order = await OrderDAO.getById(req.params.id)


        if(!order)
            return next(new EntityNotFoundError("Order", req.params.id))

        if(req.decoded.user_id && (req.decoded.user_id !== order.user_id) ){
                return next(new UnauthorizedError("You are not authorized to view these order lines"))
        }
        else if(req.decoded.vendor_id && (req.decoded.vendor_id !== order.vendor_id) ){
                return next(new UnauthorizedError("You are not authorized to view these order lines"))
        }

        let orderlines = await OrderLineDAO.getByOrderId(req.params.id)
        if(!orderlines) {
            return next(new EntityNotFoundError("Orderline with order_id", req.params.id))
        }

        return res.send(orderlines)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export default {
    getByOrderId
}