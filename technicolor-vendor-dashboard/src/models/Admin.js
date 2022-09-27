import ApiRequest from "../utils/ApiRequest";

export default class Admin {

  login = async (body) => {
    return await ApiRequest.set('/v1/admin/login', 'POST', body)
  }

  tokenLogin = async () => {
    return await ApiRequest.set('/v1/admin/tokenlogin', 'POST')
  }

  getAll = async () => {
    return await ApiRequest.set('/v1/admin', 'GET');
  }

  register = async (body) => {
    return await ApiRequest.set('/v1/admin/register', 'POST', body);
  }

  getById = async (id) => {
    return await ApiRequest.set('/v1/admin/' + id,'GET');
  }

  edit = async (id, body) =>{
    return await ApiRequest.set('/v1/admin/' + id, 'PUT', body);
  }

  editPassword = async (body) => {
    return await ApiRequest.set('/v1/admin/edit/password','POST' ,body)
  }

  editSelf = async (body) => {
    return await ApiRequest.set('/v1/adminUpdateSelf','PUT', body)
  }

  globalLogin = async (body) => {
    return await ApiRequest.set('/v1/global_login','POST', body);
  }
}
