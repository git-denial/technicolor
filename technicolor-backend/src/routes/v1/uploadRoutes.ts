import {Express} from "express";
import * as uploadController from "../../controllers/uploadController"
import auth from "../../middlewares/authMiddleware";


export default (app: Express) =>{

    app.route("/v1/upload/vendor/image")
        .post(auth.admin_or_vendor,uploadController.uploadVendorLogo)

    app.route("/v1/upload/product/image")
        .post(auth.admin_or_vendor,uploadController.uploadProductImage)

    app.route("/v1/upload/payment_proof/image")
        .post(auth.user,uploadController.uploadPaymentProof)

    app.route("/v1/download/image")
        .post(uploadController.download)

}
