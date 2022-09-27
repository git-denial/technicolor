import GeneralRequest from "../util/GeneralRequest";
import ApiRequest from "../util/ApiRequest";

export default class ContactForm {

    submitForm = async (body) => {
        return await ApiRequest.set('v1/contactForm', "PUT", body);
    }

}
