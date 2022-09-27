import ApiRequest from "../utils/ApiRequest";

export default class Vendor {

  login = async (body) => {
    return await ApiRequest.set('/v1/vendor/login', 'POST', body)
  }

  tokenLogin = async () => {
    return await ApiRequest.set('/v1/vendor/login/token', 'POST')
  }

  getSelf = async () => {
    return await ApiRequest.set('/v1/vendor', 'GET');
  }

  getAll = async () => {
    return await ApiRequest.set('/v1/vendors', 'GET');
  }

  register = async (body) => {
    return await ApiRequest.set('/v1/vendor/register', 'POST', body);
  }

  getById = async (id) => {
    return await ApiRequest.set('/v1/vendor/' + id,'GET');
  }

  edit = async (id, body) =>{
    return await ApiRequest.set('/v1/vendor/' + id, 'POST', body);
  }

  delete  = async (id, body) =>{
    return await ApiRequest.set('/v1/vendor/' + id, 'DELETE', body);
  }

  editPassword = async (body) => {
    return await ApiRequest.set('/v1/vendor/edit/password','POST' ,body)
  }

  uploadLogo = async (body) => {
    return await ApiRequest.setMultipart('/v1/upload/vendor/image', 'POST', body)
  }
}
