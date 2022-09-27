import ApiRequest from "../utils/ApiRequest";

export default class Contact {

  getAll = async () => {
    return await ApiRequest.set('/v1/contactForm', 'GET');
  }

  getById = async (id) => {
    return await ApiRequest.set('/v1/contactForm/' + id, 'GET');
  }
}
