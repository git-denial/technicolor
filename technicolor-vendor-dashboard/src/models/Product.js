import ApiRequest from "../utils/ApiRequest";

export default class Product {

  getAll = async () => {
    return await ApiRequest.set('/v1/products', 'GET');
  }

  register = async (body) => {
    return await ApiRequest.set('/v1/product/create', 'POST', body);
  }

  getById = async (id) => {
    return await ApiRequest.set('/v1/product/' + id,'GET');
  }

  edit = async (id, body) => {
    return await ApiRequest.set('/v1/product/' + id, 'PUT', body);
  }

  delete = async (id) =>{
    return await ApiRequest.set('/v1/product/' + id, 'DELETE');
  }

  getByVendor = async (id) => {
    return await ApiRequest.set('/v1/products/vendor/' + id, 'GET');
  }

  uploadImage = async (body) => {
    return await ApiRequest.setMultipart('/v1/upload/product/image', 'POST', body);
  }

}
