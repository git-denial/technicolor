import GeneralRequest from "../util/GeneralRequest";
import ApiRequest from "../util/ApiRequest";

export default class Location {

    getAllProvince = async () => {
        return await ApiRequest.set('v1/deliveryServices/provinces', "GET");
    }

    getCityById = async (id) => {
        return await ApiRequest.set(`v1/deliveryServices/provinces/`+id, "GET");
    }

    getAllCities = async () => {
        return await ApiRequest.set('v1/deliveryServices/cities',"GET");
    }

    getPrice = async (obj) => {
        return await ApiRequest.set('v1/deliveryServices/price',"POST", obj);
    }

    getAvailableCourier = async (obj) => {
        return await ApiRequest.set('v1/deliveryServices/available',"POST", obj);
    }
}
