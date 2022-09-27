import {Express} from "express";
import globalController from "../../controllers/globalController"


export default (app: Express) =>{

    app.route("/v1/global_login")
        .post(globalController.login)

    app.route("/v1/global_search/vendor_product")
        .post(globalController.getByString)

}
