import ApiRequest from "../utils/ApiRequest";

export default class Product {

  getProvince = async () => {
    return await ApiRequest.set('/v1/deliveryServices/provinces', 'GET');
  }

  getCity = async (id) => {
    return await ApiRequest.set('/v1/deliveryServices/provinces/' + id,'GET');
  }
}
