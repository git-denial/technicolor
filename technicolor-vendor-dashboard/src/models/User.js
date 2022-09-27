import ApiRequest from "../utils/ApiRequest";

export default class User {
  getAll = async () => {
    return await ApiRequest.set('/v1/users', "GET");
  }

  getById = async (id) => {
    return await ApiRequest.set('/v1/user/' + id, 'GET');
  }

  getMyself = async () => {
    return await ApiRequest.set('/v1/user', 'GET');
  }

  register = async (body) => {
    return await ApiRequest.set('/v1/user/register', 'POST', body);
  }

  login = async (body) => {
    return await ApiRequest.set('/v1/user/login', 'POST', body);
  }

  tokenLogin = async () => {
    return await ApiRequest.set('/v1/user/login/token','POST');
  }

  edit = async (id, body) => {
    return await ApiRequest.set('/v1/user/' + id, 'POST', body)
  }

  deleteById = async (id) => {
    return await ApiRequest.set('/v1/user/' + id, 'DELETE')
  }

  changePassword = async (body) => {
    return await ApiRequest.set('/v1/user/edit/password', 'POST', body);
  }
}
