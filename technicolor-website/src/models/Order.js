import ApiRequest from "../util/ApiRequest";

export default class Order {
    getMyOrder = async () => {
        return await ApiRequest.set('v1/order/user',"POST");
    }

    track = async (courier, resiNo) => {
        return await ApiRequest.set('v1/deliveryServices/track-delivery',"POST", {
            courier,
            no_resi: resiNo
        });
    }
}
