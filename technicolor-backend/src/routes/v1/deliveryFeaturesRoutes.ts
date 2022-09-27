import {Express} from "express";
import * as deliveryFeaturesController from "../../controllers/delivery/deliveryFeaturesController"

export default (app: Express) =>{

    app.route("/v1/deliveryServices/provinces")
        .get(deliveryFeaturesController.getAllProvince)

    app.route("/v1/deliveryServices/cities")
        .get(deliveryFeaturesController.getAllCity)

    app.route("/v1/deliveryServices/provinces/:provinceId")
        .get(deliveryFeaturesController.getAllCityWithProvince)

    app.route("/v1/deliveryServices/price")
        .post(deliveryFeaturesController.getPrice)

    app.route("/v1/deliveryServices/available")
        .post(deliveryFeaturesController.getAvailableOnly)

    app.route("/v1/deliveryServices/track-delivery")
        .post(deliveryFeaturesController.trackDelivery)

    app.route("/v1/deliveryServices/couriers").get(deliveryFeaturesController.getAllCourier)

}
