import {Express} from "express";
import * as productController from "../../controllers/product/productController"
import auth from "../../middlewares/authMiddleware";

export default function (app: Express) {

    app.route("/v1/products")
        .get(auth.admin,productController.getAllProducts)

    app.route("/v1/product/create")
        .post(auth.admin_or_vendor, productController.create)

    app.route("/v1/products/category")
        .post(productController.getByCateogry)

    app.route("/v1/product/:product_id")
        .get(productController.getProductById)
        .put(auth.admin_or_vendor,productController.updateProduct)
        .delete(auth.admin_or_vendor,productController.deleteProduct)
        .patch(auth.admin_or_vendor,productController.undeleteProduct)

    app.route("/v1/products/vendor/:id")
        .get(productController.getProductByVendorId)


}
