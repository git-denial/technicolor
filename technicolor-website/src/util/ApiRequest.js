import apiConfig from "./apiConfig"

export default class ApiRequest {

    static set = async (endpoint, method, body) => {
        console.log(`[${method}] ${endpoint}`)
        console.log(`headers: `, {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: localStorage.getItem('user') ? 'Bearer ' + JSON.parse(localStorage.getItem('user')).token : null,
        })

        let response = await fetch(apiConfig.base_url + endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: localStorage.getItem('user') ? 'Bearer '  + JSON.parse(localStorage.getItem('user')).token : null,
            },
            body: JSON.stringify(body)
        });

        if(response.ok){
            console.log('response : ', response)

            return response.json()
        }else{
            let error = await response.json()

            console.log('error : ', error)

            throw error

        }
    }

    static set = async (endpoint, method, body) => {
        console.log(`[${method}] ${endpoint}`)
        console.log(`headers: `, {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: localStorage.getItem('user') ? 'Bearer ' + JSON.parse(localStorage.getItem('user')).token : null,
        })

        let response = await fetch(apiConfig.base_url + endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: localStorage.getItem('user') ? 'Bearer '  + JSON.parse(localStorage.getItem('user')).token : null,
            },
            body: JSON.stringify(body)
        });

        if(response.ok){
            console.log('response : ', response)

            return response.json()
        }else{
            let error = await response.json()

            console.log('error : ', error)

            throw error

        }
    }

    static setMultipart = async (endpoint, method, body) => {
        console.log('API ACCESS: ' + endpoint);

        let response = await fetch(apiConfig.base_url+ endpoint, {
            method: method,
            headers: {
                Authorization: localStorage.getItem('user') ? 'Bearer '  + JSON.parse(localStorage.getItem('user')).token : null,
                'Access-Control-Allow-Origin': '*',
            },
            body: body
        });

        if(response.ok){
            console.log('response : ', response)

            return response.json()
        }else{
            let error = await response.json()

            console.log('error : ', error)

            throw error

        }
    }
}
