import {Express} from "express";
import * as contactFormController from "../../controllers/contactForm/contactFormController"
import auth from "../../middlewares/authMiddleware";

export default function (app: Express) {

    app.route("/v1/contactForm")
        .get(auth.admin, contactFormController.getAllContactForms)
        .put(auth.optional,contactFormController.createContactForms)

    app.route("/v1/contactForm/:id")
        .get(auth.admin,contactFormController.getContactFormsById)
        .put(auth.admin,contactFormController.update)

    app.route("/v1/contactForm/user/:user_id")
        .get(auth.admin_or_user,contactFormController.getContactFormsByUserId)

}
