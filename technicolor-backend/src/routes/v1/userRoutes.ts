import {Express} from "express";
import * as userController from "../../controllers/user/userController"
import auth from "../../middlewares/authMiddleware";

export default function (app: Express) {

    app.route("/v1/user")
        .get(auth.user, userController.getMyself)
        .put(auth.user, userController.editSelf)

    app.route("/v1/user/login/token")
        .post(auth.user, userController.tokenLogin)

    app.route("/v1/user/edit/password")
        .post(auth.user,userController.changePassword)

    app.route("/v1/user/login")
        .post(userController.login)

    app.route("/v1/user/register")
        .post(userController.register)

    app.route("/v1/users")
        .get(auth.admin,userController.getAll)

    app.route("/v1/user/:user_id")
        .get(auth.admin,userController.getById)
        .post(auth.admin,userController.edit)
        .delete(auth.admin,userController.ban)
        .patch(auth.admin,userController.unBan)



}