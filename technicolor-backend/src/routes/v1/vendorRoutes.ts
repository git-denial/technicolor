import {Express} from "express";
import * as vendorController from "../../controllers/vendor/vendorController"
import auth from "../../middlewares/authMiddleware";

export default function (app: Express) {

    app.route("/v1/vendor")
        .get(auth.vendor, vendorController.getMyself)
        .put(auth.vendor, vendorController.editSelf)

    app.route("/v1/vendor/edit/password")
        .post(auth.vendor,vendorController.changePassword)

    app.route("/v1/vendor/login/token")
        .post(auth.vendor, vendorController.tokenLogin)

    app.route("/v1/vendor/login")
        .post(vendorController.login)

    app.route("/v1/vendors")
        .get(auth.admin,vendorController.getAll)

    app.route("/v1/vendor/register")
        .post(auth.admin,vendorController.register)

    app.route("/v1/vendor/category")
        .post(vendorController.getByCategory)

    app.route("/v1/vendor/:vendor_id")
        .get(vendorController.getById)
        .post(auth.admin,vendorController.edit)
        .delete(auth.admin,vendorController.ban)
        .patch(auth.admin,vendorController.unBan)



}