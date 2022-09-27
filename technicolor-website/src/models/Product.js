import ApiRequest from "../util/ApiRequest";

export default class Product {
    getByCategory = async (category) => {
        return await ApiRequest.set('v1/products/category',"POST", {
            category
        });
    }

    searchVendorOrProduct = async (query) => {
        return await ApiRequest.set('v1/global_search/vendor_product',"POST", {
            query
        });
    }

    getByVendorId = async (vendorId) => {
        return await ApiRequest.set(`v1/products/vendor/${vendorId}`,"GET");
    }

    getById = async (id) => {
        return await ApiRequest.set(`v1/product/${id}`,"GET");
    }
}
