import GeneralRequest from "../util/GeneralRequest";
import ApiRequest from "../util/ApiRequest";

export default class Chat {

    sendChat = async (params) => {
        return await ApiRequest.set('v1/chat/user', "PUT", params);
    }

    getChatFromVendor = async (userId) => {
        return await ApiRequest.set('v1/chat/user/'+userId, "GET");
    }

    getChatPartners = async () => {
        return await ApiRequest.set('v1/chat/user/partners', "GET");
    }

}
