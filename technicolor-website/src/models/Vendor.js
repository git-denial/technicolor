import ApiRequest from "../util/ApiRequest";

export default class Vendor {
    getByCategory = async (category) => {
        return await ApiRequest.set('v1/vendor/category',"POST", {
            category
        });
    }

    getById = async (id) => {
        return await ApiRequest.set(`v1/vendor/${id}` , 'GET')
    }
}
