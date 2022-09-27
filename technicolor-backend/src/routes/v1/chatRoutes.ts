import {Express} from "express";
import * as chatController from "../../controllers/chat/chatController"
import auth from "../../middlewares/authMiddleware";

export default function (app: Express) {

    app.route("/v1/chat/user")
        .put(auth.user, chatController.addChatUser)

    app.route("/v1/chat/vendor")
        .put(auth.vendor, chatController.addChatVendor)

    app.route("/v1/chat/vendor/partners")
        .get(auth.vendor, chatController.getChatPartnersForVendor)

    app.route("/v1/chat/user/partners")
        .get(auth.user, chatController.getChatPartnersForUser)

    app.route("/v1/chat/user/:vendor_id")
        .get(auth.user, chatController.getChatFromUserToVendor)

    app.route("/v1/chat/vendor/:user_id")
        .get(auth.vendor, chatController.getChatFromVendorToUser)





}
