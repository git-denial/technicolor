import ApiRequest from "../util/ApiRequest";

export default class Transaction {
    create = async (order) => {
        return await ApiRequest.set('v1/transaction',"POST", order);
    }
}
