import ApiRequest from "../utils/ApiRequest";

export default class Vendor {

  getAll = async () => {
    return await ApiRequest.set('/v1/categories', 'GET')
  }

  create = async (body) => {
    return await ApiRequest.set('/v1/category', 'POST', body)
  }

  edit = async (id, body) => {
    return await ApiRequest.set('/v1/category/' + id, 'PUT', body)
  }

  addCategoryToVendor = async (vendorId, body) => {
    return await ApiRequest.set('/v1/category/vendor/' + vendorId, 'POST', body)
  }

  editCategoryVendor = async (vendorId, body) => {
    return await ApiRequest.set('/v1/category/vendor/' + vendorId, 'PUT', body)
  }

  getByName = async (body) => {
    return await ApiRequest.set('/v1/vendor/category', 'POST', body)
  }

}
