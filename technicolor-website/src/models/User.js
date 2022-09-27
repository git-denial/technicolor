import ApiRequest from "../util/ApiRequest";

export default class User {
    login = async (user) => {
        return await ApiRequest.set('v1/user/login',"POST", user);
    }

    register = async (user) => {
        return await ApiRequest.set('v1/user/register',"POST", user);
    }

    updateProfile = async (user) => {
        return await ApiRequest.set('v1/user',"PUT", user);
    }

    getMyInfo = async () => {
        return await ApiRequest.set('v1/user',"GET");
    }
}
