import {Express} from "express";
import orderlineController from "../../controllers/order-line/orderLineController";
import auth from "../../middlewares/authMiddleware";


export default function (app: Express) {

    app.route("/v1/order-line/order/:id")
        .get(auth.any,orderlineController.getByOrderId)
}