import {Express} from "express";
import transactionController from "../../controllers/transaction/transactionController";
import auth from "../../middlewares/authMiddleware";

export default (app: Express) =>{

    app.route("/v1/transaction").post(auth.user,transactionController.create)

    app.route("/v1/transactions").get(auth.admin,transactionController.getAll)

    app.route("/v1/transaction/:transaction_id")
        .get(auth.any,transactionController.getById)
        .put(auth.admin,transactionController.update)

    app.route("/v1/transaction/user/:user_id").get(auth.any,transactionController.getByUserId)

    app.route("/v1/transaction/vendor/:vendor_id").get(auth.vendor,transactionController.getByVendorId)

    app.route("/v1/transaction/confirm/:transaction_id").post(auth.admin,transactionController.confirm)
}
