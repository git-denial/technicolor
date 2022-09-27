import {Express} from "express";
import auth from "../../middlewares/authMiddleware";
import orderController from "../../controllers/order/orderController";


export default function (app: Express) {


    app.route("/v1/orders")
        .get(auth.admin, orderController.getAll)

    app.route("/v1/order/create")
        .post(auth.user, orderController.create)

    app.route("/v1/order/user")
        .post(auth.admin_or_user, orderController.getAllByUserId)

    app.route("/v1/order/:id")
        .get(auth.admin, orderController.getById)
        .post(auth.admin, orderController.update)

    app.route("/v1/order/vendor/:id")
        .get(auth.admin_or_vendor, orderController.getAllByVendorId)

    app.route("/v1/order/transaction/:id")
        .get(auth.any,orderController.getAllByTransactionId)

    app.route("/v1/order/processing/:id")
        .get(auth.vendor, orderController.processing)

    app.route("/v1/order/delivering/:id")
        .post(auth.vendor, orderController.delivering)
}

