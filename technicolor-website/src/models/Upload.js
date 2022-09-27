import ApiRequest from "../util/ApiRequest";

export default class Upload {
    uploadPaymentProof = async (body) => {
        return await ApiRequest.setMultipart('v1/upload/payment_proof/image',"POST", body);
    }
}
