import apiConfig from "./apiConfig";


export default class ApiRequest {

  static set = async (endpoint, method, body) => {

    let token = sessionStorage.token || localStorage.token

    console.log('API ACCESS: ' + endpoint);
    let request = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `bearer ${token}` : null,
        Accept: 'application/json',
      },
      body: JSON.stringify(body)
      // body: "afdadsf"
    };

    let response = await fetch(apiConfig.base_url + endpoint, request);

    if (response.ok) {
      return response.json();
    }

    let error = await response.json();
    console.log(error)

    if (error.msg === 'JWT_EXPIRED' || error.msg === 'NO_TOKEN_PROVIDED' || error.msg === 'INVALID_TOKEN' || error.msg === 'BAD_TOKEN_FORMAT' || error.msg === 'NO_SECRET_DEFINED' || error.error_message === 'JWT_MALFORMED' || error.error_message?.msg === 'JWT_MALFORMED'|| error.error_message === 'JWT_EXPIRED' || error.code === "SUBSCRIPTION_EXPIRED") {
      delete sessionStorage.token;
      delete localStorage.token;
      // alert('Login timeout')
      window.location.reload();
      throw error;
    }

    throw error;
  }

  static setWithToken = async (endpoint, method, body,token) => {

    // let token = GlobalData.token ? GlobalData.token : Cookies.get("token") ? Cookies.get("token") : null
    console.log('API ACCESS: ' + endpoint);

    let request = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `bearer ${token}` : null,
        Accept: 'application/json',
      },
      body: JSON.stringify(body)
      // body: "afdadsf"
    };

    let response = await fetch(apiConfig.base_url + endpoint, request);

    if (response.ok) {
      return response.json();
    }

    let error = await response.json();
    console.log(error)

    if (error.msg === 'JWT_EXPIRED' || error.msg === 'NO_TOKEN_PROVIDED' || error.msg === 'INVALID_TOKEN' || error.msg === 'BAD_TOKEN_FORMAT' || error.msg === 'NO_SECRET_DEFINED' || error.error_message === 'JWT_MALFORMED' || error.error_message.msg === 'JWT_MALFORMED') {
      delete sessionStorage.token;
      delete localStorage.token;
      alert('Login timeout')
      window.location.reload();
      throw error;
    }

    throw error;
  }

  static getMedia = async (endpoint, method, body) => {

    // let token = GlobalData.token ? GlobalData.token : Cookies.get("token") ? Cookies.get("token") : null
    let token = sessionStorage.token || localStorage.token

    console.log('API ACCESS: ' + endpoint);
    let request = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `bearer ${token}` : null,
        Accept: 'application/json',
      },
      body: JSON.stringify(body)
      // body: "afdadsf"
    };

    let response = await fetch(apiConfig.base_url + endpoint, request);
    console.log(response);

    if (response.ok) {
      console.log(response);
      return response.blob();
    }

    let error = await response.json();
    console.log(error)

    // if(error.msg){
    //   delete sessionStorage.token;
    //   delete localStorage.token;
    //   alert('Login timeout')
    //   window.location.reload();
    //   throw error;
    // }

    throw error;
  }

  static setMultipart = async (endpoint, method, body) => {
    // console.log(`token: ${GlobalData.token}`);
    let token = sessionStorage.token || localStorage.token

    console.log('API ACCESS: ' + endpoint);

    let response = await fetch(apiConfig.base_url + endpoint, {
      method: method,
      headers: {
        Authorization: `bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
      },
      body: body
      // body: "afdadsf"
    });

    if (response.ok) {
      console.log(response);
      return response.json()
    }

    let error = await response.json()
    console.log(error)

    if (error.msg === 'JWT_EXPIRED' || error.msg === 'NO_TOKEN_PROVIDED' || error.msg === 'INVALID_TOKEN' || error.msg === 'BAD_TOKEN_FORMAT' || error.msg === 'NO_SECRET_DEFINED' || error.error_message === 'JWT_MALFORMED' || error.error_message.msg === 'JWT_MALFORMED') {
      delete sessionStorage.token;
      delete localStorage.token;
      alert('Login timeout')
      window.location.reload();
      throw error;
    }

    throw error
  }


}
