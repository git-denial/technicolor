import ApiRequest from "../utils/ApiRequest";

export default class Order {

  create = async (body) => {
    return await ApiRequest.set('/v1/order/create', 'POST', body)
  }

  getAll = async () => {
    return await ApiRequest.set('/v1/orders', 'GET')
  }

  getOrderLineById = async (id) => {
    return await ApiRequest.set('/v1/order-line/order/' + id, 'GET')
  }

  getById = async (id) => {
    return await ApiRequest.set('/v1/order/' + id, 'GET')
  }

  update = async (id, body) => {
      return await ApiRequest.set('/v1/order/' + id, 'POST', body)
  }

  getByUserId = async (id) => {
    return await ApiRequest.set('/v1/order/user/' + id, 'GET')
  }

  getByVendorId = async (id) => {
    return await ApiRequest.set('/v1/order/vendor/' + id, 'GET')
  }

  getByTransactionId = async (id) => {
    return await ApiRequest.set('/v1/order/transaction/' + id, 'GET')
  }

  confirmOrder = async (id) => {
    return await ApiRequest.set('/v1/order/processing/'+id, 'GET')
  }

  inputReceipt = async (vendorId, body) => {
    return await ApiRequest.set('/v1/order/delivering/' + vendorId, 'POST', body)
  }
}
