import {Express} from "express";
import * as adminController from "../../controllers/admin/adminController"
import auth from "../../middlewares/authMiddleware";

export default (app: Express) =>{

    app.route("/v1/admin")
        .get(auth.admin,adminController.getAllAdmins)

    app.route("/v1/admin/login")
        .post(adminController.login)

    app.route("/v1/admin/shortlogin")
        .post(adminController.shortLogin)

    app.route("/v1/admin/tokenlogin")
        .post(auth.admin, adminController.tokenLogin)

    app.route("/v1/admin/register")
        .post(auth.admin,adminController.register)

    app.route("/v1/adminUpdateSelf")
        .put(auth.admin, adminController.editAdminSelf)

    app.route("/v1/adminGetSelf")
        .get(auth.admin, adminController.getSelf)

    app.route("/v1/admin/edit/password")
        .post(auth.admin,adminController.changeAdminPassword)

    app.route("/v1/admin/:admin_id")
        .get(auth.admin,adminController.getAdminById)
        .put(auth.admin,adminController.editAdmin)

}
