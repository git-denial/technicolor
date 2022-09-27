import {Express} from "express";
import * as categoryController from "../../controllers/categoryController"
import auth from "../../middlewares/authMiddleware";


export default (app: Express) =>{

    app.route("/v1/category")
        .post(auth.admin,categoryController.create)

    app.route("/v1/categories")
        .get(categoryController.getAll)

    app.route("/v1/category/:id")
        .put(auth.admin,categoryController.edit)

    app.route("/v1/category/vendor/:vendor_id")
        .post(auth.admin,categoryController.addCategorytoVendor)
        .put(auth.admin, categoryController.editCategoryVendor)
}
