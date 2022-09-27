import ApiRequest from "../utils/ApiRequest";

export default class Transaction {
  create = async (body) => {
    return await ApiRequest.set('/v1/create', "POST", body);
  }

  getAll = async () => {
    return await ApiRequest.set('/v1/transactions','GET');
  }
t
  getById = async (id) => {
    return await ApiRequest.set('/v1/transactions/' + id,'GET');
  }

  edit = async (id, body) => {
    return await ApiRequest.set('/v1/transaction/' + id,'PUT', body);
  }

  getByUserId = async (id) => {
    return await ApiRequest.set('/v1/transaction/user/' + id, 'GET')
  }

  confirmPayment = async (id) => {
    return await ApiRequest.set('/v1/transaction/confirm/' + id, 'POST')
  }

  getByVendorId = async (id) => {
    return await ApiRequest.set('/v1/transaction/vendor/' + id, 'GET')
  }
}
