import ApiRequest from "../utils/ApiRequest";

export default class Chat {

  getChatPartners = async () => {
    return await ApiRequest.set('/v1/chat/vendor/partners', 'GET')
  }

  getChat = async (userId) => {
    return await ApiRequest.set('/v1/chat/vendor/'+userId, 'GET')
  }

  sendChat = async (params) => {
    return await ApiRequest.set('/v1/chat/vendor', "PUT", params);
  }

}
